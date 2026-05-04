# Devclass — Project Specification

> *"You don't have to be good. You have to be a class."*

An open-source, self-assessment web app that quizzes developers across nine programming-craft metrics, builds a skill profile, assigns them a D&D-style archetype, and recommends a personalized improvement path and best-fit roles.

Inspired by the framework laid out in Manware's *"Are You A Good Programmer?"* (May 2026).

---

## 1. Vision & Philosophy

### 1.1 Core thesis
There is no objective scale for "good developer." There are *shapes* — profiles of strengths and weaknesses. Devclass treats developers like RPG characters: every class is viable, every build has tradeoffs, and the only failure mode is refusing to level up.

### 1.2 Why this exists
- Standard developer assessments (LeetCode, HackerRank, even StackOverflow's surveys) measure technical recall and speed. They miss craft, judgment, and the non-technical traits that distinguish working professionals.
- The "AI is replacing mid-tier devs" discourse pressures developers to define themselves on a single axis (raw output). Devclass deliberately fragments that into nine independent axes.
- Self-knowledge → targeted improvement. You can't lift the right dumbbell if you don't know which one is weakest.

### 1.3 Non-goals
- **Not a hiring tool.** Devclass is for self-reflection. Companies should not gate hiring on it.
- **Not a leaderboard.** No global rankings. No "you scored higher than 73% of users." That undermines the whole premise.
- **Not a personality test.** Archetypes describe trained habits, not fixed traits. Everything is buildable.

### 1.4 Open source posture
- **License:** MIT for the codebase (max adoption), CC-BY-SA for the question bank and archetype definitions (so derivatives stay open).
- **Data:** No data exists yet for validation. The plan is to crowdsource calibration via opt-in anonymized aggregate stats once usage exists. Until then, the system is honest about being an *opinion-driven framework*, not a validated psychometric instrument.
- **Contributions:** Quiz questions, archetype definitions, and improvement resources all live in versioned JSON/YAML files. Community PRs welcome.

---

## 2. The Nine Skill Pillars

Each pillar is scored 0–100. Definitions are taken directly from the source video and elaborated.

| # | Pillar | Code | One-line definition |
|---|---|---|---|
| 1 | Analytical Thinking | `ANL` | Connecting things that don't look related (e.g., a networking solution to a backend problem). |
| 2 | Critical Thinking | `CRT` | Questioning your *own* solutions, not just other people's. |
| 3 | Creativity | `CRE` | Seeing outside the box (e.g., using physics to build a true RNG). |
| 4 | Domain Knowledge | `DOM` | Technical (frameworks, common bugs) **and** non-technical (healthcare, finance, telecom). |
| 5 | Capacity for Prolonged Focus | `FOC` | Consistency over talent. Sustained attention on hard problems. |
| 6 | Curiosity & Novelty Seeking | `CUR` | Needing to know *why* it works, not stopping when it just works. |
| 7 | Experiential Intuition | `INT` | Knowing what *not* to build, when to stop, which tradeoffs matter. Taste. |
| 8 | Emotional Regulation | `REG` | Burnout, ego, anxiety. "Most developers don't fail technically — they fail mentally." |
| 9 | Communication | `COM` | Explaining ideas, pushing back, saying no, being a team player. |

### 2.1 Why nine and not four
The video's framework is nine. We keep nine as the source of truth. The UI may *visually* group them into four families for the radar/profile card:

- **Mind** (ANL, CRT, CRE)
- **Knowledge** (DOM, CUR)
- **Will** (FOC, REG)
- **Craft & Voice** (INT, COM)

Families are display-only; scoring and archetypes use all nine.

---

## 3. The Archetype System

### 3.1 Mechanics
- Each archetype is defined as a 9-dimensional **target vector** in metric space.
- A user's profile is also a 9-d vector.
- Distance between user and each archetype is computed (cosine similarity over normalized vectors works best for "shape match" rather than "magnitude match" — we want to match someone's *pattern*, not how high they scored overall).
- **Primary class** = closest match.
- **Subclass / multiclass** = 2nd and 3rd closest, if within a threshold (cos sim ≥ 0.85 of primary). Most users will be multiclass; pure single-class is rare.

### 3.2 The starter ten classes

Each has: a **D&D analog**, a **primary stat cluster**, a **shadow** (the failure mode), and **canonical roles** they fit.

#### 1. The Architect — *Wizard*
**High:** ANL · CRT · INT · DOM
**Shadow:** Over-engineers, builds for problems that don't exist, alienates pragmatists.
**Roles:** Staff Engineer, Tech Lead, Systems Designer, Platform Architect.
*Sees the structure underneath the structure. Designs the building before pouring concrete.*

#### 2. The Artisan — *Bard*
**High:** CRE · FOC · INT · COM
**Shadow:** Polishes past the point of value. Disagrees aesthetically with "good enough."
**Roles:** Senior Frontend, Design Engineer, UX Engineer, Product Engineer.
*The build matters. The feel matters. Ships things that look and feel right.*

#### 3. The Sage — *Cleric*
**High:** DOM · CUR · COM · CRT
**Shadow:** Knows so much they struggle to ship; perfectionism via expertise.
**Roles:** Principal Engineer, Domain Expert, DevRel, Engineering Author, Specialist (DB, security, etc).
*Has read the papers. Has read the source. Will tell you why your idea won't work — and what will.*

#### 4. The Pathfinder — *Ranger*
**High:** CUR · CRE · ANL · INT (with high tolerance for ambiguity)
**Shadow:** Chases novelty over follow-through. Half-finished prototypes.
**Roles:** R&D, Founding Engineer, Prototyper, Research Engineer, ML/AI explorer.
*First to try the new framework. First to abandon it. First to find the one that actually works.*

#### 5. The Sentinel — *Paladin*
**High:** FOC · REG · DOM · CRT
**Shadow:** Risk-averse to the point of stagnation. Slow to adopt.
**Roles:** SRE, Platform Engineer, Backend at scale, Reliability Engineer, Senior Maintainer.
*The pager doesn't scare them. Production is sacred. They will rewrite your sloppy migration.*

#### 6. The Diplomat — *Bard / Cleric hybrid*
**High:** COM · REG · CRT · ANL
**Shadow:** Can drift away from hands-on craft. "Architecture astronaut" risk.
**Roles:** Engineering Manager, Tech Lead, Staff IC with breadth, Bridge between product and eng.
*The team's emotional load-bearing wall. Translates between camps that hate each other.*

#### 7. The Hacker — *Rogue*
**High:** CRE · CUR · ANL · CRT
**Shadow:** Cleverness as a vice. "Look what I can do" code.
**Roles:** Security Engineer, Reverse Engineer, Infrastructure Hacker, Bug Hunter, CTF specialist.
*Reads RFCs for fun. Has opinions about your TLS config. Will find the edge case.*

#### 8. The Oracle — *Sorcerer*
**High:** INT · REG · CRT · CRE (high INT especially)
**Shadow:** Hard to articulate why; conflicts with junior teammates who want explanations.
**Roles:** Founder/CTO, Principal Engineer, Product Engineer, Lead at small co.
*Doesn't always know how they know. Just does. Cuts the scope no one else would have.*

#### 9. The Berserker — *Barbarian*
**High:** FOC · CRE · CUR
**Low:** COM · REG (often)
**Shadow:** Burns out. Hard to work with. Depends on others to clean up.
**Roles:** Indie hacker, Solo founder, Hackathon winner, Skunkworks engineer.
*Six tabs, three energy drinks, ships a working MVP in 72 hours. Don't ask about the code.*

#### 10. The Druid — *Druid*
**High:** DOM (non-technical) · CRE · CUR · COM
**Shadow:** Stretched thin across too many domains, master of none.
**Roles:** Healthcare engineer, FinTech architect, ML-for-X engineer, Bio + code, Embedded systems in industry.
*The bridge between the field and the code. Speaks both languages. Knows which compromises actually matter.*

### 3.3 Multiclass naming
When a user's top two are within threshold, label them as a hybrid: *Architect / Sage*, *Berserker / Pathfinder*. Hybrids should feel celebrated, not ambiguous. Most senior engineers in real life are hybrids.

### 3.4 Adding archetypes
New archetypes ship as JSON in `/data/archetypes/*.json`. The schema:

```json
{
  "id": "architect",
  "name": "The Architect",
  "dnd_analog": "Wizard",
  "tagline": "Sees the structure underneath the structure.",
  "target_vector": { "ANL": 90, "CRT": 85, "CRE": 70, "DOM": 80, "FOC": 70, "CUR": 65, "INT": 85, "REG": 70, "COM": 65 },
  "shadow": "Over-engineers...",
  "canonical_roles": ["Staff Engineer", "Tech Lead", "..."],
  "lore_short": "...",
  "lore_long": "..."
}
```

Target vectors are author-defined for v1. Once the calibration dataset exists, vectors can be re-fit to actual user clusters.

---

## 4. Functional Requirements

### 4.1 User flow

```
Landing  →  Sign in (GitHub)  →  Onboarding (3 screens)  →  Quiz (~15 min)
                                                                 ↓
                                                          Reveal animation
                                                                 ↓
                                          Profile page (radar + archetype card)
                                                                 ↓
                                  Improvement plan + Job recommendations
                                                                 ↓
                                Re-take after 90 days (track progress over time)
```

### 4.2 Authentication
- **Primary:** GitHub OAuth (devs have GitHub, and it lets us optionally pull behavioral signals later — language diversity, contribution graph rhythm, etc.).
- **Secondary:** Email + magic link, for the GitHub-averse.
- No password storage. No social profiles beyond GitHub.

### 4.3 The quiz

**Length target:** 30–35 questions, ~12–15 minutes. Anything longer kills completion.

**Question types** (mix throughout):

| Type | Count | Purpose |
|---|---|---|
| Likert agreement (1–5) | ~10 | Self-report on habits ("When I solve a bug, I dig until I understand the root cause, even if a workaround would suffice.") |
| Forced-choice scenario | ~12 | Two equally appealing options, each loading on different metrics. ("You have a week. Do you ship the messy version that works, or refactor the existing one?") |
| Behavioral / past-tense | ~6 | "In the last month, how often did you…" — frequencies are harder to fake than ideals. |
| Free-text (Gemini-scored) | 2–3 | Open prompts: *"Describe a time you decided NOT to build something. What stopped you?"* Scored by Gemini against a rubric for INT, CRT, REG. |

**Loading:** Each question loads on 1–3 metrics with weights. Stored in `/data/questions/*.yaml`:

```yaml
- id: q_focus_01
  type: likert
  prompt: "I can sustain deep focus on a single problem for 2+ hours without checking notifications."
  loadings:
    FOC: 1.0
    REG: 0.3
- id: q_int_creative_01
  type: forced_choice
  prompt: "Your manager asks for a feature. You think it's the wrong solution. You..."
  options:
    - text: "Build it as asked, raise concerns in the PR."
      loadings: { COM: 0.5, REG: 0.7 }
    - text: "Push back before starting; propose an alternative."
      loadings: { COM: 0.8, INT: 0.6, CRT: 0.5 }
    - text: "Build what you think is right, then justify it."
      loadings: { CRE: 0.4, INT: 0.5, COM: -0.4 }
    - text: "Build both, present a comparison."
      loadings: { ANL: 0.5, CRE: 0.5, FOC: -0.3 }
```

Negative loadings let an option *deduct* from a metric (e.g., the "build what I think is right and justify it" answer reduces COM score because it skips the conversation).

**Anti-gaming:**
- Mix positively and negatively phrased Likert items per metric.
- Reverse-scored items (3 per metric minimum).
- Scenario questions don't reveal which metrics they load — answers can't be optimized.
- Gemini's free-text rubric checks for *substance*, not keywords. A user who writes "I have great experiential intuition" gets scored on whether their *example* demonstrates it.

**Length variants:**
- **Quick build** (~12 questions, 5 min): for casual users. Lower confidence interval shown on results.
- **Standard** (~33 questions, 15 min): default.
- **Deep dive** (~50 questions, 25 min): max confidence. Unlocks finer-grained subclass detection.

### 4.4 Scoring algorithm

```
For each metric M:
    raw_score[M] = Σ (answer_value[q] × loading[q,M]) for all answered q
    normalized[M] = (raw_score[M] - min_possible) / (max_possible - min_possible) × 100

For free-text questions:
    Gemini scores each response on relevant metrics (0-100 per metric)
    with rubric, returns scores + 1-line justification.
    Free-text contributes ~15% of final score for INT, CRT, REG.

User profile vector = [normalized[ANL], normalized[CRT], ..., normalized[COM]]

For each archetype A:
    similarity[A] = cosine_similarity(user_vector, archetype.target_vector)

Primary class = argmax(similarity)
Sub/multi classes = all A where similarity[A] >= 0.85 × similarity[primary], excluding primary
```

**Confidence indicator:** Distance between top-1 and top-2 similarity. If the spread is small, show "You're a strong multiclass — these classes describe you almost equally."

### 4.5 Profile page

The result page is the product. It must feel like a character sheet, not a quiz result.

**Components, top to bottom:**
1. **Archetype reveal banner** — animated, the class name, tagline, D&D analog. (Use Framer Motion for the reveal.)
2. **9-axis radar chart** — Recharts. Each axis is a metric. User's polygon overlaid on archetype's target polygon (translucent). Visual proof of fit.
3. **Class card** — flavor text, shadow warning, signature strengths.
4. **Multiclass strip** (if applicable) — "You also resonate with: The Sage (cos 0.91)."
5. **The Dumbbell** — your *lowest* metric, called out specifically. Title borrowed from the video: *"Take one aspect you're the worst at and start lifting that dumbbell."*
6. **Improvement plan** — 3–5 personalized actions (see §5).
7. **Best-fit roles** — top 3 from your primary class, plus one "stretch role" that uses your second-strongest metric cluster.
8. **Re-take CTA** — "Come back in 90 days and see how you've leveled up."

### 4.6 Improvement engine

For each metric, maintain a curated list of resources tagged by current-score range (low/mid/high) and effort level (light/medium/deep). Stored in `/data/improvements/<metric>.json`.

Example structure:
```json
{
  "metric": "FOC",
  "name": "Capacity for Prolonged Focus",
  "improvements": [
    {
      "score_range": [0, 40],
      "effort": "light",
      "type": "habit",
      "title": "Two 90-minute deep work blocks per day",
      "description": "...",
      "resource": null
    },
    {
      "score_range": [40, 70],
      "effort": "medium",
      "type": "book",
      "title": "Deep Work — Cal Newport",
      "url": "...",
      "rationale": "Builds the conceptual frame for focus as a trainable skill."
    }
  ]
}
```

**Gemini's role here:** given the user's full profile and primary archetype, Gemini composes the improvement plan into a coherent narrative ("As an Architect with a low REG score, your biggest leverage point is…"). It picks 3–5 items from the curated lists, doesn't invent new ones, and explains *why* each fits this user.

### 4.7 Job recommendations

Each archetype carries a `canonical_roles` list. Job recommendations rank these by:
1. Match strength to user's primary class.
2. User-stated current experience level (asked in onboarding: junior / mid / senior / staff+).
3. Optional: stated interests (frontend / backend / infra / etc.) — used as a filter, not a scorer.

Recommendations are role *titles and descriptions*, not job postings. We are not a job board. Linking to one in v2 is fine; building one is out of scope.

### 4.8 Re-takes & progression
- Users can re-take after 30 days (soft) or any time with a "this won't replace your current profile" warning.
- All historical profiles stored.
- Profile page shows a small "level up" graph: each metric over time across re-takes.
- This is the long-term hook. Quizzes that you take once aren't products.

---

## 5. Architecture

### 5.1 Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Antigravity has strong Next.js scaffolding; SSR for share cards. |
| Styling | Tailwind CSS + shadcn/ui | shadcn is library-of-choice for Antigravity-generated UIs. |
| Charts | Recharts | Good radar chart support, lightweight. |
| Animation | Framer Motion | The reveal moment matters. |
| Auth | NextAuth.js (Auth.js v5) | GitHub provider out of the box. |
| DB | SQLite (dev) → Postgres (prod) via Prisma | Trivial migration path. |
| LLM | Google Generative AI SDK — `gemini-2.5-pro` for free-text scoring, `gemini-2.5-flash` for plan generation | Speed/cost split. |
| Hosting | Vercel (free tier viable up to thousands of users), or self-host on a VPS | Open-source repo should run anywhere. |
| Analytics | Plausible (self-hostable, privacy-respecting) | No Google Analytics. |

### 5.2 Repo layout

```
devclass/
├── apps/
│   └── web/                    # Next.js app
│       ├── app/
│       │   ├── (marketing)/    # landing
│       │   ├── (app)/          # signed-in
│       │   │   ├── quiz/
│       │   │   ├── profile/
│       │   │   └── history/
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   ├── quiz/
│       │   │   ├── score/
│       │   │   └── plan/
│       │   └── layout.tsx
│       └── components/
├── packages/
│   ├── scoring/                # pure-fn scoring engine, unit-tested
│   ├── archetypes/             # archetype matching logic
│   └── prompts/                # Gemini prompt templates
├── data/
│   ├── questions/*.yaml
│   ├── archetypes/*.json
│   └── improvements/*.json
├── prisma/
│   └── schema.prisma
├── docs/
│   ├── CONTRIBUTING.md
│   ├── adding-questions.md
│   └── adding-archetypes.md
└── README.md
```

**Why monorepo?** Scoring is pure-functional and should be testable in isolation. Splitting it as a package makes the algorithm auditable and forkable — important for an open-source psychometric-adjacent tool.

### 5.3 Data model (Prisma)

```prisma
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  githubLogin   String?
  experience    String?    // junior | mid | senior | staff
  interests     String[]   // frontend, backend, infra, ml, ...
  createdAt     DateTime   @default(now())
  attempts      Attempt[]
}

model Attempt {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  variant       String     // quick | standard | deep
  startedAt     DateTime   @default(now())
  completedAt   DateTime?
  answers       Answer[]
  scoreANL      Float?
  scoreCRT      Float?
  scoreCRE      Float?
  scoreDOM      Float?
  scoreFOC      Float?
  scoreCUR      Float?
  scoreINT      Float?
  scoreREG      Float?
  scoreCOM      Float?
  primaryClass  String?
  multiclass    String[]   // ordered list
  planJson      Json?      // cached Gemini plan
}

model Answer {
  id            String     @id @default(cuid())
  attemptId     String
  attempt       Attempt    @relation(fields: [attemptId], references: [id])
  questionId    String
  value         Json       // {choice: "b"} or {likert: 4} or {text: "..."}
  rubricJson    Json?      // Gemini's free-text scoring output
}
```

### 5.4 API endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/*` | NextAuth handlers |
| POST | `/api/quiz/start` | Create new attempt, return question set |
| POST | `/api/quiz/answer` | Submit answer (one at a time → resumability) |
| POST | `/api/quiz/finish` | Trigger scoring, archetype assignment |
| POST | `/api/score/freetext` | Gemini free-text scoring (called from finish) |
| GET | `/api/profile` | Return latest attempt + computed view |
| POST | `/api/plan/generate` | Gemini-generated improvement plan (cached on attempt) |
| GET | `/api/history` | All past attempts with scores over time |

### 5.5 Gemini prompt design

Prompts live in `packages/prompts/` as templated TypeScript. Each is unit-tested with golden-output fixtures so prompt regressions are visible in PRs.

**Free-text scoring prompt sketch:**
```
You are a developer-skills assessor. Given the question, the user's answer,
and a rubric, score the answer on the listed metrics from 0-100 each.

Question: {{question}}
Answer: {{answer}}
Metrics to score: {{metrics_with_descriptions}}

Rubric: A score of 80+ requires concrete, specific examples. Generic claims
("I always think about edge cases") score below 50. Look for:
- Specificity (named tools, named decisions, named tradeoffs)
- Self-awareness (acknowledging the alternative they didn't take)
- Causal reasoning (why X led to Y)

Output strict JSON:
{
  "scores": { "INT": 72, "CRT": 65 },
  "rationale": { "INT": "...", "CRT": "..." }
}
```

**Plan generation prompt** takes the full profile + archetype + curated improvement library and returns a 3–5 item plan with rationale per item. The library is passed in-context — Gemini selects, never invents.

---

## 6. Design System & UX

### 6.1 Aesthetic direction
Modern dark fantasy. *Not* cheesy dragons-and-scrolls. Think: Linear meets a tasteful character sheet. Disco Elysium's UI more than World of Warcraft's.

- **Backgrounds:** Deep ink-blue (#0B0F1A) primary, near-black (#06080F) secondary.
- **Accents:** Parchment cream (#E8DCC4) for text on dark; muted gold (#C9A86A) for highlights and class names; cool teal (#5EC4C0) for interactive elements.
- **Class colors:** Each archetype has a signature color used in radar overlays and badges. Architect = ice blue, Berserker = ember red, Druid = moss green, etc.

### 6.2 Typography
- **Headers:** *Cormorant Garamond* or *EB Garamond* — gives the character-sheet feel without going full Tolkien.
- **Body:** *Inter* — keep it readable.
- **Mono:** *JetBrains Mono* — for code snippets in improvement resources.

### 6.3 Key screens

**Landing**
- One-line hook: *"You're not a 10x dev. You're a class. Find out which one."*
- Below the fold: the 10 archetype cards in a grid, with hover lore.
- Single CTA: "Take the quiz."

**Quiz**
- One question at a time, no progress bar of the "12 of 33" variety (creates exit pressure). Instead, a slim filling rune at the top.
- Free-text questions get extra UI affordances: word count guidance ("aim for 80–150 words"), and a "this answer is read by Gemini and used for scoring" disclosure.
- Saving is automatic per answer. Closing the tab and coming back resumes.

**Reveal**
- Black screen, fade up the radar chart drawing axis-by-axis (animated).
- Then class name swooshes in with the D&D analog beneath in italic.
- Then tagline.
- Then the rest of the page reveals.
- This is a 4–6 second moment. It's the screenshot users will share.

**Profile**
- Character-sheet two-column layout on desktop. Stack on mobile.
- Left: radar + class card.
- Right: dumbbell, plan, roles.
- "Share my class" button generates a 1200×630 OG-image card (Next.js `ImageResponse`) for Twitter/LinkedIn.

### 6.4 Accessibility
- All radar chart data also rendered as a sortable table (screen readers).
- Color is never the only signal — class colors carry icons too.
- Keyboard navigation through the quiz, no traps.
- Reduced-motion respects `prefers-reduced-motion` (the reveal becomes a static fade).

---

## 7. Open Source Operations

### 7.1 Licensing
- **Code:** MIT.
- **Question bank, archetype definitions, improvement library:** CC-BY-SA 4.0. Commercial forks must keep these open.
- **Trademark:** "Devclass" reserved; forks must rename.

### 7.2 Contribution flow
1. Question contributions go through a `data/questions/<metric>/proposals/*.yaml` directory with a PR template that requires:
   - Statement of which metric(s) it loads on
   - Rationale (why this question discriminates between high and low scorers)
   - Reverse-scored variant if applicable
2. Two maintainer reviews required for question merges.
3. Archetype contributions require a sample target vector + at least 3 example real-world role mappings + lore.

### 7.3 Calibration roadmap
The honest disclosure: until we have real data, target vectors are author opinion. Plan:
- v1: Author-defined vectors. Big disclaimer on the profile page: *"Devclass is currently a framework, not a validated instrument. Take it as a thinking tool, not a diagnosis."*
- v2 (after ~5k attempts): Opt-in anonymized aggregate stats. Recompute archetype centroids by clustering. Re-fit target vectors.
- v3: Test-retest reliability study (do users get the same archetype 90 days later if their habits haven't changed?). Publish as a methodology paper.

### 7.4 Privacy
- Free-text answers are sent to Gemini (Google) for scoring. **This is disclosed explicitly before each free-text question, with an opt-out** (skip the question; lose ~5% of score precision).
- All other scoring is local.
- No selling of data. No third-party trackers. Plausible analytics only.
- GDPR delete-my-data endpoint from day one.

---

## 8. Roadmap

### Phase 0 — Skeleton (week 1–2)
- Next.js scaffold, auth, schema, deploy a "hello" version.
- Build the scoring engine package with unit tests against synthetic profiles.

### Phase 1 — MVP (week 3–6)
- Standard 33-question quiz, all multiple-choice (no free-text yet).
- 10 archetypes shipped.
- Static improvement plans (no Gemini yet).
- Profile page with radar + class card.
- Public launch on HN / dev.to / r/programming.

### Phase 2 — Gemini integration (week 7–9)
- Free-text questions added.
- Gemini-powered personalized improvement plans.
- Shareable OG-image cards.

### Phase 3 — Progression (week 10–12)
- Re-take flow.
- History view with metric-over-time chart.
- Email reminders ("It's been 90 days. Want to see if you've leveled up?").

### Phase 4 — Community & calibration (post-launch, ongoing)
- Question contribution workflow.
- Anonymized aggregate stats opt-in.
- Re-fit archetype vectors.

### Phase 5 — Stretch goals
- **Party mode:** invite teammates, see your team's archetype composition. *"You have three Architects and no Diplomats. That's why your standups feel that way."*
- **GitHub signal layer:** with permission, augment the score with behavioral data — language diversity (CUR), commit-time consistency (FOC), PR comment quality (COM). Always optional, always disclosed.
- **Career mode:** track aspirational class. Choose a class you want to grow into; get a long-term plan.

---

## 9. Risks & Open Questions

| Risk | Mitigation |
|---|---|
| Validity — the framework isn't science | Honest framing throughout. Disclaimers. Long-term calibration plan. |
| Gameability — users figuring out optimal answers | Reverse-scored items, scenario questions, hidden loadings, free-text rubric checks. |
| LLM cost at scale | Free-text questions opt-out path; use Flash for plan generation; cache plans per attempt. |
| Bias in archetype definitions | Author opinion bias is real. CC-BY-SA license + community contributions. v2 re-clusters from real data. |
| "This is just a personality test" criticism | Lean into it. The video itself frames this as a self-reflection tool. We don't claim more. |
| Low quiz completion (15 min is long) | Quick variant (5 min), per-question saving, no progress-bar pressure, strong reveal payoff. |
| AI/Gemini outage breaks scoring | Free-text is enhancement, not requirement. Multiple-choice scoring works fully offline. |

### Open questions for the team
1. **Do we surface the user's metric scores as raw numbers, or only the radar shape?** (Numbers → users obsess over points. Shape only → users compare against archetype, not each other.) Recommendation: shape only, with raw numbers behind a "show details" toggle.
2. **Should multiclass be a fixed top-2 or threshold-based?** Recommendation: threshold-based, capped at 3.
3. **Should we ever tell a user their lowest score *category*, not just metric?** Risk: someone with low REG seeing "you have low emotional regulation" hits hard. Recommendation: frame as a habit ("Your stress-recovery patterns suggest…"), never as an identity claim.

---

## 10. Acceptance criteria for "MVP done"

- [ ] User can sign up with GitHub, take 33-question quiz, and reach a profile page in <20 minutes.
- [ ] Profile page renders radar chart with 9 axes, primary archetype, and 3 improvement items.
- [ ] All scoring logic has unit tests; >80% coverage in the `scoring` package.
- [ ] Question YAML has at least 4 questions per metric, balanced for reverse-scoring.
- [ ] All 10 archetypes shipped with target vectors, lore, and canonical roles.
- [ ] Repo is public, MIT-licensed, has CONTRIBUTING.md and a working CI pipeline.
- [ ] Lighthouse: 90+ on performance, 100 on accessibility.
- [ ] Honest framing visible on the profile page.

---

*"There is no finish line where you suddenly become good enough. There's just progress."*
— Manware

This spec is living. Change it. PRs welcome.
