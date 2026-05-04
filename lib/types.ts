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
  confidence?: number; // 0..1, deep-research §3
  confidenceLabel?: "definitive" | "leaning" | "hybrid";
  integritySuspect?: boolean;
  integrityNote?: string;
  githubSignals?: GitHubSignals;
  signalBoosts?: Partial<ScoreVector>;
  plan?: unknown;
}

export interface GitHubSignals {
  login: string;
  publicRepos: number;
  followers: number;
  /** distinct top-level languages across non-fork public repos */
  languages: string[];
  /** count of non-fork repos with a non-empty README */
  documentedRepos: number;
  /** push events in the last 90 days */
  recentPushes: number;
  /** number of distinct days with push activity in last 90 days */
  activeDays: number;
  /** average number of repos updated per active day (proxy for context-switching) */
  meanReposPerActiveDay: number;
  fetchedAt: string;
}

export interface BuildLogEntry {
  _id?: string;
  userId: string;
  text: string;
  metric?: MetricCode;
  createdAt: Date;
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
