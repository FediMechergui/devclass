import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { QUESTIONS } from "@/lib/questions";
import { computeRawScores, normalize, assignClass, dumbbell } from "@/lib/scoring";
import { METRICS } from "@/lib/metrics";
import type { AnswerRecord, MetricCode } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { attemptId, answers } = body as { attemptId: string; answers: AnswerRecord[] };
  if (!attemptId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "attemptId and answers[] required" }, { status: 400 });
  }

  const { raw } = computeRawScores(answers, QUESTIONS);
  const normalized = normalize(raw);
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
          finishedAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (e) {
    console.warn("[/quiz/finish] DB persist failed (non-fatal):", e);
  }

  return NextResponse.json(result);
}
