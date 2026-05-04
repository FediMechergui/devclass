# Devclass — Design System

> *Modern dark fantasy. Not cheesy. The character sheet, evolved.*

This document defines the visual and interaction design language for Devclass. It is the single source of truth for tokens, components, and page-level designs. When implementation drifts from this document, this document wins until it's updated.

---

## 1. Design Principles

Five principles. Anything that violates them needs a justification in writing.

### 1.1 The shape over the score
The user's *pattern* across the 9 axes is more important than any single number. Visual hierarchy always foregrounds the radar shape; raw numerical scores are secondary, available behind a toggle.

### 1.2 The reveal is the product
The moment a user discovers their archetype is the screenshot they'll share. It deserves disproportionate craft — animation, typography, sound design (optional). Everything else can be functional; this one moment must be special.

### 1.3 Restraint over fantasy tropes
The aesthetic is *evocative of* D&D character sheets, not a literal recreation. No dragons. No swords. No parchment textures. Class names and lore carry the fantasy; visual language stays clean and modern.

### 1.4 Honesty in the interface
The framework isn't validated science (yet). The UI never pretends otherwise. Disclaimers are present, readable, and styled with the same care as primary content — not buried in 10pt grey text.

### 1.5 Calm density
Information is dense. Layouts are calm. We avoid both the empty-startup-landing-page school (3 words per screen) and the dashboard-of-doom school (everything, everywhere, all at once). Expect a Linear-meets-character-sheet density: lots of meaningful content, quiet space around it.

---

## 2. Brand Identity

### 2.1 Name
**Devclass.** Lowercase in body text (`devclass`), title case in headers (`Devclass`), never all-caps.

### 2.2 Tagline
Primary: *"You're not a 10x dev. You're a class."*
Secondary (longer-form): *"Find your shape. Lift the right dumbbell."*

### 2.3 Logo
Wordmark only at MVP. Treatment: **Devclass** in EB Garamond Medium, with a small geometric mark to the left — a 9-pointed asterisk, each point slightly different length (representing the 9 unequal metrics). Mark is in `gold` color, wordmark is in `text-primary`.

```
   ✦  Devclass
   ↑      ↑
  gold   parchment
```

The asterisk shape is intentional: it echoes the radar polygon shape that defines a user's profile.

### 2.4 Voice
- **Direct, not bossy.** "Take the quiz" not "Begin your journey."
- **Wry, not snarky.** Class shadow descriptions can be funny. User-facing errors can't.
- **Confident, not arrogant.** We have an opinion on what makes a good developer. We're honest that it's an opinion.
- **Quotes from the source video** (Manware) appear sparingly throughout the app, attributed, in italic. They anchor the project to its origin.

---

## 3. Color System

### 3.1 Foundation: Ink & Parchment

The base palette. Two families: deep blue-blacks for backgrounds, warm creams for text. These two never compete with each other for attention.

**Inks (backgrounds, dark surfaces)**

| Token | Hex | Use |
|---|---|---|
| `--ink-base` | `#0B0F1A` | Page background |
| `--ink-elevated` | `#131826` | Cards, modals |
| `--ink-overlay` | `#0F1422` | Tooltips, dropdowns |
| `--ink-card` | `#1A2032` | Higher-elevation cards |
| `--ink-muted` | `#1F2638` | Disabled / inactive surfaces |

**Parchment (text, on-dark elements)**

| Token | Hex | Use |
|---|---|---|
| `--parchment-100` | `#E8DCC4` | Primary text |
| `--parchment-200` | `#D5C8AC` | High-contrast secondary text |
| `--parchment-400` | `#B5AB97` | Secondary text, labels |
| `--parchment-600` | `#7A7464` | Muted text, captions |
| `--parchment-800` | `#4A4538` | Disabled text |

### 3.2 Accents

**Gold** — for class names, key highlights, the wordmark. Used sparingly. Gold is precious; if it's on every button, it's on no button.

| Token | Hex | Use |
|---|---|---|
| `--gold-bright` | `#E8C885` | Hover state, glow |
| `--gold` | `#C9A86A` | Class names, primary highlight |
| `--gold-deep` | `#8B7042` | Subtle gold accent on dark |

**Teal** — interactive color. Buttons, links, focus rings. Distinct enough from gold that the user always knows what's clickable.

| Token | Hex | Use |
|---|---|---|
| `--teal-bright` | `#7DD8D5` | Hover, active states |
| `--teal` | `#5EC4C0` | Primary CTAs, links |
| `--teal-deep` | `#3A8985` | Pressed state |

### 3.3 Semantic colors

