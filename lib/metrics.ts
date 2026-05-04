import type { MetricCode } from "./types";

export interface MetricDef {
  code: MetricCode;
  name: string;
  short: string;
  description: string;
  high: string;
  low: string;
  color: string;
}

export const METRICS: Record<MetricCode, MetricDef> = {
  ANL: {
    code: "ANL",
    name: "Analytical Decomposition",
    short: "Analysis",
    description:
      "How readily you split fuzzy problems into smaller, verifiable parts before acting.",
    high: "You instinctively model invariants and edge cases before writing code.",
    low: "You move to code quickly and rely on iteration to surface structure.",
    color: "#5E96C4",
  },
  CRT: {
    code: "CRT",
    name: "Critical Skepticism",
    short: "Critical",
    description:
      "Your willingness to challenge assumptions — your own, your team's, and the framework's.",
    high: "You ask 'why' until the answer is grounded in evidence or principle.",
    low: "You trust prevailing patterns and prefer convention over investigation.",
    color: "#B58EAE",
  },
  CRE: {
    code: "CRE",
    name: "Creative Synthesis",
    short: "Creative",
    description:
      "How often you combine ideas from outside the immediate domain to produce novel solutions.",
    high: "You bring metaphors and patterns from unrelated fields into engineering.",
    low: "You prefer well-trodden patterns and proven recipes.",
    color: "#D9A87B",
  },
  DOM: {
    code: "DOM",
    name: "Domain Mastery",
    short: "Domain",
    description:
      "Depth of understanding in the systems you build — runtime, language, protocol.",
    high: "You can reason from first principles about the platforms you use daily.",
    low: "You operate effectively at the API surface but rarely descend below it.",
    color: "#7BA8D9",
  },
  FOC: {
    code: "FOC",
    name: "Focused Persistence",
    short: "Focus",
    description:
      "Your ability to stay with a hard problem long enough to fully resolve it.",
    high: "You finish what you start, even when the dopamine has long since left.",
    low: "You're quick to context-switch and may leave threads dangling.",
    color: "#6B8CAE",
  },
  CUR: {
    code: "CUR",
    name: "Cultivated Curiosity",
    short: "Curiosity",
    description:
      "How actively you seek out tools, papers, and patterns outside your immediate need.",
    high: "You read code and research that has no immediate use to you.",
    low: "You learn just-in-time, on demand, scoped to the problem in front of you.",
    color: "#E8B547",
  },
  INT: {
    code: "INT",
    name: "Engineering Integrity",
    short: "Integrity",
    description:
      "Your bias toward correctness, durability, and honesty in the artifacts you ship.",
    high: "You treat technical debt as a moral concern, not just an economic one.",
    low: "You ship pragmatically and accept that some things will need to be redone.",
    color: "#95B58E",
  },
  REG: {
    code: "REG",
    name: "Self-Regulation",
    short: "Regulation",
    description:
      "How well you notice frustration, ego, and fatigue — and act on what you notice.",
    high: "You step away when stuck, sleep on hard decisions, and own your reactions.",
    low: "You push through emotional friction and may not always notice when it's costing you.",
    color: "#7BA88E",
  },
  COM: {
    code: "COM",
    name: "Communicative Clarity",
    short: "Communication",
    description:
      "How well your code, messages, and explanations transmit intent to other minds.",
    high: "You write commits, comments, and PRs that read like good prose.",
    low: "Your work tends to require a translator — usually you, in person.",
    color: "#7DD8D5",
  },
};
