import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { METRIC_CODES } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Build log — terse, metric-tagged notes a signed-in user keeps over time.
 * Deep-research §7: shifts the loop from "score" to "deliberate practice trace".
 */

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ entries: [] });

  try {
    const db = await getDb();
    const entries = await db
      .collection(COLLECTIONS.buildLog)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();
    return NextResponse.json({
      entries: entries.map((e) => ({
        id: String(e._id),
        text: e.text,
        metric: e.metric ?? null,
        createdAt: e.createdAt,
      })),
    });
  } catch (e) {
    console.warn("[/buildlog] read failed:", e);
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to save build-log entries." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const text = (body?.text as string | undefined)?.trim();
  const metric = body?.metric as string | undefined;
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (text.length > 600) return NextResponse.json({ error: "text too long" }, { status: 400 });

  const validMetric =
    metric && (METRIC_CODES as string[]).includes(metric) ? metric : null;

  try {
    const db = await getDb();
    const res = await db.collection(COLLECTIONS.buildLog).insertOne({
      userId,
      text,
      metric: validMetric,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: String(res.insertedId), ok: true });
  } catch (e) {
    console.warn("[/buildlog] write failed:", e);
    return NextResponse.json({ error: "persist failed" }, { status: 500 });
  }
}
