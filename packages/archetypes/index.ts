export type Metric = 'ANL' | 'CRT' | 'CRE' | 'DOM' | 'FOC' | 'CUR' | 'INT' | 'REG' | 'COM';

export type Archetype = {
  id: string;
  name: string;
  dnd_analog: string;
  tagline: string;
  target_vector: Record<Metric, number>;
  shadow: string;
  canonical_roles: string[];
  lore_short: string;
  lore_long: string;
};

export const cosineSimilarity = (a: Record<Metric, number>, b: Record<Metric, number>): number => {
  const metrics: Metric[] = ['ANL', 'CRT', 'CRE', 'DOM', 'FOC', 'CUR', 'INT', 'REG', 'COM'];
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const m of metrics) {
    const valA = a[m] ?? 0;
    const valB = b[m] ?? 0;
    dotProduct += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
};

export type MatchResult = {
  primary: Archetype;
  multiclass: Archetype[];
  similarityScores: Record<string, number>;
};

export const matchArchetype = (
  userProfile: Record<Metric, number>,
  archetypes: Archetype[]
): MatchResult => {
  if (archetypes.length === 0) throw new Error("Archetypes array is empty");

  const similarities = archetypes.map(arc => ({
    archetype: arc,
    score: cosineSimilarity(userProfile, arc.target_vector)
  }));

  similarities.sort((a, b) => b.score - a.score);

  const primary = similarities[0];
  const threshold = primary.score * 0.85;

  const multiclass = similarities
    .slice(1, 3)
    .filter(s => s.score >= threshold)
    .map(s => s.archetype);

  const similarityScores: Record<string, number> = {};
  for (const s of similarities) {
    similarityScores[s.archetype.id] = s.score;
  }

  return {
    primary: primary.archetype,
    multiclass,
    similarityScores
  };
};
