import Link from "next/link";
import { ARCHETYPES } from "@/lib/archetypes";
import { METRICS } from "@/lib/metrics";
import { METRIC_CODES } from "@/lib/types";
import { ClassCrest } from "@/components/ClassCrest";
import { MetricGlyph } from "@/components/MetricGlyph";

export default function LandingPage() {
  return (
    <main className="min-h-screen parchment-grain">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.4em] text-parchment-600 font-mono uppercase">
          Devclass &middot; v0.1
        </div>

        <h1 className="font-display text-6xl md:text-8xl text-parchment-100 text-center leading-none">
          What kind of <span className="gold-shimmer italic">engineer</span>
          <br />
          are you, really?
        </h1>

        <div className="rune-divider my-10 w-2/3 max-w-md" />

        <p className="max-w-reading text-center text-parchment-200 text-lg leading-relaxed font-body">
          A 33-question self-assessment for software engineers. Nine pillars. Ten archetypes.
          One uncomfortable mirror.
          <br />
          <span className="text-parchment-600 text-sm">
            Takes about 8 minutes. Honest answers only — there's no leaderboard.
          </span>
        </p>

        <Link
          href="/quiz"
          className="mt-10 inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold-bright hover:bg-gold/10 transition-all hover:shadow-glow-gold font-display text-lg tracking-wide"
        >
          Begin the Trial &rarr;
        </Link>

        <Link
          href="/methodology"
          className="mt-4 text-xs text-parchment-600 hover:text-gold underline-offset-4 hover:underline"
        >
          Or read the methodology first
        </Link>
      </section>

      {/* TEN CLASSES */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl text-parchment-100 text-center mb-3">
          The Ten Classes
        </h2>
        <p className="text-center text-parchment-600 max-w-reading mx-auto mb-16">
          Not personality types. Not "soft" labels. Each archetype is a distinct vector through
          nine engineering virtues — most of which you already have, in some measure.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {ARCHETYPES.map((a) => (
            <div
              key={a.id}
              className="group flex flex-col items-center gap-4 p-4 border border-transparent hover:border-parchment-800 transition-all"
            >
              <ClassCrest id={a.id} color={a.color} size={90} />
              <div className="text-center">
                <div
                  className="font-display text-xl"
                  style={{ color: a.color }}
                >
                  {a.name}
                </div>
                <div className="text-xs text-parchment-600 font-mono mt-1">
                  &laquo;{a.alias}&raquo;
                </div>
                <div className="text-[11px] text-parchment-400 mt-2 leading-snug">
                  {a.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NINE PILLARS */}
      <section className="px-6 py-24 bg-ink-elevated/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-parchment-100 text-center mb-3">
            The Nine Pillars
          </h2>
          <p className="text-center text-parchment-600 max-w-reading mx-auto mb-16">
            Every question maps to one of these. Together they form the vector that defines your
            class — and, more importantly, the directions you can grow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METRIC_CODES.map((m) => {
              const meta = METRICS[m];
              return (
                <div
                  key={m}
                  className="border border-parchment-800/40 p-6 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MetricGlyph code={m} color={meta.color} size={32} />
                    <div>
                      <div className="font-display text-xl" style={{ color: meta.color }}>
                        {meta.name}
                      </div>
                      <div className="text-[11px] font-mono text-parchment-600 tracking-wider">
                        {m}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-parchment-200 leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="font-display text-4xl text-parchment-100 text-center mb-12">
          What you get at the end
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-display text-2xl text-gold-bright mb-2">A class</div>
            <p className="text-sm text-parchment-400">
              Your dominant archetype, plus any secondary classes if you straddle two.
            </p>
          </div>
          <div>
            <div className="font-display text-2xl text-teal-bright mb-2">A character sheet</div>
            <p className="text-sm text-parchment-400">
              Nine-axis radar, your three strongest pillars, and the three with most room to grow.
            </p>
          </div>
          <div>
            <div className="font-display text-2xl gold-shimmer mb-2">A four-week plan</div>
            <p className="text-sm text-parchment-400">
              AI-generated habits and reading, in the voice of your archetype, calibrated to your weakest pillars.
            </p>
          </div>
        </div>
      </section>

      {/* RESOURCES — REAL ATTRIBUTIONS */}
      <section className="px-6 py-24 bg-ink-elevated/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-parchment-100 mb-3">
            What this is built on
          </h2>
          <p className="text-parchment-600 mb-8 text-sm">
            Devclass is opinionated synthesis, not novel research. It stands on the shoulders
            of writers who have spent decades trying to name what makes engineers good. Some of
            the work that directly shaped this:
          </p>
          <ul className="space-y-4 text-sm text-parchment-200">
            <li>
              &ldquo;<em>Are You A Good Programmer?</em>&rdquo; &mdash; <span className="text-gold">Manware</span>, May 2026.
              The catalyst question that started this project.
            </li>
            <li>
              &ldquo;<em>A Philosophy of Software Design</em>&rdquo; &mdash; <span className="text-gold">John Ousterhout</span>.
              For the framing of complexity as the central problem of software, and modules as deep vs. shallow.
            </li>
            <li>
              &ldquo;<em>The Pragmatic Programmer</em>&rdquo; &mdash; <span className="text-gold">Hunt &amp; Thomas</span>.
              For the working definition of <em>care</em> in engineering practice.
            </li>
            <li>
              &ldquo;<em>Designing Data-Intensive Applications</em>&rdquo; &mdash; <span className="text-gold">Martin Kleppmann</span>.
              For showing what Domain Mastery looks like when fully expressed.
            </li>
            <li>
              &ldquo;<em>Programming as Theory Building</em>&rdquo; &mdash; <span className="text-gold">Peter Naur</span>, 1985.
              The reason Engineering Integrity exists as a separate pillar.
            </li>
            <li>
              &ldquo;<em>No Silver Bullet</em>&rdquo; &mdash; <span className="text-gold">Fred Brooks</span>, 1986.
              Still the calibration check on every claim of methodology.
            </li>
            <li>
              &ldquo;<em>Big Five</em>&rdquo; personality research (Costa &amp; McCrae) &mdash; for the
              statistical machinery (cosine similarity, vector space classification) we adapt for archetype assignment.
            </li>
          </ul>
          <p className="text-xs text-parchment-600 mt-8 italic">
            We deliberately do <em>not</em> claim psychometric validity. This is a self-reflection
            tool, not a personality test. <Link href="/methodology" className="text-gold underline">Read the full methodology &rarr;</Link>
          </p>
        </div>
      </section>

      <footer className="px-6 py-12 text-center text-xs text-parchment-600 font-mono">
        <div className="rune-divider mb-6 max-w-xs mx-auto" />
        Devclass &middot; built with care, in public &middot;{" "}
        <Link href="/methodology" className="hover:text-gold">methodology</Link> &middot;{" "}
        <a href="https://github.com/FediMechergui/devclass" className="hover:text-gold">source</a>
      </footer>
    </main>
  );
}
