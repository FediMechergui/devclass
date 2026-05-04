import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { COLLECTIONS, getDb } from "@/lib/mongodb";
import { resultFromAttempt } from "@/lib/results";

export const runtime = "nodejs";

function getUserId(session: { user?: { id?: string } } | null) {
  return session?.user?.id;
}

export async function GET() {
  const session = await auth().catch(() => null);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Sign in to view your profile." }, { status: 401 });
  }

  try {
    const db = await getDb();
    const attempt = await db
      .collection(COLLECTIONS.attempts)
      .find({ userId, finishedAt: { $exists: true } })
      .sort({ finishedAt: -1 })
      .limit(1)
      .next();

    const result = attempt
      ? resultFromAttempt(
          attempt as unknown as Parameters<typeof resultFromAttempt>[0],
        )
      : null;
    return NextResponse.json({
      result,
      plan: attempt?.plan ?? null,
    });
  } catch (e) {
    console.warn("[/profile] read failed:", e);
    return NextResponse.json({ error: "profile read failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth().catch(() => null);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Sign in to delete a result." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const attemptId = (body?.attemptId as string | undefined)?.trim();
  if (!attemptId) {
    return NextResponse.json({ error: "attemptId required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const res = await db.collection(COLLECTIONS.attempts).deleteOne({
      attemptId,
      userId,
    });
    return NextResponse.json({ ok: true, deletedCount: res.deletedCount });
  } catch (e) {
    console.warn("[/profile] delete failed:", e);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
