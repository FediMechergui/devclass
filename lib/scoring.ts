import { ARCHETYPES } from "./archetypes";
import { METRIC_CODES } from "./types";
import type {
  AnswerRecord,
  ArchetypeId,
  Question,
  ScoreVector,
  MetricCode,
  Archetype,
} from "./types";

/**
 * Devclass scoring pipeline (deep-research §3).
 *
 *  1. Per-kind item loadings: likert × 1.0, forced_choice × 1.5, behavioral × 2.0.
 *  2. Reverse-scoring on flagged likert items (anti-acquiescence).
 *  3. Sigmoid soft-cap normalization to [0..100].
 *  4. Cosine match against archetype reference vectors → primary class.
 *  5. Confidence = 1 − cos(top2)/cos(top1) (clamped 0..1).
 *  6. Integrity flags: centroid-only, acquiescence, low-variance.
 */

const emptyVector = (): ScoreVector =>
  METRIC_CODES.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {} as ScoreVector);

const KIND_LOADING: Record<Question["kind"], number> = {
  likert: 1.0,
  forced_choice: 1.5,
  behavioral: 2.0,
};

export function computeRawScores(
  answers: AnswerRecord[],
  questions: Question[]
): { raw: ScoreVector; counts: Record<MetricCode, number> } {
  const raw = emptyVector();
  const counts = METRIC_CODES.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {} as Record<MetricCode, number>);

  const qById = new Map(questions.map((q) => [q.id, q]));
  for (const a of answers) {
    const q = qById.get(a.questionId);
    if (!q) continue;

    const totalLoading = KIND_LOADING[q.kind] * (q.weight ?? 1);

    if (q.kind === "likert") {
      const centered = a.value - 3; // -2..+2
      const signed = q.reverse ? -centered : centered;
      raw[q.metric] += signed * 5 * totalLoading;
      counts[q.metric] += 1;
    } else {
      const opt = q.options?.[a.optionIndex ?? -1];
      if (!opt?.metricDeltas) continue;
      for (const [k, v] of Object.entries(opt.metricDeltas)) {
        if (typeof v === "number") {
          raw[k as MetricCode] += v * totalLoading;
          counts[k as MetricCode] += 1;
        }
      }
    }
  }
  return { raw, counts };
}

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Logistic squash; α tunes the slope. Empirical raw range ≈ ±150 → α=0.025 spreads to ~10..90. */
export function normalize(raw: ScoreVector, alpha = 0.025): ScoreVector {
  const out = emptyVector();
  for (const m of METRIC_CODES) {
    out[m] = Math.round(100 * sigmoid(alpha * raw[m]));
  }
  return out;
}

/** Apply additive boosts (e.g. GitHub signals) to a normalized vector and re-clamp. */
export function applySignalBoosts(v: ScoreVector, boosts: Partial<ScoreVector>): ScoreVector {
  const out = { ...v };
  for (const m of METRIC_CODES) {
    const b = boosts[m];
    if (typeof b === "number") {
      out[m] = Math.max(0, Math.min(100, Math.round(out[m] + b)));
    }
  }
  return out;
}

export function cosineSimilarity(a: ScoreVector, b: ScoreVector): number {
  // Centre both vectors at 50 so flat-50 profiles don't smear cosine toward 1.
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const m of METRIC_CODES) {
    const ca = a[m] - 50;
    const cb = b[m] - 50;
    dot += ca * cb;
    na += ca * ca;
    nb += cb * cb;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface ClassAssignment {
  primary: Archetype;
  primaryCosine: number;
  multiclass: { archetype: Archetype; cosine: number }[];
  ranked: { archetype: Archetype; cosine: number }[];
  confidence: number;
  confidenceLabel: "definitive" | "leaning" | "hybrid";
}

export function assignClass(user: ScoreVector, threshold = 0.97): ClassAssignment {
  const ranked = ARCHETYPES.map((a) => ({
    archetype: a,
    cosine: cosineSimilarity(user, a.vector),
  })).sort((x, y) => y.cosine - x.cosine);

  const primary = ranked[0];
  const second = ranked[1];

  const multiclass = ranked.filter((r) => r.cosine >= threshold * primary.cosine);

  const c1 = Math.max(primary.cosine, 0.0001);
  const c2 = Math.max(second?.cosine ?? 0, 0);
  const confidenceRaw = 1 - c2 / c1;
  const confidence = Math.max(0, Math.min(1, confidenceRaw));

  let confidenceLabel: ClassAssignment["confidenceLabel"];
  if (confidence >= 0.18) confidenceLabel = "definitive";
  else if (confidence >= 0.06) confidenceLabel = "leaning";
  else confidenceLabel = "hybrid";

  return {
    primary: primary.archetype,
    primaryCosine: primary.cosine,
    multiclass,
    ranked,
    confidence,
    confidenceLabel,
  };
}

export function dumbbell(v: ScoreVector) {
  const sorted = (METRIC_CODES.map((m) => ({ m, v: v[m] })) as { m: MetricCode; v: number }[])
    .sort((a, b) => b.v - a.v);
  return {
    strongest: sorted.slice(0, 3),
    weakest: sorted.slice(-3).reverse(),
  };
}

export function archetypeIdToName(id: ArchetypeId) {
  return ARCHETYPES.find((a) => a.id === id)?.name ?? id;
}

export interface ResponseIntegrity {
  centroidRate: number;
  acquiescenceRate: number;
  likertVariance: number;
  suspect: boolean;
  note?: string;
}

export function assessIntegrity(
  answers: AnswerRecord[],
  questions: Question[]
): ResponseIntegrity {
  const qById = new Map(questions.map((q) => [q.id, q]));
  const likerts: number[] = [];
  for (const a of answers) {
    const q = qById.get(a.questionId);
    if (q?.kind === "likert" && typeof a.value === "number") {
      likerts.push(a.value);
    }
  }
  if (likerts.length === 0) {
    return { centroidRate: 0, acquiescenceRate: 0, likertVariance: 0, suspect: false };
  }

  const centroidRate = likerts.filter((v) => v === 3).length / likerts.length;
  const acquiescenceRate = likerts.filter((v) => v >= 4).length / likerts.length;
  const mean = likerts.reduce((s, v) => s + v, 0) / likerts.length;
  const variance = likerts.reduce((s, v) => s + (v - mean) ** 2, 0) / likerts.length;

  let suspect = false;
  let note: string | undefined;
  if (centroidRate >= 0.5) {
    suspect = true;
    note =
      "More than half of your scaled answers were the neutral midpoint. Your class assignment is less reliable than usual.";
  } else if (variance < 0.4) {
    suspect = true;
    note =
      "Your answers had unusually low spread. The result reflects an averaged profile more than a sharp one.";
  } else if (acquiescenceRate >= 0.85) {
    suspect = true;
    note =
      "You agreed (or strongly agreed) to almost every statement. Acquiescence bias may be inflating several pillars.";
  }

  return { centroidRate, acquiescenceRate, likertVariance: variance, suspect, note };
}
