import Link from "next/link";

export const metadata = { title: "Methodology · Devclass" };

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-xs font-mono text-parchment-600 hover:text-gold tracking-widest"
      >
        &larr; DEVCLASS
      </Link>

      <h1 className="font-display text-5xl text-parchment-100 mt-8 mb-4">
        Methodology
      </h1>
      <p className="text-parchment-600 italic">
        How Devclass turns a short self-assessment into one of ten archetypes
        &mdash; and what we are deliberately not claiming about it.
      </p>

      <div className="rune-divider my-10" />

      <article className="prose-devclass space-y-8 text-parchment-200 leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            The honest framing
          </h2>
          <p>
            Devclass is a <em>self-reflection instrument</em>, not a personality
            test. It has not been validated against external behavioral
            outcomes, has no test-retest reliability study, and its constructs
            were chosen for descriptive utility, not statistical independence.
            Treat it the way you'd treat a thoughtful coffee with a senior
            engineer: useful for noticing yourself, useless as a measurement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            The nine pillars
          </h2>
          <p>
            We chose nine because each one names a distinct mode of failure in
            real engineers we and our reviewers had worked with. They are
            intentionally non-orthogonal &mdash; Engineering Integrity
            correlates with Critical Skepticism in most people, and that's fine.
            The point is descriptive coverage, not factor purity:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <strong>ANL</strong> &mdash; Analytical Decomposition: breaking
              problems before solving them.
            </li>
            <li>
              <strong>CRT</strong> &mdash; Critical Skepticism: defaulting to
              "show me the failure mode".
            </li>
            <li>
              <strong>CRE</strong> &mdash; Creative Synthesis: combining
              unfamiliar ideas into new structure.
            </li>
            <li>
              <strong>DOM</strong> &mdash; Domain Mastery: knowing the layer
              below the one you work at.
            </li>
            <li>
              <strong>FOC</strong> &mdash; Focused Persistence: finishing the
              boring 80%.
            </li>
            <li>
              <strong>CUR</strong> &mdash; Cultivated Curiosity: learning beyond
              what's required.
            </li>
            <li>
              <strong>INT</strong> &mdash; Engineering Integrity: writing what
              you actually believe is right.
            </li>
            <li>
              <strong>REG</strong> &mdash; Self-Regulation: the loop between
              feeling and acting.
            </li>
            <li>
              <strong>COM</strong> &mdash; Communicative Clarity: making the
              invisible legible.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            The scoring
          </h2>
          <p>
            Each item carries a per-kind loading: <strong>Likert 1.0</strong>,{" "}
            <strong>forced-choice 1.5</strong>, <strong>behavioral 2.0</strong>.
            The thinking is simple — claiming you'd refactor a 4,000-line file
            is cheap; choosing to do it inside a forced-choice trade-off is less
            cheap; describing the time you actually did it is the strongest
            signal. Reverse-keyed Likert items invert their contribution to
            catch acquiescence bias.
          </p>
          <p>
            Raw per-pillar sums are passed through a logistic squash centred at
            50 (<code>1 / (1 + exp(-α·raw))</code>, α≈0.025). This soft-caps the
            tails: extreme answers stop being able to drag a single pillar to 0
            or 100 on their own, which matters because some pillars (DOM, COM)
            have many fewer items than others.
          </p>
          <p>
            Each archetype has a fixed reference vector in the same
            nine-dimensional space. Class assignment is by{" "}
            <strong>centred cosine similarity</strong> — both your vector and
            the reference vector are shifted by 50 before the dot product, so we
            are matching <em>shape of deviation from neutral</em>, not absolute
            height. Confidence is <code>1 − cos(top2)/cos(top1)</code>; ≥0.18 =
            definitive, ≥0.06 = leaning, otherwise we call you a hybrid and
            surface both.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            Response-pattern checks
          </h2>
          <p>
            Three lightweight integrity heuristics run on every attempt. None
            are gatekeepers — the result is always shown — but if any trip,
            you'll see a note on your sheet:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <strong>Centroid rate</strong>: how often you picked the middle
              option on Likert items. &gt; 60% suggests minimal engagement.
            </li>
            <li>
              <strong>Acquiescence rate</strong>: tendency to agree regardless
              of polarity. We cross-check forward and reverse-keyed items.
            </li>
            <li>
              <strong>Likert variance</strong>: too-low variance means
              flat-lining a single answer.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            GitHub signal (optional)
          </h2>
          <p>
            If you sign in with GitHub, we read <em>only</em> public profile
            data — repo count, language diversity, README presence on a sample
            of recent repos, and 90-day push activity. From those we compute
            small additive boosts (<strong>capped ±5 per pillar</strong>) that
            we apply <em>after</em> normalization but before classification.
            Mapping:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <strong>CUR</strong> ← language diversity beyond 3 languages
            </li>
            <li>
              <strong>CRE</strong> ← non-mainstream languages used (Rust,
              Elixir, Haskell, &hellip;)
            </li>
            <li>
              <strong>DOM</strong> ← log-scaled public repo count
            </li>
            <li>
              <strong>FOC</strong> ← active days in last 90 (penalty for
              fragmented churn)
            </li>
            <li>
              <strong>COM</strong> ← share of sampled repos with a README
            </li>
          </ul>
          <p>
            The cap exists for one reason: GitHub activity is a noisy proxy. It
            can refine the picture your answers paint; it cannot overwrite it.
            The whole experience also works entirely as a guest with no GitHub
            at all.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            After the result
          </h2>
          <p>
            Your sheet exposes one <strong>daily dumbbell</strong> — a concrete
            30-minute rep on your weakest pillar, deterministically rotated by
            date so you and another Architect see the same challenge today. The{" "}
            <strong>build log</strong> is private to your account and exists for
            one purpose: tracking the deliberate practice between re-takes. The
            community panel shows the anonymous shape of the room — no
            leaderboard, no ranking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            The plan generation
          </h2>
          <p>
            Your four-week plan is generated by Google's{" "}
            <code>gemini-2.5-flash</code> with your full vector, archetype name,
            and three weakest pillars as context. The model is asked for real,
            well-known references only and to write in the voice that suits your
            archetype. It will sometimes hallucinate book titles &mdash; if you
            don't recognize one, assume the model invented it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">
            What this is built on
          </h2>
          <p>The work that most directly shaped Devclass:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Manware</strong>, &ldquo;Are You A Good Programmer?&rdquo;
              (May 2026) &mdash; the catalyst question.
            </li>
            <li>
              <strong>John Ousterhout</strong>,{" "}
              <em>A Philosophy of Software Design</em> &mdash; the framing of
              complexity as the central problem.
            </li>
            <li>
              <strong>Hunt &amp; Thomas</strong>,{" "}
              <em>The Pragmatic Programmer</em> &mdash; the working definition
              of <em>care</em>.
            </li>
            <li>
              <strong>Martin Kleppmann</strong>,{" "}
              <em>Designing Data-Intensive Applications</em>
              &mdash; what mature Domain Mastery looks like.
            </li>
            <li>
              <strong>Peter Naur</strong>, &ldquo;Programming as Theory
              Building&rdquo; (1985) &mdash; why integrity and communication are
              inseparable.
            </li>
            <li>
              <strong>Fred Brooks</strong>, &ldquo;No Silver Bullet&rdquo;
              (1986) &mdash; the calibration check.
            </li>
            <li>
              <strong>Costa &amp; McCrae</strong> Big Five literature &mdash;
              for the vector-space classification machinery, adapted (not
              validated) here.
            </li>
            <li>
              <strong>Robert Nystrom</strong>, <em>Crafting Interpreters</em>{" "}
              &mdash; for the standard of what generous technical writing looks
              like.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-gold-bright">Privacy</h2>
          <p>
            We store your attempt vector + chosen archetype against your account
            so we can show you longitudinal progress on re-takes. The community
            distribution panel is the only place any of it leaves your sheet,
            and it is fully anonymous (counts only). Your build log is never
            shared. Sign out at any time; deletion on request.
          </p>
        </section>

        <p className="italic text-parchment-600 text-sm pt-8 border-t border-parchment-800/40">
          Built in the open by{" "}
          <a
            className="text-gold underline"
            href="https://github.com/FediMechergui/devclass"
          >
            FediMechergui/devclass
          </a>
          . Corrections welcome &mdash; especially on the pillars themselves.
        </p>
      </article>
    </main>
  );
}
