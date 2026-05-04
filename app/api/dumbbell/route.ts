import { NextResponse } from "next/server";
import type { MetricCode } from "@/lib/types";
import { METRICS } from "@/lib/metrics";

export const runtime = "nodejs";

/**
 * "The Dumbbell" — daily micro-challenge keyed to the caller's weakest pillar.
 * Deep-research §7: small, deliberate practice grounded in one's own dumbbell.
 *
 * GET /api/dumbbell?metric=FOC&date=YYYY-MM-DD
 */

const CHALLENGES: Record<MetricCode, string[]> = {
  ANL: [
    "Pick one slow query in a system you use. Sketch its query plan from memory before running EXPLAIN.",
    "Take a vague bug report from your tracker and rewrite it as a falsifiable hypothesis.",
    "Diagram the data flow of one current feature with no more than 6 boxes. No code allowed.",
    "Find a function over 80 lines and split it on its single seam. Commit only that split.",
  ],
  CRT: [
    "Pick one 'best practice' you follow without thinking. Write down the failure mode it prevents — or stop following it.",
    "Read a popular library's issue tracker for 15 minutes. Note one piece of conventional wisdom that's contested.",
    "Take an LLM-generated snippet from your week. Re-derive why each line is correct, or rewrite it.",
    "Find a default configuration in your stack and explain — to yourself — what trade-off it encodes.",
  ],
  CRE: [
    "Take one current problem. Write three solutions: the obvious one, the brute-force one, and one borrowed from outside software.",
    "Read a paper or essay from a field you don't work in. Note one idea that maps to a problem you have.",
    "Reframe a feature request as the opposite request. What does that reveal?",
    "Spend 20 minutes building the throwaway prototype you keep avoiding.",
  ],
  DOM: [
    "Open a dependency you use daily. Read 200 lines of its source you've never seen before.",
    "Trace one HTTP request from your app end-to-end through every layer you control.",
    "Pick one error message from your stack you've ignored. Find what code emits it.",
    "Re-read the official docs for a tool you 'know' — find one feature you didn't know existed.",
  ],
  FOC: [
    "Block 90 uninterrupted minutes for one task. Phone in another room.",
    "Pick the oldest unfinished item in your todo list. Either ship it today or delete it.",
    "Close every browser tab. Open only what the next 30 minutes of work requires.",
    "Write down what 'done' looks like for your current task — in one sentence — before you continue.",
  ],
  CUR: [
    "Read one technical paper, blog post, or RFC unrelated to your current work.",
    "Try a new programming language for 30 minutes. Solve one small problem in it.",
    "Pick a feature in your editor you never use. Use it deliberately for the rest of the day.",
    "Subscribe to one new technical newsletter or RSS feed outside your stack.",
  ],
  INT: [
    "Find a hack in your codebase you put there. File the issue you've been avoiding.",
    "Tell one stakeholder one true thing about your project they don't want to hear.",
    "Open the PR description for your last merge. Add the alternative you considered and rejected.",
    "Run your code with logs/asserts on. Fix the first warning you'd normally ignore.",
  ],
  REG: [
    "When you feel the urge to reply quickly to a sharp message, draft the reply but wait one hour.",
    "Notice — once today — that you're tired or frustrated. Switch to a low-stakes task instead of pushing through.",
    "End your work day with three lines: what worked, what didn't, what you'll try tomorrow.",
    "Take a real lunch break, away from screens, today.",
  ],
  COM: [
    "Write a 6-sentence summary of your current project for someone non-technical. No jargon.",
    "Take your last commit message and rewrite it to explain why, not what.",
    "Pair-debug for 20 minutes by typing out — in plain English — what you expect to happen.",
    "Open one PR with a 'context · decision · what I'm not sure about' description.",
  ],
};

function pickFromDay(seed: string, options: string[]): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return options[h % options.length];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const metricParam = (url.searchParams.get("metric") || "FOC").toUpperCase();
  const metric = (metricParam in CHALLENGES ? metricParam : "FOC") as MetricCode;
  const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const options = CHALLENGES[metric];
  const challenge = pickFromDay(`${metric}:${date}`, options);

  return NextResponse.json({
    metric,
    metricName: METRICS[metric].name,
    date,
    challenge,
  });
}