| Token | Hex | Use |
|---|---|---|
| `--success` | `#6FCF97` | Success messages, positive deltas |
| `--warning` | `#E8B86A` | Warnings, "low score" indicators |
| `--danger` | `#D86A6A` | Errors, destructive actions |
| `--info` | `#5E96C4` | Info banners, the validity disclaimer |

### 3.4 Class colors

Each archetype has one signature color, used in the radar overlay, the class badge, and the OG share image. They're chosen for visual distinctiveness when seen as a set, and to evoke each class's flavor.

| Archetype | Token | Hex | Flavor |
|---|---|---|---|
| The Architect | `--class-architect` | `#7BA8D9` | Ice blue — structured, cool, precise |
| The Artisan | `--class-artisan` | `#D9A87B` | Rose gold — crafted, warm |
| The Sage | `--class-sage` | `#95B58E` | Sage green — ancient knowledge |
| The Pathfinder | `--class-pathfinder` | `#E8B547` | Amber — frontier, sun-bleached maps |
| The Sentinel | `--class-sentinel` | `#6B8CAE` | Steel blue — armor, reliability |
| The Diplomat | `--class-diplomat` | `#B58EAE` | Warm violet — between worlds |
| The Hacker | `--class-hacker` | `#6FCF97` | Terminal green — cleverness, exploit |
| The Oracle | `--class-oracle` | `#8E7BB5` | Deep purple — mystical, taste |
| The Berserker | `--class-berserker` | `#D86A6A` | Ember red — passion, danger |
| The Druid | `--class-druid` | `#7BA88E` | Moss green — cross-domain bridge |

### 3.5 Usage rules

- **Two-color rule.** On any single screen, no more than two accent colors (gold + teal, or class-color + teal). Class colors replace gold on the profile page; gold is for everywhere else.
- **The 60-30-10 rough split.** ~60% ink, ~30% parchment, ~10% accent.
- **Never set text directly on `--ink-base`** for long-form content. Step it up to `--ink-elevated` so there's slight separation. Keeps eyes from straining.
- **Class color contrast.** Each class color has been chosen to pass WCAG AA against `--ink-base` for large text and graphics. Do not use them for body text.

---

## 4. Typography

### 4.1 Type stack

| Family | Use | Weight stack |
|---|---|---|
| **EB Garamond** | Display, headings, class names, lore | 400 (regular), 500 (medium), 600 (semibold), 500 italic |
| **Inter** | Body, UI, labels, buttons | 400, 500, 600, 700 |
| **JetBrains Mono** | Code, metric codes (`ANL`, `CRT`...), data | 400, 500 |

EB Garamond carries the character-sheet feeling on its own. Inter does the heavy lifting for everything functional. Don't mix them inside the same paragraph; use serif for the dramatic moments only.

### 4.2 Type scale

Modular scale, ratio 1.25, base 16px.

| Token | Size | Line-height | Use |
|---|---|---|---|
| `text-xs` | 12px | 16px | Captions, microcopy |
| `text-sm` | 14px | 20px | Secondary UI, labels |
| `text-base` | 16px | 24px | Body |
| `text-lg` | 18px | 28px | Lead paragraphs |
| `text-xl` | 20px | 30px | Subheadings |
| `text-2xl` | 24px | 32px | Section headings |
| `text-3xl` | 30px | 38px | Page titles |
| `text-4xl` | 36px | 44px | Major headings |
| `text-5xl` | 48px | 56px | Hero, class name on profile |
| `text-display` | 72px | 80px | Reveal moment, archetype name |

### 4.3 Heading patterns

- **Page titles** (h1): EB Garamond 500, `text-4xl`, `--parchment-100`.
- **Section headings** (h2): EB Garamond 500, `text-2xl`, `--gold`.
- **Subsection headings** (h3): Inter 600, `text-xl`, `--parchment-100`, with `letter-spacing: -0.01em`.
- **Class name headings** (the big moments): EB Garamond 500 italic, `text-5xl` on profile / `text-display` on reveal, in the archetype's class color.
- **Eyebrow labels** (above headings): JetBrains Mono 500, `text-xs`, all-caps, `letter-spacing: 0.12em`, `--parchment-600`.

### 4.4 Body patterns

- Default body: Inter 400, `text-base`, `--parchment-100`, `line-height: 1.6`.
- Reading copy on lore / improvement plans: Inter 400, `text-lg`, `line-height: 1.65`, max-width `65ch`.
- Lore / canonical quotes from archetype descriptions: EB Garamond 400 italic, `text-lg`, `--parchment-200`.
- Quotes from the Manware video: EB Garamond 500 italic, `text-lg`, with a left border in `--gold-deep`, attribution beneath in JetBrains Mono `text-xs` `--parchment-600`.

