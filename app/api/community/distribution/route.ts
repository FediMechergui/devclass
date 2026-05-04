import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { ARCHETYPES } from "@/lib/archetypes";

export const runtime = "nodejs";
export const revalidate = 60;

/**
 * Anonymous archetype distribution across all completed attempts.
 * (Deep-research §7 — replaces leaderboards with relative-position framing.)
 */
export async function GET() {
  const counts: Record<string, number> = {};
  for (const a of ARCHETYPES) counts[a.id] = 0;
  let total = 0;

  try {
    const db = await getDb();
    const cursor = db
      .collection(COLLECTIONS.attempts)
      .find(
        { primaryClass: { $exists: true } },
        { projection: { primaryClass: 1, _id: 0 } }
      );
    for await (const doc of cursor) {
      const id = (doc as { primaryClass?: string }).primaryClass;
      if (id && id in counts) {
        counts[id]++;
        total++;
      }
    }
  } catch (e) {
    console.warn("[/community/distribution] DB read failed:", e);
  }

  const distribution = ARCHETYPES.map((a) => ({
    id: a.id,
    name: a.name,
    color: a.color,
    count: counts[a.id] ?? 0,
    pct: total > 0 ? Math.round((100 * (counts[a.id] ?? 0)) / total) : 0,
  })).sort((x, y) => y.count - x.count);

  return NextResponse.json({ total, distribution });
}
