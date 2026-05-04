"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Github,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { ClassCrest } from "@/components/ClassCrest";
import { MetricRadar } from "@/components/MetricRadar";
import { MetricGlyph } from "@/components/MetricGlyph";
import { CommunityDistribution } from "@/components/CommunityDistribution";
import { DumbbellChallenge } from "@/components/DumbbellChallenge";
import { BuildLog } from "@/components/BuildLog";
import type {
  GitHubInsightReport,
  ScoreVector,
  MetricCode,
  GitHubSignals,
} from "@/lib/types";
import { METRICS } from "@/lib/metrics";
import { getClassVisual } from "@/lib/visuals";

interface Result {
  attemptId: string;
  vector: ScoreVector;
  primary: {
    id: string;
    name: string;
    alias: string;
    color: string;
    tagline: string;
    motto: string;
    blurb: string;
    shadow: string;
    voice: string;
    signatureRoles: string[];
  };
  confidence?: number;
  confidenceLabel?: "definitive" | "leaning" | "hybrid";
  integrity?: {
    suspect: boolean;
    note?: string;
    centroidRate: number;
    acquiescenceRate: number;
  };
  multiclass: { id: string; name: string; cosine: number }[];
  ranked: { id: string; name: string; cosine: number }[];
  strongest: { code: string; name: string; score: number }[];
  weakest: { code: string; name: string; score: number }[];
  githubSignals?: GitHubSignals | null;
  signalBoosts?: Partial<Record<MetricCode, number>> | null;
  githubInsights?: GitHubInsightReport | null;
}

