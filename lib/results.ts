import { METRICS } from "./metrics";
import { assignClass, dumbbell } from "./scoring";
import type {
  ArchetypeId,
  GitHubInsightReport,
  GitHubSignals,
  MetricCode,
  ScoreVector,
} from "./types";

export interface DevclassResult {
  attemptId: string;
  vector: ScoreVector;
  raw?: ScoreVector;
  primary: {
    id: ArchetypeId;
    name: string;
    alias: string;
    color: string;
    tagline: string;
    motto: string;
    blurb: string;
    shadow: string;
    voice: string;
    signatureRoles: string[];
  };
  confidence: number;
  confidenceLabel: "definitive" | "leaning" | "hybrid";
  integrity: {
    suspect: boolean;
    note?: string;
    centroidRate: number;
    acquiescenceRate: number;
  };
  multiclass: { id: ArchetypeId; name: string; cosine: number }[];
  ranked: { id: ArchetypeId; name: string; cosine: number }[];
  strongest: { code: MetricCode; name: string; score: number }[];
  weakest: { code: MetricCode; name: string; score: number }[];
  githubSignals?: GitHubSignals | null;
  signalBoosts?: Partial<ScoreVector> | null;
  githubInsights?: GitHubInsightReport | null;
  finishedAt?: string;
}

interface ResultInput {
  attemptId: string;
  vector: ScoreVector;
  raw?: ScoreVector;
  integrity?: {
    suspect?: boolean;
    note?: string | null;
    centroidRate?: number;
    acquiescenceRate?: number;
  };
  githubSignals?: GitHubSignals | null;
  signalBoosts?: Partial<ScoreVector> | null;
  githubInsights?: GitHubInsightReport | null;
  finishedAt?: Date | string | null;
}

export function buildResultPayload(input: ResultInput): DevclassResult {
  const assignment = assignClass(input.vector);
  const dbDumbbell = dumbbell(input.vector);
  const finishedAt = input.finishedAt
    ? new Date(input.finishedAt).toISOString()
    : undefined;

  return {
    attemptId: input.attemptId,
    vector: input.vector,
    raw: input.raw,
    primary: {
      id: assignment.primary.id,
      name: assignment.primary.name,
      alias: assignment.primary.alias,
      color: assignment.primary.color,
      tagline: assignment.primary.tagline,
      motto: assignment.primary.motto,
      blurb: assignment.primary.blurb,
      shadow: assignment.primary.shadow,
      signatureRoles: assignment.primary.signatureRoles,
      voice: assignment.primary.voice,
    },
    confidence: Number(assignment.confidence.toFixed(3)),
    confidenceLabel: assignment.confidenceLabel,
    integrity: {
      suspect: Boolean(input.integrity?.suspect),
      note: input.integrity?.note ?? undefined,
      centroidRate: Number((input.integrity?.centroidRate ?? 0).toFixed(2)),
      acquiescenceRate: Number(
        (input.integrity?.acquiescenceRate ?? 0).toFixed(2),
      ),
    },
    multiclass: assignment.multiclass.map((match) => ({
      id: match.archetype.id,
      name: match.archetype.name,
      cosine: Number(match.cosine.toFixed(4)),
    })),
    ranked: assignment.ranked.slice(0, 5).map((match) => ({
      id: match.archetype.id,
      name: match.archetype.name,
      cosine: Number(match.cosine.toFixed(4)),
    })),
    strongest: dbDumbbell.strongest.map((score) => ({
      code: score.m,
      name: METRICS[score.m].name,
      score: score.v,
    })),
    weakest: dbDumbbell.weakest.map((score) => ({
      code: score.m,
      name: METRICS[score.m].name,
      score: score.v,
    })),
    githubSignals: input.githubSignals ?? null,
    signalBoosts: input.signalBoosts ?? null,
    githubInsights: input.githubInsights ?? null,
    finishedAt,
  };
}

export function resultFromAttempt(attempt: {
  attemptId: string;
  normalized?: ScoreVector;
  raw?: ScoreVector;
  integritySuspect?: boolean;
  integrityNote?: string | null;
  centroidRate?: number;
  acquiescenceRate?: number;
  githubSignals?: GitHubSignals | null;
  signalBoosts?: Partial<ScoreVector> | null;
  githubInsights?: GitHubInsightReport | null;
  finishedAt?: Date | string | null;
}): DevclassResult | null {
  if (!attempt.normalized) return null;

  return buildResultPayload({
    attemptId: attempt.attemptId,
    vector: attempt.normalized,
    raw: attempt.raw,
    integrity: {
      suspect: attempt.integritySuspect,
      note: attempt.integrityNote,
      centroidRate: attempt.centroidRate,
      acquiescenceRate: attempt.acquiescenceRate,
    },
    githubSignals: attempt.githubSignals,
    signalBoosts: attempt.signalBoosts,
    githubInsights: attempt.githubInsights,
    finishedAt: attempt.finishedAt,
  });
}
