import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("[gemini] GEMINI_API_KEY not set — plan generation will return a fallback");
}

let _ai: GoogleGenerativeAI | null = null;
function ai() {
  if (!_ai && apiKey) _ai = new GoogleGenerativeAI(apiKey);
  return _ai;
}

export interface PlanRequest {
  primaryClass: string;
  vector: Record<string, number>;
  weakest: { code: string; name: string; score: number }[];
  strongest: { code: string; name: string; score: number }[];
}

export interface DevPlan {
  voice: string; // 1-paragraph framing in the archetype's voice
  weeklyHabits: string[];
  monthlyExperiments: string[];
  readingList: { title: string; why: string }[];
  warnings: string[];
}

const FALLBACK_PLAN: DevPlan = {
  voice:
    "Your AI plan generator is offline, but the work doesn't wait. Read your weakest pillar's description below; pick one habit you can sustain for two weeks. That's enough to start.",
  weeklyHabits: [
    "Write one PR description that includes 'what I'm not confident about'.",
    "Spend 30 minutes reading a tool you depend on, but have never read.",
    "Do one 25-minute focus block on something you've been avoiding.",
  ],
  monthlyExperiments: [
    "Pair with someone whose archetype is opposite to yours.",
    "Pick one piece of working code and rewrite it as if you didn't write it.",
  ],
  readingList: [
    { title: "A Philosophy of Software Design — John Ousterhout", why: "Names the cost of complexity in a way that sticks." },
    { title: "The Pragmatic Programmer — Hunt & Thomas", why: "Old, but still the cleanest articulation of taste in engineering." },
  ],
  warnings: [
    "Plans are stories you tell yourself about who you'll be. Pick one item, not all of them.",
  ],
};

export async function generatePlan(req: PlanRequest): Promise<DevPlan> {
  const client = ai();
  if (!client) return FALLBACK_PLAN;

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
  });

  const prompt = `
You are writing a personal development plan for a software engineer who has just taken a 33-question
self-assessment. Their primary archetype is "${req.primaryClass}".

Their full pillar vector (0-100):
${JSON.stringify(req.vector, null, 2)}

Their THREE strongest pillars:
${req.strongest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

Their THREE weakest pillars:
${req.weakest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

Write a plan in the voice that suits the "${req.primaryClass}" archetype — direct, grounded, never
patronizing, never self-help-glossy. Be honest about what they should NOT do. Tailor every
recommendation to leverage their strengths while addressing their weakest pillars.

Return STRICT JSON matching this TypeScript type:
{
  "voice": "string — one paragraph (max 80 words) of framing, in the archetype's voice",
  "weeklyHabits": ["3-4 short, sustainable habit strings"],
  "monthlyExperiments": ["2-3 stretch experiments to run"],
  "readingList": [{"title": "real book/paper/article title", "why": "1 sentence"}],
  "warnings": ["1-2 honest cautions about over-correction or shadow side"]
}

Recommend only real, well-known books/papers/posts (Ousterhout, Hickey, Brooks, Naur, "Thinking Fast and Slow", "Designing Data-Intensive Applications", classic ACM Queue articles, etc.). Never invent titles.
`.trim();

  try {
    const res = await model.generateContent(prompt);
    const text = res.response.text();
    const parsed = JSON.parse(text);
    return parsed as DevPlan;
  } catch (e) {
    console.error("[gemini] generatePlan failed:", e);
    return FALLBACK_PLAN;
  }
}