### 4.5 Metric codes

The three-letter codes (`ANL`, `CRT`, `CRE`, `DOM`, `FOC`, `CUR`, `INT`, `REG`, `COM`) are typeset in JetBrains Mono 500, `text-xs`, all-caps, with `letter-spacing: 0.05em`. They function as little glyphs throughout the UI — beside metric names, on score badges, on radar axis labels.

---

## 5. Spacing, Layout & Radius

### 5.1 Spacing scale
4px base unit. Use Tailwind's default scale (`space-1` = 4px, `space-2` = 8px, `space-4` = 16px, `space-8` = 32px, `space-16` = 64px).

### 5.2 Layout grid
- **Max content width:** 1200px (desktop).
- **Reading column:** 65ch for long-form copy.
- **Profile page:** two-column 1fr 1fr on desktop, stacks on `<lg`.
- **Quiz page:** centered single column, max-width 720px.
- **Gutters:** 24px desktop, 16px mobile.

### 5.3 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Inputs, small elements |
| `--radius-md` | 8px | Buttons, badges |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals, hero cards |
| `--radius-full` | 9999px | Pills, avatars |

### 5.4 Shadows

Heavy drop shadows fight a dark theme. Use them sparingly. Prefer **luminous shadows** (the same hue as the surface, slightly brighter) for elevation, and **glow shadows** in class-color or gold for high-impact elements.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.4)` | Subtle separation |
| `--shadow-md` | `0 4px 12px rgb(0 0 0 / 0.5)` | Cards |
| `--shadow-lg` | `0 12px 32px rgb(0 0 0 / 0.6)` | Modals |
| `--glow-gold` | `0 0 24px rgb(201 168 106 / 0.3)` | Hovered class card |
| `--glow-class` | `0 0 32px rgb({class-color} / 0.35)` | Reveal moment, class badge |

### 5.5 Borders

Borders are subtle but present. They give the character-sheet feel without leaning on textures.

- **Default border:** 1px solid `rgb(232 220 196 / 0.08)` (parchment at 8% alpha)
- **Hover border:** 1px solid `rgb(232 220 196 / 0.16)`
- **Focus border:** 2px solid `--teal`
- **Class-themed border** (on archetype cards): 1px solid `rgb({class-color} / 0.4)`

Decorative ornament borders — a single hairline divider with a small gold dot in the middle — appear above section headings on the landing page and the profile page. Used like an em dash. Do not overuse.

---

## 6. Iconography & Imagery

### 6.1 Icon system
**Lucide React** as the base set. Keep stroke width consistent at 1.5px. Size: 16px (inline), 20px (default), 24px (prominent), 32px (hero).

### 6.2 Metric glyphs

Each of the 9 metrics has a custom glyph — simple, geometric, monoline. They appear at the radar axis terminals, on metric cards, and in the improvement plan.

| Metric | Glyph concept |
|---|---|
| ANL | Connected nodes (graph) |
| CRT | A magnifying glass over a tilted square |
| CRE | A nine-pointed asterisk (the wordmark mark — creativity is the heart) |
| DOM | A tower of three stacked horizontals (layered knowledge) |
| FOC | A single point with a focusing ring around it |
| CUR | An arrow exiting a circle (out of the known) |
| INT | An eye with a partial frame around it |
| REG | A horizon line — half above, half below |
| COM | Two overlapping speech-shape rectangles |

All glyphs ship as SVG, monochrome, currentColor, in a single icon component (`<MetricGlyph metric="FOC" />`).

### 6.3 Class crests

Each of the 10 archetypes has a **crest** — a stylized geometric badge, ~120px square. Not literal D&D imagery (no shields, no crossed swords). Think more: tarot card minimalism. A primary geometric form + a secondary motif. Examples:

- **Architect:** A triangle composed of internal grid lines.
- **Artisan:** A circle with a single off-center cut.
- **Sage:** A book-shape rectangle with three horizontal lines inside.
- **Pathfinder:** An arrow that overshoots its containing circle.
- **Sentinel:** A square with reinforced corners.
- **Diplomat:** Two overlapping circles forming a vesica piscis.
- **Hacker:** A square with a small hole cut from one side.
- **Oracle:** A solid circle with a spiral interior.
- **Berserker:** A jagged lightning shape inside a frame.
- **Druid:** A circle bisected by a horizontal line, with a small node on the line.

Crests are designed in the archetype's class color on `--ink-base`. They appear on the class card, the OG share image, and as small badges throughout the app.

### 6.4 Photography & illustration
**None.** No stock photos. No illustrations of people. The entire visual language is geometric, typographic, and chart-driven. This is intentional: it keeps the app feeling like a tool, not a marketing site, and avoids representation issues entirely.

---

## 7. Component Library

Built on **shadcn/ui** primitives, restyled with Devclass tokens. Document additions here as they're built.

### 7.1 Buttons

**Primary**
- Background: `--teal`, hover `--teal-bright`, pressed `--teal-deep`
- Text: `--ink-base` (dark on teal, high contrast)
- Padding: `12px 24px`
- Radius: `--radius-md`
- Font: Inter 500, `text-sm`
- Focus ring: 2px `--teal-bright`, 2px offset

**Secondary**
- Background: transparent
- Text: `--parchment-100`
- Border: 1px `rgb(232 220 196 / 0.16)`
- Hover: background `rgb(232 220 196 / 0.04)`, border `rgb(232 220 196 / 0.24)`

**Ghost**
- Background: transparent
- Text: `--parchment-400`
- Hover: text `--parchment-100`
- For low-priority actions (Cancel, Skip)

**Class CTA** (used only on archetype cards)
- Background: transparent
- Text: class color
- Border: 1px class color at 0.4 alpha
- Hover: background class color at 0.08 alpha, glow shadow

### 7.2 Inputs

**Text input**
- Background: `--ink-elevated`
- Border: 1px `rgb(232 220 196 / 0.08)`
- Focus border: 2px `--teal`
- Text: `--parchment-100`
- Placeholder: `--parchment-600`
- Padding: `12px 16px`
- Radius: `--radius-sm`

**Textarea (free-text quiz answer)**
- Same styling as text input
- Min height: 160px
- Auto-grow up to 400px
- Word counter in lower-right corner: `--parchment-600`, `text-xs`, JetBrains Mono. Format: `82 / 80–150 words` — turns `--success` when in range.

**Likert input (1–5)**
- Five circular buttons in a row
- Each button: 44px diameter, `--ink-elevated` background, `--parchment-100` numeral
- Selected: filled with `--teal`, numeral becomes `--ink-base`
- Labels beneath the row: "Strongly disagree" / "Neutral" / "Strongly agree" in `--parchment-600` `text-xs`
- Reverse-scored questions show a small ↻ icon next to the prompt — invisible to users but visible during dev/QA

**Forced-choice option**
- Each option is a tappable card
- Background: `--ink-elevated`, hover `--ink-card`
- Border: 1px transparent → 1px `--teal` on selection
- Padding: 16px 20px
- Selected: glow shadow in `--teal` at low alpha
- Up to 4 options stack vertically; on wide screens may go 2x2 if options are short.

### 7.3 Cards

**Default card**
- Background: `--ink-elevated`
- Border: 1px `rgb(232 220 196 / 0.06)`
- Radius: `--radius-lg`
- Padding: 24px
- Shadow: `--shadow-md`

**Archetype card** (the headline element on the profile page)
- Background: gradient from `--ink-card` to `--ink-elevated` (subtle, top-down)
- Border: 1px class color at 0.3 alpha
- Glow: `--glow-class`
- Padding: 32px
- Contains: crest (top), class name (EB Garamond 500 italic, class color), D&D analog (smaller, italic, `--parchment-400`), tagline (Inter 500, `text-lg`), divider, body lore.

**Metric card**
- Compact card showing a single metric's score
- Glyph (left, 32px) + name (Inter 600) + score bar + raw number on the right
- Score bar: 4px tall, `--ink-base` background, fill in `--teal` (or `--warning` if score < 35)

### 7.4 Radar chart

The single most important visualization. Custom-styled Recharts `<RadarChart>`.

- **Axes:** 9 spokes, equal angles. Labels at terminus: metric glyph + 3-letter code in JetBrains Mono.
- **Gridlines:** Concentric polygons at 25%, 50%, 75%, 100%. Color: `rgb(232 220 196 / 0.06)`.
- **User polygon:** Fill in class color at 0.2 alpha, stroke in class color at full alpha, 2px.
- **Archetype target polygon (overlay, optional toggle):** Fill in class color at 0.05 alpha, stroke in class color at 0.4 alpha, 1px dashed.
- **Score dots at vertices:** 6px filled circles in class color.
- **Hover on a vertex:** tooltip with metric name, raw score, percentile-against-archetype-target.

The radar chart has a subtle entrance animation on the profile page: the polygon draws axis-by-axis over ~1.2s, then the score dots pop in.

### 7.5 Progress indicator (the rune)

Replaces a traditional "12 of 33" progress bar on the quiz. A single horizontal line at the top of the screen, full-width minus padding. Composed of 33 (or whatever count) tiny segments — each segment is 12px wide, separated by 2px gaps.

- Unanswered: segment in `rgb(232 220 196 / 0.06)`
- Answered: segment in `--teal` at 0.5 alpha
- Current: segment in `--teal` full, with a subtle `--glow-gold` shadow

When complete, all segments hold their state for 1s, then fade together into a horizontal line in `--gold` — a small ceremonial moment before the reveal.

### 7.6 Class badge (compact)

For navigation, history view, share previews. ~80px wide.

- Pill-shaped, `--radius-full`
- Background: class color at 0.12 alpha
- Border: 1px class color at 0.4 alpha
- Text: class name in EB Garamond 500 italic, class color, `text-sm`
- Tiny crest at left (24px)

### 7.7 Score number

When raw scores need to be shown:
- EB Garamond 500, `text-3xl`, `--parchment-100`
- Out of 100 in JetBrains Mono `text-sm` `--parchment-600` immediately to the right
- Format: `**73**` `/100`

Never display scores with decimals. Always integers.

### 7.8 Disclaimer banner

The validity disclaimer needs its own treatment.

- Background: `--ink-elevated`
- Border-left: 3px `--info`
- Padding: 16px 20px
- Radius: `--radius-md`
- Icon: `Info` (Lucide), 18px, `--info`
- Heading: Inter 600, `text-sm`, `--parchment-100`: *"Devclass is a thinking tool, not a diagnosis."*
- Body: Inter 400, `text-sm`, `--parchment-400`: a 1–2 sentence explanation linking to the methodology page.

---

## 8. Motion & Animation

### 8.1 Principles
- **Motion has meaning.** Every animation should answer: *what state changed?* If nothing changed, don't animate.
- **Easing default:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo) for entrances; `cubic-bezier(0.7, 0, 0.84, 0)` (ease-in-quart) for exits.
- **Duration scale:** 150ms (micro), 250ms (default UI), 400ms (deliberate), 800ms+ (cinematic moments).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` collapses all animations to instant transitions, except the radar polygon draw (replaced with a 200ms fade-in).

