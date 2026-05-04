import type { GitHubSignals, ScoreVector, MetricCode } from "./types";

/**
 * GitHub signal extraction (deep-research §4).
 *
 * Pulls public repository + recent activity data for an authenticated GitHub
 * user and turns it into:
 *   • a `GitHubSignals` snapshot (numbers we surface on the profile)
 *   • a small `Partial<ScoreVector>` of additive boosts (max ±5 per metric)
 *
 * Boost mapping (conservative — never overrides the quiz):
 *   • CUR (Curiosity)  ← language diversity (more distinct top languages)
 *   • DOM (Mastery)    ← public repo count above a threshold
 *   • FOC (Focus)      ← active-day cadence in the last 90d
 *   • COM (Comm.)      ← README coverage on non-fork repos
 *   • CRE (Creative)   ← presence of non-mainstream languages
 */

interface GHRepo {
  name: string;
  fork: boolean;
  language: string | null;
  description: string | null;
  has_pages: boolean;
  archived: boolean;
  pushed_at: string;
  size: number;
}

interface GHEvent {
  type: string;
  created_at: string;
  repo?: { name: string };
}

const MAINSTREAM = new Set([
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "PHP",
  "HTML",
  "CSS",
]);

async function gh<T>(url: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // Don't cache user-specific data
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function repoHasReadme(owner: string, repo: string, token: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  return res.status === 200;
}

export async function extractGitHubSignals(
  login: string,
  token: string
): Promise<GitHubSignals | null> {
  const profile = await gh<{ public_repos: number; followers: number }>(
    `https://api.github.com/users/${login}`,
    token
  );
  if (!profile) return null;

  const repos =
    (await gh<GHRepo[]>(
      `https://api.github.com/users/${login}/repos?per_page=100&sort=updated`,
      token
    )) ?? [];

  const events =
    (await gh<GHEvent[]>(
      `https://api.github.com/users/${login}/events/public?per_page=100`,
      token
    )) ?? [];

  const ownRepos = repos.filter((r) => !r.fork && !r.archived);
  const languages = Array.from(
    new Set(ownRepos.map((r) => r.language).filter((l): l is string => !!l))
  );

  // README coverage — sample the 8 most recently updated repos to keep this cheap.
  const sample = ownRepos.slice(0, 8);
  let documented = 0;
  for (const r of sample) {
    if (await repoHasReadme(login, r.name, token)) documented++;
  }

  // Push activity in last 90 days
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recentPushes = events.filter(
    (e) => e.type === "PushEvent" && new Date(e.created_at).getTime() >= ninetyDaysAgo
  );
  const activeDays = new Set(
    recentPushes.map((e) => new Date(e.created_at).toISOString().slice(0, 10))
  ).size;
  const reposTouched = new Set(recentPushes.map((e) => e.repo?.name).filter(Boolean));
  const meanReposPerActiveDay = activeDays > 0 ? reposTouched.size / activeDays : 0;

  return {
    login,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    languages,
    documentedRepos: documented,
    recentPushes: recentPushes.length,
    activeDays,
    meanReposPerActiveDay: Number(meanReposPerActiveDay.toFixed(2)),
    fetchedAt: new Date().toISOString(),
  };
}

/** Translate signals into small additive boosts, capped at ±5 per metric. */
export function signalsToBoosts(s: GitHubSignals): Partial<ScoreVector> {
  const clamp = (v: number) => Math.max(-5, Math.min(5, Math.round(v)));
  const boosts: Partial<Record<MetricCode, number>> = {};

  // CUR — language diversity (3 → 0, 6+ → +5)
  boosts.CUR = clamp((s.languages.length - 3) * 1.5);

  // CRE — non-mainstream language presence (each esoteric +2, capped 5)
  const esoteric = s.languages.filter((l) => !MAINSTREAM.has(l)).length;
  boosts.CRE = clamp(esoteric * 2);

  // DOM — public repo depth (10 → 0, 40+ → +5)
  boosts.DOM = clamp((Math.log(Math.max(1, s.publicRepos)) - Math.log(10)) * 4);

  // FOC — push cadence (15 active days in 90d ≈ neutral, 45+ → +5;
  // very high mean repos/day signals scattered focus → small penalty)
  boosts.FOC = clamp((s.activeDays - 15) / 6 - Math.max(0, s.meanReposPerActiveDay - 2));

  // COM — README coverage on sampled repos (4/8 ≈ neutral, 8/8 → +5)
  boosts.COM = clamp((s.documentedRepos - 4) * 1.5);

  return boosts;
}
