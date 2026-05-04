import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { QUESTIONS } from "@/lib/questions";
import {
  computeRawScores,
  normalize,
  assignClass,
  dumbbell,
  assessIntegrity,
  applySignalBoosts,
} from "@/lib/scoring";
import { METRICS } from "@/lib/metrics";
import { extractGitHubSignals, signalsToBoosts } from "@/lib/githubSignals";
import type {
  AnswerRecord,
  MetricCode,
  GitHubSignals,
  ScoreVector,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
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

  const session = await auth();
  type AuthedUser = {
    id?: string;
    githubLogin?: string;
    githubAccessToken?: string;
  };
  const authUser = session?.user as AuthedUser | undefined;
  const userId = authUser?.id ?? null;
  let githubSignals: GitHubSignals | undefined;
  let signalBoosts: Partial<ScoreVector> | undefined;

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

  const assignment = assignClass(normalized);
  const db_dumbbell = dumbbell(normalized);

  const result = {
    attemptId,
    vector: normalized,
    raw,
    primary: {
      id: assignment.primary.id,
      name: assignment.primary.name,
      alias: assignment.primary.alias,
      color: assignment.primary.color,
      tagline: assignment.primary.tagline,
      motto: assignment.primary.motto,
      blurb: assignment.primary.blurb,
      shadow: assignment.primary.shadow,
      signatureRoles: assignment.primary.signatureRoles,
      voice: assignment.primary.voice,
    },
    confidence: Number(assignment.confidence.toFixed(3)),
    confidenceLabel: assignment.confidenceLabel,
    integrity: {
      suspect: integrity.suspect,
      note: integrity.note,
      centroidRate: Number(integrity.centroidRate.toFixed(2)),
      acquiescenceRate: Number(integrity.acquiescenceRate.toFixed(2)),
    },
    multiclass: assignment.multiclass.map((m) => ({
      id: m.archetype.id,
      name: m.archetype.name,
      cosine: Number(m.cosine.toFixed(4)),
    })),
    ranked: assignment.ranked.slice(0, 5).map((r) => ({
      id: r.archetype.id,
      name: r.archetype.name,
      cosine: Number(r.cosine.toFixed(4)),
    })),
    strongest: db_dumbbell.strongest.map((s) => ({
      code: s.m,
      name: METRICS[s.m as MetricCode].name,
      score: s.v,
    })),
    weakest: db_dumbbell.weakest.map((s) => ({
      code: s.m,
      name: METRICS[s.m as MetricCode].name,
      score: s.v,
    })),
    githubSignals: githubSignals ?? null,
    signalBoosts: signalBoosts ?? null,
    finishedAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.attempts).updateOne(
      { attemptId },
      {
        $set: {
          answers,
          raw,
          normalized,
          primaryClass: assignment.primary.id,
          multiclass: assignment.multiclass.map((m) => m.archetype.id),
          cosineToPrimary: assignment.primaryCosine,
          confidence: assignment.confidence,
          confidenceLabel: assignment.confidenceLabel,
          integritySuspect: integrity.suspect,
          integrityNote: integrity.note ?? null,
          githubSignals: githubSignals ?? null,
          signalBoosts: signalBoosts ?? null,
          userId,
          finishedAt: new Date(),
        },
      },
      { upsert: true },
    );
  } catch (e) {
    console.warn("[/quiz/finish] DB persist failed (non-fatal):", e);
  }

  return NextResponse.json(result);
}