### 8.2 Specific animations

**Question transition (quiz)**
- Old question: fade and shift left −12px, 200ms.
- New question: fade and shift in from right +12px, 250ms, 50ms delay.

**Answer selection feedback**
- The chosen answer card shrinks-then-snaps (transform: scale(0.98) → scale(1)) over 180ms, with a brief teal glow (300ms fade).

**Quiz complete → reveal transition**
- 1s pause after final answer (the rune fades to gold).
- Screen fades to `--ink-base` over 600ms.
- 400ms hold of black.
- Reveal sequence begins.

**Reveal sequence (the centerpiece — ~5s total)**

```
0.0s   Black screen
0.4s   Hairline horizontal divider draws across the screen, gold, 600ms
1.0s   "YOUR CLASS" eyebrow label fades in (JetBrains Mono, --parchment-600), 400ms
1.4s   Pause
1.8s   Class name swooshes in (EB Garamond italic, class color, text-display)
       — letters reveal left-to-right, mask animation, 800ms
2.6s   D&D analog fades in beneath (italic, --parchment-400), 300ms
3.0s   Tagline fades in, 400ms
3.4s   Pause
3.8s   Crest scales in from 0.8 → 1.0 with a subtle glow pulse, 500ms
4.3s   Hairline below crest draws, 300ms
4.6s   "View your character sheet ↓" CTA fades in, gentle bounce
```

