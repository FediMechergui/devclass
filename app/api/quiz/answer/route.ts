import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { attemptId, questionId, value, optionIndex } = body ?? {};
  if (!attemptId || !questionId) {
    return NextResponse.json({ error: "attemptId and questionId required" }, { status: 400 });
  }
  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.attempts).updateOne(
      { attemptId },
      {
        $push: {
          answers: { questionId, value, optionIndex, at: new Date() },
        },
      } as never
    );
  } catch (e) {
    console.warn("[/quiz/answer] DB update failed (non-fatal):", e);
  }
  return NextResponse.json({ ok: true });
}
