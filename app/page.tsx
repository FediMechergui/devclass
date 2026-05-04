import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Github,
  Radio,
  Target,
  Zap,
} from "lucide-react";
import { ARCHETYPES } from "@/lib/archetypes";
import { METRICS } from "@/lib/metrics";
import { METRIC_CODES } from "@/lib/types";
import { METRIC_VISUALS } from "@/lib/visuals";
import { MetricGlyph } from "@/components/MetricGlyph";
import { AuthBar } from "@/components/AuthBar";
import { ClassGallery } from "@/components/ClassGallery";

const HERO_IMAGE = "/banner.PNG";

export default function LandingPage() {
  return (
    <main className="min-h-screen alive-surface parchment-grain">
      <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 py-24">
        <AuthBar redirectTo="/" />
        <div
          className="absolute inset-0 image-pan bg-cover bg-center opacity-56"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-base via-ink-base/82 to-ink-base/32" />
        <div className="absolute inset-0 energy-grid opacity-80" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-gold/30 bg-ink-base/55 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.32em] text-gold-bright">
              Devclass v0.1
            </div>
            <h1 className="font-display text-7xl leading-none text-parchment-100 md:text-9xl">
              Devclass
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-parchment-100 md:text-2xl">
              A living character sheet for the way you think, build, argue,
              focus, recover, and grow as an engineer.
            </p>
            <p className="mt-4 max-w-reading text-sm leading-relaxed text-parchment-400">
              63 research-grounded questions. Nine pillars. Ten classes. No
              leaderboard, no fake certainty, just a sharper mirror with a daily
              practice loop after the reveal.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quiz"
                className="group inline-flex items-center justify-center gap-3 border border-gold bg-gold/10 px-6 py-4 font-display text-lg tracking-wide text-gold-bright transition-all hover:-translate-y-0.5 hover:bg-gold/18 hover:shadow-glow-gold"
              >
                Begin the Trial
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center gap-3 border border-parchment-800/70 bg-ink-base/55 px-6 py-4 font-mono text-xs uppercase tracking-[0.22em] text-parchment-200 transition-all hover:border-teal hover:text-teal-bright"
              >
                <BookOpen size={16} /> Methodology
              </Link>
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-parchment-500">
                Live readout
              </div>
              <Radio size={16} className="text-teal-bright" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HeroStat
                label="questions"
                value="63"
                color="var(--gold-bright)"
              />
              <HeroStat label="pillars" value="9" color="var(--teal-bright)" />
              <HeroStat label="classes" value="10" color="var(--coral)" />
              <HeroStat label="daily reps" value="36" color="var(--lime)" />
            </div>
            <div className="mt-5 space-y-3">
              {ARCHETYPES.slice(0, 4).map((a, i) => (
                <div
                  key={a.id}
                  className="line-rise flex items-center gap-3"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rotate-45"
                    style={{ background: a.color }}
                  />
                  <span
                    className="font-display text-lg"
                    style={{ color: a.color }}
                  >
                    {a.name}
                  </span>
                  <span className="truncate text-xs text-parchment-500">
                    {a.tagline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 border-y border-parchment-800/40 bg-ink-base/70 px-6 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-500 md:justify-between">
            <span>sigmoid scoring</span>
            <span>reverse-keyed checks</span>
            <span>cosine class matching</span>
            <span>GitHub signal optional</span>
          </div>
        </div>
      </section>

      <ClassGallery />

      <section className="px-6 py-24 bg-ink-elevated/45">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 border border-teal/30 bg-teal/[0.06] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.28em] text-teal-bright">
                <Brain size={14} /> nine-pillar engine
              </div>
              <h2 className="font-display text-4xl text-parchment-100 md:text-5xl">
                Your class is not a label. It is a vector.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-parchment-400 md:text-lg">
              Each answer moves one or more pillars. The result is less like a
              horoscope and more like a pressure map of how you behave under
              ambiguity, constraint, evidence, fatigue, and other people.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {METRIC_CODES.map((m, i) => {
              const meta = METRICS[m];
              const visual = METRIC_VISUALS[m];
              return (
                <div
                  key={m}
                  className="signal-card border border-parchment-800/40 bg-ink-base/55 p-5 transition-all hover:-translate-y-1 hover:border-gold/50"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <MetricGlyph code={m} color={meta.color} size={34} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-parchment-600">
                      {m}
                    </span>
                  </div>
                  <h3
                    className="font-display text-2xl"
                    style={{ color: meta.color }}
                  >
                    {meta.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-300">
                    {meta.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-parchment-800/40 pt-3 text-xs font-mono uppercase tracking-[0.16em]">
                    <span className="text-parchment-600">{visual.verb}</span>
                    <span style={{ color: meta.color }}>{visual.charge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-display text-4xl text-parchment-100 md:text-5xl">
            What unlocks after the reveal
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Outcome icon={<Compass size={24} />} title="A class with a voice">
              A primary archetype, secondary affinities, confidence, and a class
              dialogue that names the posture without pretending it is destiny.
            </Outcome>
            <Outcome icon={<Target size={24} />} title="A useful pressure map">
              Radar, strongest pillars, weakest pillars, integrity notes, and
              optional GitHub boosts that stay capped so they never overwrite
              the quiz.
            </Outcome>
            <Outcome icon={<Zap size={24} />} title="A practice loop">
              Daily dumbbell challenges, a private build log, community shape,
              and a Gemini-generated four-week plan in your class voice.
            </Outcome>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-ink-elevated/45">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.26em] text-parchment-500">
            <Github size={16} /> built in public
          </div>
          <h2 className="font-display text-4xl text-parchment-100">
            Built on the study, tuned for reflection.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-parchment-300 md:text-base">
            Devclass is opinionated synthesis, not novel psychometrics. It draws
            from software design literature, Big Five-style vector thinking,
            response-bias checks, and the deep-research framework behind the 63
            question bank.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 border border-gold/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10"
            >
              Read the methodology <ArrowRight size={15} />
            </Link>
            <a
              href="https://github.com/FediMechergui/devclass"
              className="inline-flex items-center gap-2 border border-parchment-800/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-parchment-300 transition-colors hover:border-teal hover:text-teal-bright"
            >
              View source <Github size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center text-xs font-mono text-parchment-600">
        <div className="rune-divider mb-6 mx-auto max-w-xs" />
        Devclass · character sheets for developer minds ·{" "}
        <Link href="/quiz" className="hover:text-gold">
          begin
        </Link>
      </footer>
    </main>
  );
}

function HeroStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="border border-parchment-800/50 bg-ink-base/50 p-4">
      <div className="font-display text-4xl leading-none" style={{ color }}>
        {value}
      </div>
      <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em] text-parchment-600">
        {label}
      </div>
    </div>
  );
}

function Outcome({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="signal-card border border-parchment-800/45 bg-ink-card/60 p-6">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center border border-gold/45 text-gold-bright">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-parchment-100">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-parchment-400">
        {children}
      </p>
    </div>
  );
}