The user can press any key or scroll to skip the sequence — it jumps to the final state immediately.

**Radar chart entrance (profile page)**
- Axes draw clockwise from 12 o'clock, 100ms each. Total ~900ms.
- After axes, polygon strokes in (animated `stroke-dashoffset` from full → 0), 800ms.
- Then fill fades in, 400ms.
- Score dots pop in at vertices, staggered 60ms each.

**Hover micro-interactions**
- Cards: 200ms transition on background, border, shadow.
- Buttons: 150ms transition on background.
- Class crests on landing: 250ms scale to 1.04 + class-color glow.

### 8.3 Sound (optional, post-MVP)

A single optional cue: a soft, low chime at the moment the class name reveals. Default off. Toggleable in settings. If we add it, license a single CC0 sound; do not generate or layer.

---

## 9. Page Designs

Detailed layouts for the key pages. Antigravity should treat these as the source-of-truth wireframes.

### 9.1 Landing page

```
┌─────────────────────────────────────────────────────────────┐
│  ✦ Devclass                              [About] [GitHub]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│         You're not a 10x dev.                                │
│         You're a class.                                      │
│         ────                                                 │
│         Find your shape across nine craft metrics.           │
│         Get an archetype, an improvement plan, and a list    │
│         of roles where you'll thrive.                        │
│                                                              │
│         [ Take the quiz → ]    15 min · open source          │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│         · The ten classes ·                                  │
│                                                              │
│   [crest]  [crest]  [crest]  [crest]  [crest]                │
│   Architect Artisan Sage   Pathfinder Sentinel               │
│                                                              │
│   [crest]  [crest]  [crest]  [crest]  [crest]                │
│   Diplomat Hacker  Oracle  Berserker  Druid                  │
│                                                              │
│         (hover any crest for the lore)                       │
├─────────────────────────────────────────────────────────────┤
│         · The nine metrics ·                                 │
│                                                              │
│  [glyph] Analytical Thinking — connect things that don't     │
│  [glyph] Critical Thinking — question your own solutions     │
│  ... etc                                                     │
├─────────────────────────────────────────────────────────────┤
│         · Methodology, honestly ·                            │
│                                                              │
│  Devclass is a thinking tool, not a validated psychometric   │
│  instrument. The framework is opinion-driven. Read more →    │
├─────────────────────────────────────────────────────────────┤
│         · Inspired by ·                                      │
│                                                              │
│  > "There is no finish line where you suddenly become       │
│  > good enough. There's just progress."                      │
│  > — Manware, Are You A Good Programmer? (May 2026)          │
├─────────────────────────────────────────────────────────────┤
│  Footer: GitHub · CONTRIBUTING · License · @devclass         │
└─────────────────────────────────────────────────────────────┘
```

