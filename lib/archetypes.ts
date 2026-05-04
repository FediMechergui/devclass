import type { Archetype } from "./types";

// Vectors are on a 0-100 scale (matching normalized user vectors).
// Sum/balance is intentionally distinctive per archetype so cosine similarity discriminates.
export const ARCHETYPES: Archetype[] = [
  {
    id: "architect",
    name: "Architect",
    alias: "Wizard",
    color: "#7BA8D9",
    tagline: "Builds the cathedral while others lay bricks.",
    motto: "Structure is mercy.",
    voice: "deliberate · diagrammatic · long-horizon",
    blurb:
      "You think in systems before you think in code. You design for the team that hasn't been hired yet, and the bug that hasn't been written. Your weakness is shipping the third draft when the first would have served.",
    signatureRoles: ["Staff Engineer", "Platform Lead", "Infrastructure Architect"],
    shadow: "Over-design. The diagram becomes a substitute for the working thing.",
    vector: { ANL: 92, CRT: 78, CRE: 70, DOM: 90, FOC: 80, CUR: 72, INT: 88, REG: 75, COM: 82 },
  },
  {
    id: "artisan",
    name: "Artisan",
    alias: "Bard",
    color: "#D9A87B",
    tagline: "Makes the obvious thing feel inevitable.",
    motto: "Care shows.",
    voice: "tactile · opinionated · craft-first",
    blurb:
      "You will spend three hours on a transition the user perceives in 200 milliseconds — and they will feel it without knowing why. Detail is your love language. Your weakness is finishing the polish before the foundation is sound.",
    signatureRoles: ["Senior Frontend Engineer", "Design Engineer", "DX Lead"],
    shadow: "Polish-first. The button is perfect; the data layer is held together with prayer.",
    vector: { ANL: 65, CRT: 70, CRE: 90, DOM: 75, FOC: 85, CUR: 78, INT: 88, REG: 72, COM: 88 },
  },
  {
    id: "sage",
    name: "Sage",
    alias: "Cleric",
    color: "#95B58E",
    tagline: "Reads the source, then writes the doc.",
    motto: "Understand it before you change it.",
    voice: "patient · explanatory · evidence-bound",
    blurb:
      "You are the person on the team who actually read the RFC. You write the postmortem nobody else wanted to write, and the onboarding doc that everyone secretly relies on. Your weakness is taking too long to act on what you know.",
    signatureRoles: ["Tech Lead", "Developer Advocate", "Researcher / Writer"],
    shadow: "Analysis paralysis. You can describe the right move long after the moment passed.",
    vector: { ANL: 85, CRT: 88, CRE: 65, DOM: 90, FOC: 78, CUR: 92, INT: 90, REG: 82, COM: 92 },
  },
  {
    id: "pathfinder",
    name: "Pathfinder",
    alias: "Ranger",
    color: "#E8B547",
    tagline: "Goes where the documentation hasn't yet.",
    motto: "Not all who wander are lost. Most are.",
    voice: "exploratory · pragmatic · undeterred",
    blurb:
      "You are the first to try the beta SDK, the first to file the bug, and often the first to find the workaround. You learn by walking. Your weakness is mistaking 'novel' for 'better'.",
    signatureRoles: ["R&D Engineer", "Founding Engineer", "ML Practitioner"],
    shadow: "Novelty-chasing. The next stack always looks shinier than the one you're shipping on.",
    vector: { ANL: 70, CRT: 72, CRE: 85, DOM: 70, FOC: 60, CUR: 95, INT: 70, REG: 65, COM: 70 },
  },
  {
    id: "sentinel",
    name: "Sentinel",
    alias: "Paladin",
    color: "#6B8CAE",
    tagline: "The reason your service didn't go down at 3am.",
    motto: "Boring on purpose.",
    voice: "rigorous · cautious · accountable",
    blurb:
      "You write the test, the alert, the runbook, and the rollback. You take the on-call no one else volunteers for. Your weakness is that 'safe' can become 'slow' if no one challenges you.",
    signatureRoles: ["SRE", "Security Engineer", "Backend Lead"],
    shadow: "Risk-aversion. The PR sits in review while you triple-check what was already correct.",
    vector: { ANL: 88, CRT: 85, CRE: 55, DOM: 85, FOC: 90, CUR: 65, INT: 95, REG: 88, COM: 78 },
  },
  {
    id: "diplomat",
    name: "Diplomat",
    alias: "Diplomat",
    color: "#B58EAE",
    tagline: "Translates between humans and humans (and sometimes machines).",
    motto: "The hardest bug is in the org chart.",
    voice: "warm · structured · contextual",
    blurb:
      "You are the person stakeholders trust to tell them the truth gently. You unblock teams more often than you unblock builds. Your weakness is letting your own technical edge dull while you sharpen everyone else's.",
    signatureRoles: ["Engineering Manager", "Tech Lead Manager", "Solutions Engineer"],
    shadow: "Technical drift. You ship through others, until you can't ship at all yourself.",
    vector: { ANL: 70, CRT: 72, CRE: 70, DOM: 65, FOC: 70, CUR: 75, INT: 80, REG: 90, COM: 95 },
  },
  {
    id: "hacker",
    name: "Hacker",
    alias: "Rogue",
    color: "#6FCF97",
    tagline: "Ships the thing nobody thought was possible by Friday.",
    motto: "Constraints are an invitation.",
    voice: "irreverent · fast · resourceful",
    blurb:
      "You write the proof-of-concept that becomes production code, for better and for worse. You see the cheap path through the swamp. Your weakness is leaving footprints — and shortcuts — that someone else has to clean up.",
    signatureRoles: ["Founding Engineer", "Hackathon Veteran", "Indie Builder"],
    shadow: "Tech debt as exhaust. Every shipped thing leaves a trail nobody wants to follow.",
    vector: { ANL: 75, CRT: 78, CRE: 92, DOM: 78, FOC: 70, CUR: 85, INT: 60, REG: 60, COM: 65 },
  },
  {
    id: "oracle",
    name: "Oracle",
    alias: "Sorcerer",
    color: "#8E7BB5",
    tagline: "Senses the bug before the stack trace.",
    motto: "Pattern, not proof.",
    voice: "intuitive · associative · sometimes uncanny",
    blurb:
      "You diagnose by smell. You can hold a system in your head and notice when it twitches. Your weakness is that you can't always show your work — which costs you when others need to follow you.",
    signatureRoles: ["Principal Engineer", "Performance Specialist", "Debugging Lead"],
    shadow: "Unteachable expertise. What you know dies with your tenure.",
    vector: { ANL: 82, CRT: 88, CRE: 88, DOM: 92, FOC: 75, CUR: 82, INT: 78, REG: 70, COM: 60 },
  },
  {
    id: "berserker",
    name: "Berserker",
    alias: "Barbarian",
    color: "#D86A6A",
    tagline: "Hits the problem until the problem stops moving.",
    motto: "Sleep is for compile time.",
    voice: "intense · unfiltered · all-in",
    blurb:
      "When the production fire starts, you run toward it. You will sit with a bug for fourteen hours and emerge knowing things about it nobody else will ever know. Your weakness is that the fire often doesn't need to be that big.",
    signatureRoles: ["Incident Commander", "Crunch-mode Lead", "Solo Founder"],
    shadow: "Burnout as a service. You scale until you don't.",
    vector: { ANL: 72, CRT: 70, CRE: 75, DOM: 80, FOC: 95, CUR: 70, INT: 75, REG: 45, COM: 60 },
  },
  {
    id: "druid",
    name: "Druid",
    alias: "Druid",
    color: "#7BA88E",
    tagline: "Tends the codebase like a forest, not a factory.",
    motto: "Long systems live longer.",
    voice: "patient · ecological · maintenance-aware",
    blurb:
      "You think in years, not sprints. You believe a codebase has a shape, a climate, and seasons — and you tend it accordingly. Your weakness is that you sometimes resist necessary disruption because the garden is finally taking root.",
    signatureRoles: ["Maintainer", "Open Source Steward", "Long-tenure Engineer"],
    shadow: "Conservatism. The garden is healthy; the world has moved on.",
    vector: { ANL: 80, CRT: 78, CRE: 70, DOM: 85, FOC: 88, CUR: 75, INT: 92, REG: 88, COM: 82 },
  },
];

export const ARCHETYPE_BY_ID = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a])
) as Record<string, Archetype>;
