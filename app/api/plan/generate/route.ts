import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { primaryClass, vector, weakest, strongest } = body ?? {};
  if (!primaryClass || !vector) {
    return NextResponse.json({ error: "primaryClass and vector required" }, { status: 400 });
  }
  const plan = await generatePlan({ primaryClass, vector, weakest, strongest });
  return NextResponse.json(plan);
}