Hero: full viewport on desktop, ~80vh on mobile. The hero CTA is the only above-the-fold action; secondary actions are below.

### 9.2 Quiz page

```
┌─────────────────────────────────────────────────────────────┐
│  ┃┃┃┃┃┃┃┃┃┃▌░░░░░░░░░░░░░░░░░░░░░░  (the rune)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│       QUESTION 12 OF 33  · 4 MIN LEFT                        │
│                                                              │
│       When I solve a bug, I dig until I understand the       │
│       root cause — even if a workaround would suffice.       │
│                                                              │
│           ( 1 )  ( 2 )  ( 3 )  ( 4 )  ( 5 )                  │
│         Disagree              Neutral             Agree      │
│                                                              │
│                                                              │
│                                          [ Skip ]  [ Back ]  │
└─────────────────────────────────────────────────────────────┘
```

- Single question, single screen, vertical centering.
- Eyebrow: question number + estimated time remaining.
- The rune (progress bar) is the only top chrome.
- No confetti when answering. No streaks. No gamification beyond the run itself.

For free-text questions, the same layout, with the textarea replacing the Likert row, plus a small disclosure: *"Your answer is sent to Gemini for scoring. [Skip this question]"*

### 9.3 Reveal page

Full-bleed black. No chrome. See §8.2 for the sequence. The user can scroll through the reveal at any point to skip to the profile page; no "Continue" button needed.

### 9.4 Profile page (the character sheet)

```
┌─────────────────────────────────────────────────────────────┐
│  ✦ Devclass                                  [history] [me] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     ┌──────────────────────────────┐   ┌──────────────────┐ │
│     │                              │   │                  │ │
│     │    [9-axis radar chart]      │   │   [class crest]  │ │
│     │                              │   │                  │ │
│     │     User polygon, archetype  │   │   The Architect  │ │
│     │     polygon overlay          │   │   ~Wizard~       │ │
│     │                              │   │                  │ │
│     │     [show raw scores ▾]      │   │   "Sees the      │ │
│     │                              │   │   structure      │ │
│     │                              │   │   underneath."   │ │
│     │                              │   │                  │ │
│     │                              │   │   [lore body]    │ │
│     │                              │   │                  │ │
│     └──────────────────────────────┘   └──────────────────┘ │
│                                                              │
│     ┌──────────────────────────────────────────────────────┐│
│     │  YOU ALSO RESONATE WITH                              ││
│     │  [The Sage badge]   [The Diplomat badge]             ││
│     └──────────────────────────────────────────────────────┘│
│                                                              │
│     ┌──────────────────────────────────────────────────────┐│
│     │  THE DUMBBELL                                        ││
│     │  Your lowest metric is Communication (32/100).       ││
│     │  This is the one to lift first.                      ││
│     └──────────────────────────────────────────────────────┘│
│                                                              │
│     ┌──────────────────────────────────────────────────────┐│
│     │  YOUR IMPROVEMENT PLAN                               ││
│     │  Generated by Gemini, drawn from a curated library.  ││
│     │                                                       ││
│     │  1. ...                                              ││
│     │  2. ...                                              ││
│     │  3. ...                                              ││
│     └──────────────────────────────────────────────────────┘│
│                                                              │
│     ┌──────────────────────────────────────────────────────┐│
│     │  ROLES WHERE YOU'LL THRIVE                           ││
│     │  · Staff Engineer                                    ││
│     │  · Tech Lead                                         ││
│     │  · Platform Architect                                ││
│     │  + 1 stretch role: Engineering Manager (uses your    ││
│     │     second-strongest cluster)                        ││
│     └──────────────────────────────────────────────────────┘│
│                                                              │
│   [ Share my class → ]   [ Re-take in 90 days → ]            │
│                                                              │
│  ── Devclass is a thinking tool, not a diagnosis. ─────────  │
└─────────────────────────────────────────────────────────────┘
```

