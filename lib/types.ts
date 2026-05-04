export type MetricCode =
  | "ANL"
  | "CRT"
  | "CRE"
  | "DOM"
  | "FOC"
  | "CUR"
  | "INT"
  | "REG"
  | "COM";

export const METRIC_CODES: MetricCode[] = [
  "ANL",
  "CRT",
  "CRE",
  "DOM",
  "FOC",
  "CUR",
  "INT",
  "REG",
  "COM",
];

export type ArchetypeId =
  | "architect"
  | "artisan"
  | "sage"
  | "pathfinder"
  | "sentinel"
  | "diplomat"
  | "hacker"
  | "oracle"
  | "berserker"
  | "druid";

export type ScoreVector = Record<MetricCode, number>;

export interface Archetype {
  id: ArchetypeId;
  name: string;
  alias: string;
  tagline: string;
  motto: string;
  color: string;
  vector: ScoreVector;
  voice: string;
  blurb: string;
  signatureRoles: string[];
  shadow: string;
}

export interface QuestionOption {
  label: string;
  value: number; // 1..5 for likert; arbitrary for forced choice
  metricDeltas?: Partial<ScoreVector>; // for forced_choice / behavioral
}

export type QuestionKind = "likert" | "forced_choice" | "behavioral";

export interface Question {
  id: string;
  kind: QuestionKind;
  prompt: string;
  context?: string;
  metric: MetricCode; // primary metric this loads
  reverse?: boolean; // for likert, invert score
  weight?: number; // default 1
  options?: QuestionOption[]; // for forced_choice / behavioral
}

export interface AnswerRecord {
  questionId: string;
  value: number; // raw selected value
  optionIndex?: number;
}

export interface AttemptDocument {
  _id?: string;
  attemptId: string;
  userId?: string | null; // null for guest
  startedAt: Date;
  finishedAt?: Date;
  answers: AnswerRecord[];
  raw?: ScoreVector;
  normalized?: ScoreVector;
  primaryClass?: ArchetypeId;
  multiclass?: ArchetypeId[];
  cosineToPrimary?: number;
  plan?: unknown;
}

export interface UserDocument {
  _id?: string;
  email?: string;
  name?: string;
  image?: string;
  githubId?: string;
  githubLogin?: string;
  createdAt: Date;
}
