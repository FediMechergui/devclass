import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GitHubInsightReport, GitHubSignals, ScoreVector } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "[gemini] GEMINI_API_KEY not set — plan generation will return a fallback",
  );
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
  githubSignals?: GitHubSignals | null;
  githubInsights?: GitHubInsightReport | null;
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
    {
      title: "A Philosophy of Software Design — John Ousterhout",
      why: "Names the cost of complexity in a way that sticks.",
    },
    {
      title: "The Pragmatic Programmer — Hunt & Thomas",
      why: "Old, but still the cleanest articulation of taste in engineering.",
    },
  ],
  warnings: [
    "Plans are stories you tell yourself about who you'll be. Pick one item, not all of them.",
  ],
};

function fallbackGitHubInsights(
  req: GitHubInsightRequest,
): GitHubInsightReport {
  const topLanguage = req.githubSignals.topLanguages?.[0]?.name;
  const activity = req.githubSignals.activeDays >= 20 ? "steady" : "selective";
  const documentation =
    req.githubSignals.documentedRepos >= 4
      ? "Your public repos show some care for explanation."
      : "Your public repos could explain intent more clearly.";

  return {
    headline: topLanguage
      ? `${req.primaryClass} signal with a ${topLanguage} center of gravity`
      : `${req.primaryClass} signal with a sparse public language trail`,
    summary: `Your quiz vector is the main signal; GitHub adds a ${activity} public-work trace across ${req.githubSignals.publicRepos} repos and ${req.githubSignals.languages.length} detected languages.`,
    takes: [
      {
        title: "Stack gravity",
        detail: topLanguage
          ? `${topLanguage} appears most often in your public repos, so the profile reads as strongest around that toolchain.`
          : "Your public repos do not expose enough primary language data to infer a dominant stack.",
      },
      {
        title: "Practice rhythm",
        detail: `${req.githubSignals.activeDays} active push days in the last 90 suggests a ${activity} cadence rather than a leaderboard-style volume signal.`,
      },
      {
        title: "Communication trace",
        detail: documentation,
      },
    ],
    cautions: [
      "GitHub is public residue, not the whole craft. The quiz still owns the class assignment.",
    ],
  };
}

export async function generatePlan(req: PlanRequest): Promise<DevPlan> {
  const client = ai();
  if (!client) return FALLBACK_PLAN;

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const githubContext = req.githubSignals
    ? `
GitHub public signal:
${JSON.stringify(
  {
    publicRepos: req.githubSignals.publicRepos,
    followers: req.githubSignals.followers,
    languages: req.githubSignals.languages,
    topLanguages: req.githubSignals.topLanguages ?? [],
    documentedRepos: req.githubSignals.documentedRepos,
    recentPushes: req.githubSignals.recentPushes,
    activeDays: req.githubSignals.activeDays,
    meanReposPerActiveDay: req.githubSignals.meanReposPerActiveDay,
    aiRead: req.githubInsights,
  },
  null,
  2,
)}
`
    : "";

  const prompt = `
You are writing a personal development plan for a software engineer who has just taken a 63-question
self-assessment. Their primary archetype is "${req.primaryClass}".

Their full pillar vector (0-100):
${JSON.stringify(req.vector, null, 2)}

Their THREE strongest pillars:
${req.strongest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

Their THREE weakest pillars:
${req.weakest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

${githubContext}

Write a plan in the voice that suits the "${req.primaryClass}" archetype — direct, grounded, never
patronizing, never self-help-glossy. Be honest about what they should NOT do. Tailor every
recommendation to leverage their strengths while addressing their weakest pillars. If GitHub signal is
available, use it as weak context only: reference public languages, documentation, and activity rhythm
when helpful, but do not overfit to repository volume.

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

export interface GitHubInsightRequest {
  primaryClass: string;
  vector: ScoreVector;
  strongest: { code: string; name: string; score: number }[];
  weakest: { code: string; name: string; score: number }[];
  githubSignals: GitHubSignals;
  signalBoosts?: Partial<ScoreVector> | null;
}

export async function generateGitHubInsights(
  req: GitHubInsightRequest,
): Promise<GitHubInsightReport> {
  const fallback = fallbackGitHubInsights(req);
  const client = ai();
  if (!client) return fallback;

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.55,
    },
  });

  const prompt = `
You are writing GitHub-aware profile notes for a developer self-assessment.

Primary class: ${req.primaryClass}
Pillar vector:
${JSON.stringify(req.vector, null, 2)}

Strongest pillars:
${req.strongest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

Weakest pillars:
${req.weakest.map((s) => `- ${s.name} (${s.code}): ${s.score}`).join("\n")}

Public GitHub signal:
${JSON.stringify(req.githubSignals, null, 2)}

Score boosts applied from GitHub, capped at +/-5 per pillar:
${JSON.stringify(req.signalBoosts ?? {}, null, 2)}

Write nuanced profile takes that match the quiz result against the public GitHub signal. Treat GitHub as weak, public evidence. Never imply private skill level, employment value, or hiring rank.

Return STRICT JSON matching this TypeScript type:
{
  "headline": "short string",
  "summary": "2 sentence max summary",
  "takes": [{"title": "short label", "detail": "1 sentence grounded take"}],
  "cautions": ["1-2 limitations or cautions"]
}

Use 3-4 takes. Mention top languages when present. Do not invent repositories or private activity.
`.trim();

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text()) as GitHubInsightReport;
    return {
      headline: parsed.headline || fallback.headline,
      summary: parsed.summary || fallback.summary,
      takes: parsed.takes?.length ? parsed.takes.slice(0, 4) : fallback.takes,
      cautions: parsed.cautions?.length
        ? parsed.cautions.slice(0, 2)
        : fallback.cautions,
    };
  } catch (e) {
    console.error("[gemini] generateGitHubInsights failed:", e);
    return fallback;
  }
}