On mobile, the radar chart and class card stack vertically — radar on top.

### 9.5 History page

A vertical timeline of past attempts.

- Each attempt as a row: date, primary class (badge), small thumbnail of the radar polygon shape.
- Above the timeline: a single "leveling" line chart showing each metric's score over time. Pick a metric from a dropdown to focus.
- "You've leveled up Focus by +14 since your first attempt." — small celebratory text in `--gold`, but not over-the-top.

### 9.6 Methodology page

A long-form essay page explaining:
- What the 9 metrics are and why.
- How scoring works (in plain English, with a link to the open-source `scoring` package).
- How archetypes are defined (current = author opinion; future = clustered from data).
- Validity caveats. Test-retest reliability disclaimer. The honest acknowledgment that this is a v1 framework.

Designed in long-form reading style: 65ch column, generous line-height, EB Garamond italic pull quotes from the Manware video at section breaks.

### 9.7 OG / share image

1200×630 pixels. Generated dynamically per user via Next.js `ImageResponse`.

Layout:
- Background: `--ink-base` with a subtle radial gradient toward the class color in the upper-right.
- Top-left: `✦ Devclass` wordmark.
- Center-left: large class name in EB Garamond italic, class color.
- Center-right: the user's radar polygon (small, ~280px).
- Bottom: tagline + "devclass.app/u/{handle}".

The share image must be readable as a thumbnail. Test at 600×315.

---

## 10. Accessibility

Non-negotiable. WCAG 2.2 AA target.

### 10.1 Color contrast
- All body text passes AA against its background (4.5:1 for normal, 3:1 for large).
- Class colors against `--ink-base` are tested for graphic-element contrast (3:1 minimum). They are *not* used for body text.
- Focus rings are 2px `--teal-bright` with 2px offset, minimum 3:1 against any background they sit on.

### 10.2 Keyboard
- Tab order is logical and matches visual order.
- Quiz: ↑↓ arrows navigate Likert options, 1–5 number keys select directly, Enter submits.
- Esc cancels modals.
- Skip-to-content link at the top of every page.

### 10.3 Screen readers
- Radar chart: equivalent data is announced as a sortable table when reached. ARIA pattern: `role="img"` with `aria-label="9-axis skill radar; explore the table below for values"` and the table immediately after, hidden visually but available to AT.
- Class color is *never* the sole signal for state. Pair with text label and/or icon.
- All animations have aria-live appropriate regions; the reveal sequence announces "Your class is The Architect" on completion.

### 10.4 Reduced motion
See §8.1. Respect `prefers-reduced-motion`. The reveal becomes a 400ms fade.

### 10.5 Cognitive load
- One question per screen on the quiz.
- Plain-language labels everywhere.
- Validity disclaimer is in plain English, not jargon.
- Free-text questions show word guidance ("aim for 80–150 words"), not minimum requirements that block submission.

### 10.6 Internationalization (post-MVP)
- All copy lives in a single locale file, ready for translation.
- Layouts tolerate +30% text expansion (German, French) without breaking.
- Class names retain English in v1; lore translates. Future versions may localize class names with care.

---

## 11. Asset Checklist

Things to make/license/source before launch.

### 11.1 Type
- [ ] EB Garamond — Google Fonts (free)
- [ ] Inter — Google Fonts (free)
- [ ] JetBrains Mono — Google Fonts (free)
- [ ] All three loaded via `next/font` for self-hosting (no Google CDN call at runtime)

