import type { ArchetypeId, MetricCode } from "./types";

export interface ClassVisual {
  image: string;
  scene: string;
  dialogue: string;
  pulse: string;
}

export const CLASS_VISUALS: Record<ArchetypeId, ClassVisual> = {
  architect: {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    scene: "Systems room, whiteboards full, the next five years already asking questions.",
    dialogue: "Give me the invariants; the code can follow.",
    pulse: "blueprint logic",
  },
  artisan: {
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
    scene: "A design bench where tiny choices become the whole feeling of the product.",
    dialogue: "The interface should feel inevitable.",
    pulse: "craft pressure",
  },
  sage: {
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80",
    scene: "Library light, old source files, a patient trail from question to proof.",
    dialogue: "Let's read the source before we rename the concept.",
    pulse: "patient evidence",
  },
  pathfinder: {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    scene: "Unmapped edge of the stack, fresh tracks where the docs stop being helpful.",
    dialogue: "I found a route nobody documented.",
    pulse: "first-light motion",
  },
  sentinel: {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    scene: "Server room hum, calm dashboards, rollback paths already rehearsed.",
    dialogue: "If it can fail at 3am, design it now.",
    pulse: "quiet uptime",
  },
  diplomat: {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80",
    scene: "A room of crossed incentives slowly turning into a shared decision.",
    dialogue: "The hard part is aligning the humans.",
    pulse: "human protocol",
  },
  hacker: {
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
    scene: "Green terminal light, one impossible Friday, a prototype learning to breathe.",
    dialogue: "Constraints are just a smaller playground.",
    pulse: "fast path",
  },
  oracle: {
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    scene: "Circuit traces and stack traces, the pattern visible before the proof arrives.",
    dialogue: "The trace says one thing; the shape says another.",
    pulse: "pattern sense",
  },
  berserker: {
    image:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1400&q=80",
    scene: "Launch pressure, red timers, the kind of focus that eats the whole calendar.",
    dialogue: "Put the problem in front of me and clear the calendar.",
    pulse: "incident drive",
  },
  druid: {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
    scene: "Old growth, slow refactors, a codebase tended through seasons.",
    dialogue: "A codebase has seasons. Tend the next one.",
    pulse: "maintenance weather",
  },
};

export const METRIC_VISUALS: Record<MetricCode, { charge: string; verb: string }> = {
  ANL: { charge: "split the fog", verb: "map" },
  CRT: { charge: "test the claim", verb: "challenge" },
  CRE: { charge: "cross the wires", verb: "combine" },
  DOM: { charge: "go one layer down", verb: "descend" },
  FOC: { charge: "finish the boring 80", verb: "hold" },
  CUR: { charge: "learn past the ticket", verb: "wander" },
  INT: { charge: "tell the true thing", verb: "own" },
  REG: { charge: "notice before acting", verb: "steady" },
  COM: { charge: "make intent legible", verb: "translate" },
};

export function getClassVisual(id: string): ClassVisual {
  return CLASS_VISUALS[(id in CLASS_VISUALS ? id : "architect") as ArchetypeId];
}
