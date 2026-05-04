import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { QUESTIONS } from "@/lib/questions";
import {
  computeRawScores,
  normalize,
  assessIntegrity,
  applySignalBoosts,
} from "@/lib/scoring";
import { extractGitHubSignals, signalsToBoosts } from "@/lib/githubSignals";
import { generateGitHubInsights } from "@/lib/gemini";
import { buildResultPayload } from "@/lib/results";
import type {
  AnswerRecord,
  GitHubInsightReport,
  GitHubSignals,
  ScoreVector,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth().catch(() => null);
  type AuthedUser = {
    id?: string;
    githubLogin?: string;
    githubAccessToken?: string;
  };
  const authUser = session?.user as AuthedUser | undefined;
  const userId = authUser?.id ?? null;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in with GitHub before finishing the trial." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { attemptId, answers } = body as {
    attemptId: string;
    answers: AnswerRecord[];
  };
  if (!attemptId || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "attemptId and answers[] required" },
      { status: 400 },
    );
  }

  const { raw } = computeRawScores(answers, QUESTIONS);
  let normalized = normalize(raw);
  const integrity = assessIntegrity(answers, QUESTIONS);
  let githubSignals: GitHubSignals | undefined;
  let signalBoosts: Partial<ScoreVector> | undefined;
  let githubInsights: GitHubInsightReport | undefined;

  const ghLogin = authUser?.githubLogin;
  const ghToken = authUser?.githubAccessToken;
  if (ghLogin && ghToken) {
    try {
      const sig = await extractGitHubSignals(ghLogin, ghToken);
      if (sig) {
        githubSignals = sig;
        signalBoosts = signalsToBoosts(sig);
        normalized = applySignalBoosts(normalized, signalBoosts);
      }
    } catch (e) {
      console.warn("[/quiz/finish] github signals failed:", e);
    }
  }

  const finishedAt = new Date();
  const preliminaryResult = buildResultPayload({
    attemptId,
    vector: normalized,
    raw,
    integrity: {
      suspect: integrity.suspect,
      note: integrity.note,
      centroidRate: integrity.centroidRate,
      acquiescenceRate: integrity.acquiescenceRate,
    },
    githubSignals: githubSignals ?? null,
    signalBoosts: signalBoosts ?? null,
    finishedAt,
  });

  if (githubSignals) {
    githubInsights = await generateGitHubInsights({
      primaryClass: preliminaryResult.primary.name,
      vector: normalized,
      strongest: preliminaryResult.strongest,
      weakest: preliminaryResult.weakest,
      githubSignals,
      signalBoosts,
    });
  }

  const result = buildResultPayload({
    attemptId,
    vector: normalized,
    raw,
    integrity: {
      suspect: integrity.suspect,
      note: integrity.note,
      centroidRate: integrity.centroidRate,
      acquiescenceRate: integrity.acquiescenceRate,
    },
    githubSignals: githubSignals ?? null,
    signalBoosts: signalBoosts ?? null,
    githubInsights: githubInsights ?? null,
    finishedAt,
  });

  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.attempts).updateOne(
      { attemptId, userId },
      {
        $setOnInsert: { attemptId, userId, startedAt: new Date() },
        $set: {
          answers,
          raw,
          normalized,
          primaryClass: result.primary.id,
          multiclass: result.multiclass.map((m) => m.id),
          cosineToPrimary: result.ranked[0]?.cosine ?? null,
          confidence: result.confidence,
          confidenceLabel: result.confidenceLabel,
          integritySuspect: integrity.suspect,
          integrityNote: integrity.note ?? null,
          centroidRate: integrity.centroidRate,
          acquiescenceRate: integrity.acquiescenceRate,
          githubSignals: githubSignals ?? null,
          signalBoosts: signalBoosts ?? null,
          githubInsights: githubInsights ?? null,
          userId,
          finishedAt,
        },
      },
      { upsert: true },
    );
  } catch (e) {
    console.warn("[/quiz/finish] DB persist failed (non-fatal):", e);
  }

  return NextResponse.json(result);
}
