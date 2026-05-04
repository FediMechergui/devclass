import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth().catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to save quiz answers." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { attemptId, questionId, value, optionIndex } = body ?? {};
  if (!attemptId || !questionId) {
    return NextResponse.json(
      { error: "attemptId and questionId required" },
      { status: 400 },
    );
  }
  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.attempts).updateOne(
      { attemptId, userId },
      {
        $setOnInsert: { attemptId, userId, startedAt: new Date() },
        $push: {
          answers: { questionId, value, optionIndex, at: new Date() },
        },
      } as never,
      { upsert: true },
    );
  } catch (e) {
    console.warn("[/quiz/answer] DB update failed (non-fatal):", e);
  }
  return NextResponse.json({ ok: true });
}
