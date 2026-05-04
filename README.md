# Devclass

> What kind of engineer are you, really?

A 33-question self-assessment that maps software engineers across 9 pillars to one of 10 archetypes, then generates a personalized 4-week development plan in the voice of that archetype.

Built with Next.js 15, MongoDB Atlas, NextAuth (Auth.js v5), Tailwind, Framer Motion, and Google Gemini.

## Stack

- **Next.js 15** App Router · React 19 RC · TypeScript strict
- **MongoDB Atlas** for attempts, answers, users (via `@auth/mongodb-adapter`)
- **NextAuth v5** with GitHub OAuth (added post-deploy)
- **Google Gemini 2.5 Flash** for plan generation
- **Tailwind 3.4** with custom monastery-codex design system
- **Framer Motion** for the reveal sequence and crest animations
- **Recharts** for the 9-axis radar

## Local development

```powershell
# 1. install
npm install

# 2. .env should already exist with MONGODB_URI and GEMINI_API_KEY
#    (copy .env.example if not)

# 3. run
npm run dev
```

Visit http://localhost:3000.

The quiz works fully in **guest mode** — no auth required. GitHub OAuth is only wired up if `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` are present in env.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | Atlas connection string |
| `MONGODB_DB` | optional | Database name (default: `devclass`) |
| `GEMINI_API_KEY` | yes (for plans) | Falls back to a hand-written plan if absent |
| `AUTH_SECRET` | yes (in prod) | NextAuth JWT secret. Generate: `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | optional | Enables GitHub sign-in if set |
| `AUTH_GITHUB_SECRET` | optional | Required with `AUTH_GITHUB_ID` |
| `NEXTAUTH_URL` | optional | Auto-set on Vercel |

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import into Vercel (framework: Next.js, no overrides needed).
3. Add env vars in **Settings → Environment Variables**:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `AUTH_SECRET` (generate fresh, do not reuse local)
4. Deploy.

### Adding GitHub OAuth (after first deploy)

1. https://github.com/settings/developers → **New OAuth App**
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
   - Scopes requested by the app: `read:user user:email public_repo`
2. Copy the Client ID and generate a Client Secret.
3. In Vercel: add `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`, redeploy.

The auth provider self-registers only when both vars are present, so the build is safe before this step.

## Project shape

```
app/
  page.tsx               landing
  quiz/page.tsx          one-question-at-a-time trial
  reveal/page.tsx        5-second class reveal sequence
  profile/page.tsx       character sheet + radar + plan
  methodology/page.tsx   citations and honest framing
  api/
    auth/[...nextauth]/  NextAuth handlers
    quiz/start           creates attempt, returns questions
    quiz/answer          $push answer
    quiz/finish          score → assign class → persist
    plan/generate        Gemini-powered 4-week plan
lib/
  types.ts               MetricCode, Archetype, Question, …
  metrics.ts             the 9 pillars
  archetypes.ts          the 10 reference vectors
  questions.ts           33 items (likert + behavioral)
  scoring.ts             raw → normalized → cosine assignment
  mongodb.ts             cached client for HMR
  gemini.ts              plan generation + safe fallback
components/
  ClassCrest.tsx         10 distinct animated SVG crests
  MetricGlyph.tsx        9 distinct metric icons
  MetricRadar.tsx        recharts radar
  RuneProgress.tsx       diamond-rune step indicator
auth.ts                  NextAuth config (conditional GitHub)
```

## What this is, and isn't

- **It is**: an opinionated self-reflection tool for engineers who like the framing of class-based RPGs.
- **It is not**: psychometrically validated. There is no test-retest study, no behavioral correlation, no factor analysis. The pillars overlap on purpose. Read [`app/methodology/page.tsx`](app/methodology/page.tsx) for the honest disclaimer.

## Credits

- "Are You A Good Programmer?" — Manware (May 2026) · the catalyst question
- *A Philosophy of Software Design* — John Ousterhout
- *The Pragmatic Programmer* — Hunt & Thomas
- *Designing Data-Intensive Applications* — Martin Kleppmann
- "Programming as Theory Building" — Peter Naur (1985)
- "No Silver Bullet" — Fred Brooks (1986)

## License

MIT.
