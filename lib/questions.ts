import type { Question } from "./types";

/**
 * 33 carefully written questions.
 * Mix of:
 *  - likert (agree/disagree, 1..5) — fast calibration on traits
 *  - forced_choice — "which is more like you" — defeats acquiescence bias
 *  - behavioral — "the last time X happened, what did you do" — anchored in concrete behavior
 *
 * Wording avoids virtue-signaling cues (no "best practice", no "do you write tests").
 * Where reverse-scored, the higher-scoring response is INVERTED so all metrics still grow upward.
 */

export const QUESTIONS: Question[] = [
  // ---------- ANL: Analytical Decomposition (4) ----------
  {
    id: "anl_1",
    kind: "behavioral",
    metric: "ANL",
    prompt: "You're handed a vague bug report: 'the dashboard is slow sometimes.' What do you reach for first?",
    options: [
      { label: "Open the page in production and start clicking.", value: 30, metricDeltas: { ANL: -8, CUR: 2 } },
      { label: "Ask the reporter for the URL, browser, and a timestamp.", value: 60, metricDeltas: { ANL: 4, COM: 4 } },
      { label: "Pull metrics for the affected endpoint over the last 7 days.", value: 85, metricDeltas: { ANL: 8, DOM: 4 } },
      { label: "Write a small script to reproduce the slow case deterministically.", value: 100, metricDeltas: { ANL: 10, INT: 4 } },
    ],
  },
  {
    id: "anl_2",
    kind: "likert",
    metric: "ANL",
    prompt: "Before I write code for a non-trivial feature, I sketch the data model — even on paper.",
  },
  {
    id: "anl_3",
    kind: "likert",
    metric: "ANL",
    prompt: "When a system surprises me, I assume my mental model is wrong before I assume the system is broken.",
  },
  {
    id: "anl_4",
    kind: "forced_choice",
    metric: "ANL",
    prompt: "Closer to how you actually work:",
    options: [
      { label: "I find the structure by writing code and refactoring as it emerges.", value: 0, metricDeltas: { ANL: -4, CRE: 4 } },
      { label: "I find the structure by thinking, then write code that fits it.", value: 1, metricDeltas: { ANL: 8, FOC: 2 } },
    ],
  },

  // ---------- CRT: Critical Skepticism (4) ----------
  {
    id: "crt_1",
    kind: "likert",
    metric: "CRT",
    prompt: "When a senior engineer states a 'best practice', I want to know the failure mode it was invented to prevent.",
  },
  {
    id: "crt_2",
    kind: "behavioral",
    metric: "CRT",
    prompt: "An LLM gives you confident, well-formatted code that solves your problem. What do you do before merging it?",
    options: [
      { label: "Run it. If it works, ship it.", value: 10, metricDeltas: { CRT: -10, INT: -8 } },
      { label: "Read it line-by-line and check the imports exist.", value: 60, metricDeltas: { CRT: 4 } },
      { label: "Write a failing test first, then verify the code makes it pass.", value: 90, metricDeltas: { CRT: 8, INT: 8 } },
      { label: "Look up the underlying API docs to confirm the behavior is real.", value: 100, metricDeltas: { CRT: 10, DOM: 4 } },
    ],
  },
  {
    id: "crt_3",
    kind: "likert",
    metric: "CRT",
    reverse: true,
    prompt: "If the linter and the framework both agree on a pattern, that's a strong reason to use it.",
  },
  {
    id: "crt_4",
    kind: "forced_choice",
    metric: "CRT",
    prompt: "Your stronger instinct, honestly:",
    options: [
      { label: "If it's been popular for 5+ years, it's probably right for most cases.", value: 0, metricDeltas: { CRT: -4, REG: 2 } },
      { label: "If it's been popular for 5+ years, I want to know what it traded away.", value: 1, metricDeltas: { CRT: 8 } },
    ],
  },

  // ---------- CRE: Creative Synthesis (3) ----------
  {
    id: "cre_1",
    kind: "likert",
    metric: "CRE",
    prompt: "I regularly steal ideas from outside software (biology, music, games, writing) and apply them to engineering problems.",
  },
  {
    id: "cre_2",
    kind: "behavioral",
    metric: "CRE",
    prompt: "Faced with a problem that has no obvious shape, you most often:",
    options: [
      { label: "Search how others solved similar problems first.", value: 30, metricDeltas: { CRE: -2, CUR: 4 } },
      { label: "Try the simplest brute-force approach to feel out the problem.", value: 70, metricDeltas: { CRE: 4, ANL: 2 } },
      { label: "Brainstorm 4–5 wildly different framings, then pick one.", value: 100, metricDeltas: { CRE: 10 } },
    ],
  },
  {
    id: "cre_3",
    kind: "likert",
    metric: "CRE",
    prompt: "I enjoy the early, ill-defined phase of a project more than the later, finishing phase.",
  },

  // ---------- DOM: Domain Mastery (4) ----------
  {
    id: "dom_1",
    kind: "likert",
    metric: "DOM",
    prompt: "I can explain — without looking it up — what happens between an HTTP request hitting a server and a JSON response coming back.",
  },
  {
    id: "dom_2",
    kind: "likert",
    metric: "DOM",
    prompt: "When a tool I use daily has 'magic', I'm uncomfortable until I've read at least the conceptual docs.",
  },
  {
    id: "dom_3",
    kind: "behavioral",
    metric: "DOM",
    prompt: "Your code throws a stack trace from deep inside a library you depend on. You usually:",
    options: [
      { label: "Search the exact error message and try the top Stack Overflow answer.", value: 30, metricDeltas: { DOM: -4, COM: 2 } },
      { label: "Open the library source in node_modules / site-packages and read the failing function.", value: 90, metricDeltas: { DOM: 10, CRT: 4 } },
      { label: "Update the library and hope it's fixed.", value: 10, metricDeltas: { DOM: -8, INT: -4 } },
      { label: "Wrap the call in try/catch and move on.", value: 5, metricDeltas: { DOM: -10, INT: -8 } },
    ],
  },
  {
    id: "dom_4",
    kind: "likert",
    metric: "DOM",
    reverse: true,
    prompt: "I try to stay at the API surface — going below it is usually a sign something's gone wrong.",
  },

  // ---------- FOC: Focused Persistence (4) ----------
  {
    id: "foc_1",
    kind: "behavioral",
    metric: "FOC",
    prompt: "You've been stuck on the same bug for 4 hours. Honest answer:",
    options: [
      { label: "I keep going. Stopping breaks the thread.", value: 60, metricDeltas: { FOC: 6, REG: -4 } },
      { label: "I take a 20-minute walk and come back.", value: 90, metricDeltas: { FOC: 8, REG: 8 } },
      { label: "I switch to a different task and revisit tomorrow.", value: 70, metricDeltas: { FOC: 2, REG: 6 } },
      { label: "I open a different tab and end up scrolling.", value: 20, metricDeltas: { FOC: -8, REG: -4 } },
    ],
  },
  {
    id: "foc_2",
    kind: "likert",
    metric: "FOC",
    prompt: "I finish what I start, even when the interesting part is over.",
  },
  {
    id: "foc_3",
    kind: "likert",
    metric: "FOC",
    reverse: true,
    prompt: "I have several side projects in various stages of being abandoned.",
  },
  {
    id: "foc_4",
    kind: "forced_choice",
    metric: "FOC",
    prompt: "More true of you:",
    options: [
      { label: "I do my best work in long, uninterrupted blocks.", value: 1, metricDeltas: { FOC: 8 } },
      { label: "I do my best work in short bursts between conversations.", value: 0, metricDeltas: { FOC: -2, COM: 4 } },
    ],
  },

  // ---------- CUR: Cultivated Curiosity (3) ----------
  {
    id: "cur_1",
    kind: "likert",
    metric: "CUR",
    prompt: "In the last month, I've read code, papers, or technical writing that has no immediate use for my current work.",
  },
  {
    id: "cur_2",
    kind: "behavioral",
    metric: "CUR",
    prompt: "A new programming language ships a feature you've never seen before. You:",
    options: [
      { label: "Skim the blog post if someone shares it.", value: 30, metricDeltas: { CUR: -2 } },
      { label: "Read the proposal and play with it in a REPL.", value: 80, metricDeltas: { CUR: 8, DOM: 4 } },
      { label: "Compare it to how 2–3 other languages handle the same thing.", value: 100, metricDeltas: { CUR: 10, ANL: 4 } },
      { label: "Wait until I need it.", value: 10, metricDeltas: { CUR: -8 } },
    ],
  },
  {
    id: "cur_3",
    kind: "likert",
    metric: "CUR",
    prompt: "I have at least one technical 'rabbit hole' I've explored in the last year purely because it interested me.",
  },

  // ---------- INT: Engineering Integrity (4) ----------
  {
    id: "int_1",
    kind: "behavioral",
    metric: "INT",
    prompt: "It's Friday at 5pm. Your fix passes the tests but you suspect there's a deeper issue you didn't fully chase down. The PR is approved. What do you do?",
    options: [
      { label: "Merge. The tests pass, ship it.", value: 30, metricDeltas: { INT: -6, FOC: 2 } },
      { label: "Merge, but file a follow-up issue with what I suspect.", value: 75, metricDeltas: { INT: 6, COM: 6 } },
      { label: "Hold the merge until Monday and investigate first.", value: 95, metricDeltas: { INT: 10, REG: 4 } },
      { label: "Tell the reviewer my doubts and let them call it.", value: 70, metricDeltas: { INT: 4, COM: 6, REG: -2 } },
    ],
  },
  {
    id: "int_2",
    kind: "likert",
    metric: "INT",
    prompt: "I will rewrite working code if I no longer believe in its design — even when no one is asking me to.",
  },
  {
    id: "int_3",
    kind: "likert",
    metric: "INT",
    reverse: true,
    prompt: "If a hack ships and nobody notices, it wasn't really a hack.",
  },
  {
    id: "int_4",
    kind: "likert",
    metric: "INT",
    prompt: "I have voluntarily told a stakeholder that something I built was worse than they realized.",
  },

  // ---------- REG: Self-Regulation (3) ----------
  {
    id: "reg_1",
    kind: "behavioral",
    metric: "REG",
    prompt: "Someone leaves a sharply-worded comment on your PR. First instinct?",
    options: [
      { label: "Reply immediately to defend the choice.", value: 20, metricDeltas: { REG: -8 } },
      { label: "Wait an hour, then reply.", value: 70, metricDeltas: { REG: 6 } },
      { label: "Re-read the comment three times to find what's true in it.", value: 95, metricDeltas: { REG: 10, CRT: 4 } },
      { label: "Reply the next day with a measured response.", value: 85, metricDeltas: { REG: 8 } },
    ],
  },
  {
    id: "reg_2",
    kind: "likert",
    metric: "REG",
    prompt: "I notice when I'm tired or frustrated, and I adjust what I work on accordingly.",
  },
  {
    id: "reg_3",
    kind: "likert",
    metric: "REG",
    reverse: true,
    prompt: "I've made meaningful technical decisions while angry or exhausted in the last six months.",
  },

  // ---------- COM: Communicative Clarity (4) ----------
  {
    id: "com_1",
    kind: "likert",
    metric: "COM",
    prompt: "My commit messages would tell a stranger why a change was made, not just what changed.",
  },
  {
    id: "com_2",
    kind: "behavioral",
    metric: "COM",
    prompt: "You've finished a non-trivial feature. Time to write the PR description. You:",
    options: [
      { label: "Title only. Reviewers can read the diff.", value: 10, metricDeltas: { COM: -8 } },
      { label: "A short paragraph describing what changed.", value: 50, metricDeltas: { COM: 2 } },
      { label: "Context, decision, alternatives considered, and what I'm NOT confident about.", value: 100, metricDeltas: { COM: 10, INT: 6, CRT: 4 } },
      { label: "A bulleted list of changes copied from the commit log.", value: 30, metricDeltas: { COM: -4 } },
    ],
  },
  {
    id: "com_3",
    kind: "likert",
    metric: "COM",
    prompt: "I can explain what I'm working on to a non-engineer in under two minutes without making them feel small.",
  },
  {
    id: "com_4",
    kind: "forced_choice",
    metric: "COM",
    prompt: "More true:",
    options: [
      { label: "When I'm stuck, writing it out (in chat, in a doc) often unsticks me.", value: 1, metricDeltas: { COM: 8, REG: 2 } },
      { label: "When I'm stuck, writing slows me down. I push through.", value: 0, metricDeltas: { COM: -4, FOC: 4 } },
    ],
  },
];