interface Plan {
  voice: string;
  weeklyHabits: string[];
  monthlyExperiments: string[];
  readingList: { title: string; why: string }[];
  warnings: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [planRequestedFor, setPlanRequestedFor] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("devclass:result");
        if (raw) {
          try {
            setResult(JSON.parse(raw));
          } catch {
            sessionStorage.removeItem("devclass:result");
          }
        }
      }

      setProfileLoading(true);
      setProfileError(null);
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load profile.");
        if (cancelled) return;

        setPlan(data.plan ?? null);
        if (data.result) {
          setResult(data.result);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("devclass:result", JSON.stringify(data.result));
          }
        } else {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("devclass:result");
          }
          setResult(null);
        }
      } catch (e) {
        if (!cancelled) {
          setProfileError(
            e instanceof Error ? e.message : "Unable to load profile.",
          );
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function generatePlan(target: Result | null = result) {
    if (!target) return;
    setPlanRequestedFor(target.attemptId);
    setPlanLoading(true);
    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: target.attemptId,
          primaryClass: target.primary.name,
          vector: target.vector,
          weakest: target.weakest,
          strongest: target.strongest,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to generate plan.");
      setPlan(data);
      setProfileError(null);
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Unable to generate plan.");
    } finally {
      setPlanLoading(false);
    }
  }

  useEffect(() => {
    if (
      !result ||
      plan ||
      planLoading ||
      profileLoading ||
      planRequestedFor === result.attemptId
    ) {
      return;
    }
    generatePlan(result);
  }, [result, plan, planLoading, profileLoading, planRequestedFor]);

  function retake() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("devclass:result");
    }
    router.push("/quiz?retake=1");
  }

  async function deleteResult() {
    if (!result) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this saved Devclass result and retake the trial?")
    ) {
      return;
    }

    setDeleting(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: result.attemptId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to delete result.");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("devclass:result");
      }
      setResult(null);
      setPlan(null);
      router.replace("/quiz?retake=1&deleted=1");
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Unable to delete result.");
    } finally {
      setDeleting(false);
    }
  }

  if (profileLoading && !result) return <ProfileLoading />;
  if (!result) return <EmptyProfile error={profileError} />;
  const c = result.primary.color;
  const visual = getClassVisual(result.primary.id);
  const topLanguages = result.githubSignals?.topLanguages?.length
    ? result.githubSignals.topLanguages
    : (result.githubSignals?.languages ?? []).map((name) => ({
        name,
        count: 1,
        pct: 0,
      }));

  return (
    <main className="alive-surface min-h-screen px-6 py-12">
      <div
        className="pointer-events-none fixed inset-0 image-pan bg-cover bg-center opacity-18"
        style={{ backgroundImage: `url(${visual.image})` }}
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-ink-base/74 via-ink-base to-ink-base" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-mono text-parchment-600 hover:text-gold tracking-widest"
          >
            &larr; DEVCLASS
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="mr-2 text-xs font-mono text-parchment-600">
              attempt {result.attemptId.slice(0, 8)}
            </div>
            <button
              type="button"
              onClick={retake}
              className="inline-flex items-center gap-2 border border-teal/40 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-teal-bright transition-colors hover:bg-teal/10"
            >
              <RotateCcw size={14} /> retake
            </button>
            <button
              type="button"
              onClick={deleteResult}
              disabled={deleting}
              className="inline-flex items-center gap-2 border border-danger/40 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
            >
              <Trash2 size={14} /> {deleting ? "deleting" : "delete"}
            </button>
          </div>
        </header>

        {profileError ? (
          <section className="mb-8 border border-danger/40 bg-danger/[0.06] p-4 text-sm text-parchment-100">
            {profileError}
          </section>
        ) : null}

        {/* CLASS HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative mb-16 overflow-hidden border border-parchment-800/45 bg-ink-card"
          style={{ borderColor: `${c}55` }}
        >
          <div
            className="absolute inset-0 image-pan bg-cover bg-center opacity-36"
            style={{ backgroundImage: `url(${visual.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-base via-ink-base/88 to-ink-base/38" />
          <div className="absolute inset-0 energy-grid opacity-60" />
          <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[230px_1fr] md:p-9 lg:p-10">
            <div className="flex items-center justify-center">
              <div className="crest-orbit class-glow p-5" style={{ color: c }}>
                <ClassCrest id={result.primary.id} color={c} size={180} />
              </div>
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 border border-parchment-800/60 bg-ink-base/50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-parchment-500">
                <Sparkles size={14} /> character sheet
              </div>
              <h1
                className="font-display text-5xl md:text-7xl"
                style={{ color: c }}
              >
                The {result.primary.name}
              </h1>
              <div className="mt-1 font-display text-lg italic text-parchment-300">
                &laquo;{result.primary.alias}&raquo; &middot;{" "}
                <span className="font-mono text-xs not-italic tracking-wider text-parchment-600">
                  {result.primary.voice}
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-parchment-100 leading-relaxed">
                {result.primary.blurb}
              </p>
              <div
                className="mt-5 max-w-2xl border-l-2 pl-4"
                style={{ borderColor: c }}
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-parchment-500">
                  <MessageSquare size={14} /> class dialogue
                </div>
                <p className="font-display text-2xl italic text-parchment-100">
                  &ldquo;{visual.dialogue}&rdquo;
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {result.primary.signatureRoles.map((role) => (
                  <span
                    key={role}
                    className="border bg-ink-base/55 px-3 py-1 text-xs font-mono text-parchment-200"
                    style={{ borderColor: `${c}55` }}
                  >
                    {role}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm italic text-parchment-500">
                <span className="text-danger">Shadow:</span>{" "}
                {result.primary.shadow}
              </p>
              {result.confidenceLabel ? (
                <ConfidenceChip
                  label={result.confidenceLabel}
                  value={result.confidence ?? 0}
                  color={c}
                />
              ) : null}
            </div>
          </div>
        </motion.section>

        {result.integrity?.suspect ? (
          <section className="mb-10 border border-danger/40 bg-danger/[0.05] p-5">
            <div className="text-xs font-mono text-danger uppercase tracking-widest mb-2">
              Response-pattern note
            </div>
            <p className="text-sm text-parchment-100 leading-relaxed">
              {result.integrity.note}
            </p>
            <p className="text-[10px] text-parchment-600 mt-2 font-mono">
              centroid rate {result.integrity.centroidRate.toFixed(2)} ·
              acquiescence rate {result.integrity.acquiescenceRate.toFixed(2)}
            </p>
            <p className="text-[11px] text-parchment-400 mt-2 italic">
              Result still shown — but treat it as a draft. Re-take when you
              have 8 quiet minutes.
            </p>
          </section>
        ) : null}

        {/* RADAR + DUMBBELL */}
        <section className="grid md:grid-cols-2 gap-6 items-stretch mb-20">
          <div className="glass-panel flex items-center justify-center p-4">
            <MetricRadar vector={result.vector} color={c} size={400} />
          </div>
          <div className="glass-panel space-y-7 p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase">
                <Target size={15} className="text-gold-bright" />
                Strongest pillars
              </div>
              <div className="space-y-2">
                {result.strongest.map((s) => {
                  const meta = METRICS[s.code as MetricCode];
                  return (
                    <PillarRow
                      key={s.code}
                      code={s.code}
                      name={s.name}
                      score={s.score}
                      color={meta.color}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
                Most room to grow
              </div>
              <div className="space-y-2">
                {result.weakest.map((s) => {
                  const meta = METRICS[s.code as MetricCode];
                  return (
                    <PillarRow
                      key={s.code}
                      code={s.code}
                      name={s.name}
                      score={s.score}
                      color={meta.color}
                      muted
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE ROLES + RANKED */}
        <section className="grid md:grid-cols-2 gap-6 mb-20">
          <div className="glass-panel p-6">
            <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
              Roles you'd be at home in
            </div>
            <ul className="space-y-2 text-parchment-200">
              {result.primary.signatureRoles.map((r) => (
                <li
                  key={r}
                  className="font-display text-xl"
                  style={{ color: c }}
                >
                  &mdash; {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase">
              <BookOpen size={15} className="text-teal-bright" />
              Class affinity (top 5)
            </div>
            <div className="space-y-1">
              {result.ranked.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span
                    className={
                      i === 0
                        ? "text-gold font-display text-base"
                        : "text-parchment-400 font-body"
                    }
                  >
                    {i + 1}. {r.name}
                  </span>
                  <span className="font-mono text-xs text-parchment-600">
                    {(r.cosine * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DUMBBELL + COMMUNITY DISTRIBUTION */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="glass-panel p-6">
            <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
              Today's deliberate practice
            </div>
            {result.weakest[0] ? (
              <DumbbellChallenge metric={result.weakest[0].code} />
            ) : null}
          </div>
          <div className="glass-panel p-6">
            <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
              Where you sit in the room
            </div>
            <CommunityDistribution highlightId={result.primary.id} />
          </div>
        </section>

        {result.githubSignals ? (
          <section className="glass-panel mb-20 p-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-parchment-600">
              <Github size={15} className="text-gold-bright" /> GitHub signal · @
              {result.githubSignals.login}
            </div>
            <div className="grid gap-5 border border-parchment-800/40 bg-ink-base/35 p-5 text-sm md:grid-cols-3">
              <SignalStat
                label="Public repos"
                value={String(result.githubSignals.publicRepos)}
              />
              <SignalStat
                label="Languages"
                value={String(result.githubSignals.languages.length)}
              />
              <SignalStat
                label="Followers"
                value={String(result.githubSignals.followers)}
              />
              <SignalStat
                label="Active days · 90d"
                value={String(result.githubSignals.activeDays)}
              />
              <SignalStat
                label="Pushes · 90d"
                value={String(result.githubSignals.recentPushes)}
              />
              <SignalStat
                label="Repos / active day"
                value={result.githubSignals.meanReposPerActiveDay.toFixed(2)}
              />
            </div>
            {topLanguages.length > 0 ? (
              <div className="mt-5 border border-parchment-800/40 bg-ink-base/30 p-5">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-500">
                  <Code2 size={14} className="text-teal-bright" /> most used
                  public languages
                </div>
                <div className="space-y-3">
                  {topLanguages.map((language) => (
                    <div key={language.name}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-display text-parchment-100">
                          {language.name}
                        </span>
                        <span className="font-mono text-xs text-parchment-600">
                          {language.pct ? `${language.pct}%` : `${language.count} repo`}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden bg-parchment-800/45">
                        <div
                          className="meter-fill h-full bg-teal-bright"
                          style={{ width: `${Math.max(8, language.pct || 18)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {result.githubInsights ? (
              <div className="mt-5 border border-gold/30 bg-gold/[0.04] p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-gold-bright">
                  <WandSparkles size={14} /> AI read on quiz + GitHub
                </div>
                <h3 className="font-display text-2xl text-parchment-100">
                  {result.githubInsights.headline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-parchment-300">
                  {result.githubInsights.summary}
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {result.githubInsights.takes.map((take) => (
                    <div
                      key={take.title}
                      className="border border-parchment-800/45 bg-ink-base/35 p-4"
                    >
                      <div className="font-display text-lg text-gold-bright">
                        {take.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-parchment-300">
                        {take.detail}
                      </p>
                    </div>
                  ))}
                </div>
                {result.githubInsights.cautions.length > 0 ? (
                  <p className="mt-4 text-xs italic leading-relaxed text-parchment-600">
                    {result.githubInsights.cautions.join(" ")}
                  </p>
                ) : null}
              </div>
            ) : null}
            {result.signalBoosts ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(result.signalBoosts)
                  .filter(([, v]) => v !== 0 && v !== undefined)
                  .map(([code, v]) => (
                    <span
                      key={code}
                      className="text-[10px] font-mono px-2 py-0.5 border"
                      style={{
                        color: METRICS[code as MetricCode].color,
                        borderColor: `${METRICS[code as MetricCode].color}55`,
                      }}
                    >
                      {code} {(v as number) >= 0 ? "+" : ""}
                      {v}
                    </span>
                  ))}
                <span className="text-[10px] font-mono text-parchment-600 self-center">
                  signal boosts applied to your vector (capped ±5/pillar)
                </span>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="glass-panel mb-20 p-6">
          <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
            Build log
          </div>
          <BuildLog
            defaultMetric={(result.weakest[0]?.code as MetricCode) ?? undefined}
          />
        </section>

        {/* PLAN */}
        <section className="glass-panel mb-16 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-parchment-600">
              <WandSparkles size={15} className="text-gold-bright" /> Four-week
              development plan
            </div>
            {plan ? (
              <button
                type="button"
                onClick={() => generatePlan(result)}
                disabled={planLoading}
                className="border border-parchment-800/70 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-parchment-300 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
              >
                {planLoading ? "refreshing" : "refresh plan"}
              </button>
            ) : null}
          </div>
          {!plan && (
            <div className="signal-card border border-gold/30 bg-gold/[0.04] p-5">
              <div className="font-display text-2xl text-parchment-100">
                {planLoading ? "Drafting your plan" : "Plan is ready to draft"}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-parchment-400">
                The plan uses your quiz vector, weakest pillars, strongest
                pillars, and GitHub signal when available.
              </p>
              {!planLoading ? (
                <button
                  type="button"
                  onClick={() => generatePlan(result)}
                  className="mt-4 border border-gold px-5 py-2 font-display text-gold-bright transition-all hover:bg-gold/10"
                >
                  Generate my plan →
                </button>
              ) : null}
            </div>
          )}
          {plan && (
            <div className="border border-parchment-800/40 p-8 bg-ink-elevated/30">
              <p className="text-parchment-100 leading-relaxed mb-6">
                {plan.voice}
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl text-gold-bright mb-3">
                    Weekly habits
                  </h3>
                  <ul className="space-y-2 text-sm text-parchment-200">
                    {plan.weeklyHabits.map((h, i) => (
                      <li key={i}>&mdash; {h}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-xl text-teal-bright mb-3">
                    Monthly experiments
                  </h3>
                  <ul className="space-y-2 text-sm text-parchment-200">
                    {plan.monthlyExperiments.map((h, i) => (
                      <li key={i}>&mdash; {h}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-display text-xl text-parchment-100 mb-3">
                    Recommended reading
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {plan.readingList.map((b, i) => (
                      <li key={i} className="text-parchment-200">
                        <span className="text-gold">{b.title}</span> &mdash;{" "}
                        <span className="text-parchment-600 italic">
                          {b.why}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.warnings.length > 0 && (
                  <div className="md:col-span-2 mt-2 pt-4 border-t border-parchment-800/40">
                    <h3 className="font-display text-sm text-danger mb-2 uppercase tracking-wider">
                      Warnings
                    </h3>
                    <ul className="space-y-1 text-xs text-parchment-400 italic">
                      {plan.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <footer className="text-center text-xs font-mono text-parchment-600 py-12 border-t border-parchment-800/40">
          <div className="rune-divider mb-6 max-w-xs mx-auto" />
          Read the{" "}
          <Link href="/methodology" className="text-gold hover:underline">
            methodology
          </Link>{" "}
          &middot;{" "}
          <button type="button" onClick={retake} className="text-gold hover:underline">
            retake the trial
          </button>
        </footer>
      </div>
    </main>
  );
}

function ProfileLoading() {
  return (
    <main className="alive-surface flex min-h-screen items-center justify-center px-6 text-center">
      <div className="glass-panel max-w-sm p-8">
        <Sparkles className="mx-auto mb-4 text-gold-bright" size={28} />
        <p className="font-mono text-xs uppercase tracking-[0.26em] text-parchment-500">
          loading profile
        </p>
        <div className="mt-5 h-1 overflow-hidden bg-parchment-800/50">
          <div className="h-full w-2/3 animate-pulse bg-gold" />
        </div>
      </div>
    </main>
  );
}

function EmptyProfile({ error }: { error?: string | null }) {
  return (
    <main className="alive-surface flex min-h-screen items-center justify-center px-6 py-16">
      <div className="pointer-events-none fixed inset-0 energy-grid opacity-45" />
      <section className="glass-panel relative z-10 w-full max-w-2xl p-7 text-center md:p-10">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center border border-teal/45 text-teal-bright">
          <BookOpen size={26} />
        </div>
        <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-parchment-500">
          no saved sheet yet
        </div>
        <h1 className="font-display text-4xl leading-tight text-parchment-100 md:text-6xl">
          Take the trial to build your profile.
        </h1>
        <p className="mx-auto mt-4 max-w-reading text-sm leading-relaxed text-parchment-300 md:text-base">
          Once you finish, Devclass stores your result on your account, blends in
          public GitHub signals, drafts a plan, and keeps the profile visitable.
        </p>
        {error ? (
          <p className="mt-4 border border-danger/40 bg-danger/[0.06] p-3 text-sm text-parchment-100">
            {error}
          </p>
        ) : null}
        <Link
          href="/quiz"
          className="mt-8 inline-flex items-center gap-3 border border-gold bg-gold/10 px-6 py-4 font-display text-lg tracking-wide text-gold-bright transition-all hover:-translate-y-0.5 hover:bg-gold/18 hover:shadow-glow-gold"
        >
          Begin the trial →
        </Link>
      </section>
    </main>
  );
}

function PillarRow({
  code,
  name,
  score,
  color,
  muted = false,
}: {
  code: string;
  name: string;
  score: number;
  color: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <MetricGlyph code={code} color={color} size={24} />
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className={muted ? "text-parchment-400" : "text-parchment-100"}>
            {name}
          </span>
          <span className="font-mono text-xs text-parchment-600">{score}</span>
        </div>
        <div className="h-1 bg-parchment-800/40 mt-1 relative overflow-hidden">
          <div
            className="meter-fill absolute inset-y-0 left-0"
            style={{
              width: `${score}%`,
              background: color,
              opacity: muted ? 0.5 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ConfidenceChip({
  label,
  value,
  color,
}: {
  label: "definitive" | "leaning" | "hybrid";
  value: number;
  color: string;
}) {
  const copy: Record<typeof label, string> = {
    definitive: "definitive class match",
    leaning: "leaning toward this class",
    hybrid: "hybrid — sits between classes",
  };
  return (
    <div className="mt-4 inline-flex items-center gap-2">
      <span
        className="text-[11px] font-mono px-2 py-1 border tracking-widest uppercase"
        style={{ color, borderColor: `${color}77` }}
      >
        {copy[label]}
      </span>
      <span className="text-[10px] font-mono text-parchment-600">
        confidence {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

function SignalStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono text-parchment-600 uppercase tracking-widest">
        {label}
      </div>
      <div className="font-display text-2xl text-parchment-100">{value}</div>
    </div>
  );
}