### 11.2 Icons
- [ ] Lucide React installed
- [ ] 9 custom metric glyphs as SVG components
- [ ] 10 custom class crests as SVG components

### 11.3 Brand
- [ ] Logo wordmark (SVG, with and without mark)
- [ ] Favicon (16, 32, 192, 512)
- [ ] OG image template (Next.js component)
- [ ] Social preview cards for each archetype (10 static fallbacks)

### 11.4 Copy
- [ ] All 10 archetype lore_short and lore_long
- [ ] All 10 archetype shadow descriptions
- [ ] All 9 metric one-liners (UI) + long-form definitions (methodology page)
- [ ] Quiz question bank (target: 33 standard, 12 quick, 50 deep)
- [ ] Improvement library entries (5+ per metric, mixed effort levels)

### 11.5 Legal
- [ ] LICENSE file (MIT)
- [ ] Question bank LICENSE (CC-BY-SA 4.0)
- [ ] Privacy policy
- [ ] Terms of use
- [ ] Disclosure for Gemini data usage (per-question and global)

---

## 12. Design Tokens — Reference Implementation

### 12.1 CSS variables

```css
:root {
  /* Inks */
  --ink-base:      #0B0F1A;
  --ink-elevated:  #131826;
  --ink-overlay:   #0F1422;
  --ink-card:      #1A2032;
  --ink-muted:     #1F2638;

  /* Parchment */
  --parchment-100: #E8DCC4;
  --parchment-200: #D5C8AC;
  --parchment-400: #B5AB97;
  --parchment-600: #7A7464;
  --parchment-800: #4A4538;

  /* Gold */
  --gold-bright:   #E8C885;
  --gold:          #C9A86A;
  --gold-deep:     #8B7042;

  /* Teal */
  --teal-bright:   #7DD8D5;
  --teal:          #5EC4C0;
  --teal-deep:     #3A8985;

  /* Semantic */
  --success:       #6FCF97;
  --warning:       #E8B86A;
  --danger:        #D86A6A;
  --info:          #5E96C4;

  /* Class */
  --class-architect:  #7BA8D9;
  --class-artisan:    #D9A87B;
  --class-sage:       #95B58E;
  --class-pathfinder: #E8B547;
  --class-sentinel:   #6B8CAE;
  --class-diplomat:   #B58EAE;
  --class-hacker:     #6FCF97;
  --class-oracle:     #8E7BB5;
  --class-berserker:  #D86A6A;
  --class-druid:      #7BA88E;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.5);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / 0.6);
  --glow-gold: 0 0 24px rgb(201 168 106 / 0.3);

  /* Typography */
  --font-display: "EB Garamond", Georgia, serif;
  --font-body:    "Inter", -apple-system, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  /* Motion */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --duration-micro:  150ms;
  --duration-default: 250ms;
  --duration-deliberate: 400ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.2 Tailwind config sketch

```js
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          base: "var(--ink-base)",
          elevated: "var(--ink-elevated)",
          overlay: "var(--ink-overlay)",
          card: "var(--ink-card)",
          muted: "var(--ink-muted)",
        },
        parchment: {
          100: "var(--parchment-100)",
          200: "var(--parchment-200)",
          400: "var(--parchment-400)",
          600: "var(--parchment-600)",
          800: "var(--parchment-800)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          bright: "var(--gold-bright)",
          deep: "var(--gold-deep)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          bright: "var(--teal-bright)",
          deep: "var(--teal-deep)",
        },
        class: {
          architect: "var(--class-architect)",
          artisan: "var(--class-artisan)",
          // ...
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out)",
        "in-quart": "var(--ease-in)",
      },
    },
  },
} satisfies Config;
```

---

## 13. Open design questions

To be resolved before locking V1:

1. **Do we ship a light theme?** Recommendation: **No, not for v1.** The character-sheet-on-ink aesthetic is core. A light theme is a v2 conversation.
2. **Should the radar chart show the user's polygon alone, or always overlay the archetype's target?** Recommendation: **Toggle, default to user-only.** The overlay can feel prescriptive; let users opt in.
3. **Should class crests be hand-illustrated or geometric SVG?** Recommendation: **Geometric, as specified.** Hand-illustrated invites scope creep and stylistic drift across contributors.
4. **How prominent is the Manware quote on the landing page?** Recommendation: **Below the fold, attributed, italic, with a visible link to the video.** Honors the source without making the project look derivative.
5. **Sound design?** Recommendation: **Defer to post-MVP, off by default.**

---

*"Take one aspect you're the worst at and start lifting that dumbbell."*
— Manware

This document, like the spec, is living. PRs welcome.
