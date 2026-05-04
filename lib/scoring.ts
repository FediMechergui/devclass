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

const emptyVector = (): ScoreVector =>
  METRIC_CODES.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {} as ScoreVector);

/**
 * Compute raw scores from answers.
 * - likert: maps 1..5 -> -2..+2 on the question.metric (reversed if question.reverse)
 *           weighted by question.weight (default 1), scaled to a 0..100 contribution per item.
 * - forced_choice / behavioral: each option carries explicit metricDeltas (already on a -10..+10 scale)
 */
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

    if (q.kind === "likert") {
      // a.value is 1..5
      const centered = a.value - 3; // -2..+2
      const signed = q.reverse ? -centered : centered;
      const weight = q.weight ?? 1;
      raw[q.metric] += signed * 12.5 * weight; // -25..+25 per item
      counts[q.metric] += 1;
    } else {
      const opt = q.options?.[a.optionIndex ?? -1];
      if (!opt?.metricDeltas) continue;
      for (const [k, v] of Object.entries(opt.metricDeltas)) {
        if (typeof v === "number") {
          raw[k as MetricCode] += v;
          counts[k as MetricCode] += 1;
        }
      }
    }
  }
  return { raw, counts };
}

/**
 * Normalize raw scores into a 0..100 vector centered around 50.
 * We assume the raw score is an additive deviation around 0; map to [0, 100] with soft clamp.
 */
export function normalize(raw: ScoreVector): ScoreVector {
  const out = emptyVector();
  for (const m of METRIC_CODES) {
    // Empirically, max possible swing per metric across our 33-question bank is roughly ±60.
    // So divide by 60 to put into [-1..+1], shift to [0..1], scale to [0..100].
    const t = Math.max(-60, Math.min(60, raw[m])) / 60;
    out[m] = Math.round((t * 0.5 + 0.5) * 100);
  }
  return out;
}

export function cosineSimilarity(a: ScoreVector, b: ScoreVector): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const m of METRIC_CODES) {
    dot += a[m] * b[m];
    na += a[m] * a[m];
    nb += b[m] * b[m];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface ClassAssignment {
  primary: Archetype;
  primaryCosine: number;
  multiclass: { archetype: Archetype; cosine: number }[];
  ranked: { archetype: Archetype; cosine: number }[];
}

export function assignClass(user: ScoreVector, threshold = 0.985): ClassAssignment {
  const ranked = ARCHETYPES.map((a) => ({
    archetype: a,
    cosine: cosineSimilarity(user, a.vector),
  })).sort((x, y) => y.cosine - x.cosine);

  const primary = ranked[0];
  const multiclass = ranked.filter((r) => r.cosine >= threshold * primary.cosine);

  return {
    primary: primary.archetype,
    primaryCosine: primary.cosine,
    multiclass,
    ranked,
  };
}

/** Compute strongest and weakest pillars (the dumbbell). */
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
