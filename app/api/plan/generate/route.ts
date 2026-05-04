import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePlan as draftPlan } from "@/lib/gemini";
import { COLLECTIONS, getDb } from "@/lib/mongodb";
import { resultFromAttempt } from "@/lib/results";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to generate and save your plan." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { attemptId, primaryClass, vector, weakest, strongest } = body ?? {};

  if (attemptId) {
    const db = await getDb();
    const attempt = await db.collection(COLLECTIONS.attempts).findOne({
      attemptId,
      userId,
    });
    if (!attempt) {
      return NextResponse.json({ error: "attempt not found" }, { status: 404 });
    }
    if (attempt.plan) return NextResponse.json(attempt.plan);

    const result = resultFromAttempt(
      attempt as unknown as Parameters<typeof resultFromAttempt>[0],
    );
    if (!result) {
      return NextResponse.json(
        { error: "attempt is not finished" },
        { status: 400 },
      );
    }

    const plan = await draftPlan({
      primaryClass: result.primary.name,
      vector: result.vector,
      weakest: result.weakest,
      strongest: result.strongest,
      githubSignals: result.githubSignals,
      githubInsights: result.githubInsights,
    });
    await db
      .collection(COLLECTIONS.attempts)
      .updateOne(
        { attemptId, userId },
        { $set: { plan, planGeneratedAt: new Date() } },
      );
    return NextResponse.json(plan);
  }

  if (!primaryClass || !vector) {
    return NextResponse.json(
      { error: "primaryClass and vector required" },
      { status: 400 },
    );
  }
  const plan = await draftPlan({ primaryClass, vector, weakest, strongest });
  return NextResponse.json(plan);
}
