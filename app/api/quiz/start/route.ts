import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { QUESTIONS } from "@/lib/questions";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const attemptId = uuid();
  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.attempts).insertOne({
      attemptId,
      userId,
      startedAt: new Date(),
      answers: [],
    });
  } catch (e) {
    console.warn("[/quiz/start] DB write failed; continuing in stateless mode:", e);
  }

  return NextResponse.json({
    attemptId,
    questions: QUESTIONS,
    total: QUESTIONS.length,
  });
}
