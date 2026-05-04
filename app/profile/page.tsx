"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClassCrest } from "@/components/ClassCrest";
import { MetricRadar } from "@/components/MetricRadar";
import { MetricGlyph } from "@/components/MetricGlyph";
import type { ScoreVector, MetricCode } from "@/lib/types";
import { METRICS } from "@/lib/metrics";

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
  multiclass: { id: string; name: string; cosine: number }[];
  ranked: { id: string; name: string; cosine: number }[];
  strongest: { code: string; name: string; score: number }[];
  weakest: { code: string; name: string; score: number }[];
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
  const [planLoading, setPlanLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem("devclass:result");
    if (!raw) {
      router.replace("/");
      return;
    }
    setResult(JSON.parse(raw));
  }, [router]);

  async function generatePlan() {
    if (!result) return;
    setPlanLoading(true);
    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryClass: result.primary.name,
          vector: result.vector,
          weakest: result.weakest,
          strongest: result.strongest,
        }),
      });
      const data = await res.json();
      setPlan(data);
    } finally {
      setPlanLoading(false);
    }
  }

  if (!result) return <main className="min-h-screen" />;
  const c = result.primary.color;

  return (
    <main className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="text-xs font-mono text-parchment-600 hover:text-gold tracking-widest">
          &larr; DEVCLASS
        </Link>
        <div className="text-xs font-mono text-parchment-600">
          attempt {result.attemptId.slice(0, 8)}
        </div>
      </header>

      {/* CLASS HEADER */}
      <section className="grid md:grid-cols-[200px_1fr] gap-8 items-center mb-16">
        <div className="flex justify-center">
          <ClassCrest id={result.primary.id} color={c} size={170} />
        </div>
        <div>
          <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-2">
            Character Sheet
          </div>
          <h1 className="font-display text-5xl md:text-6xl" style={{ color: c }}>
            The {result.primary.name}
          </h1>
          <div className="text-parchment-400 italic mt-1 font-display text-lg">
            &laquo;{result.primary.alias}&raquo; &middot;{" "}
            <span className="text-parchment-600 not-italic font-mono text-xs tracking-wider">
              {result.primary.voice}
            </span>
          </div>
          <p className="mt-4 text-parchment-200 leading-relaxed max-w-2xl">{result.primary.blurb}</p>
          <p className="mt-3 text-sm italic text-parchment-600">
            <span className="text-danger">Shadow:</span> {result.primary.shadow}
          </p>
        </div>
      </section>

      {/* RADAR + DUMBBELL */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="flex justify-center">
          <MetricRadar vector={result.vector} color={c} size={400} />
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
              Strongest pillars
            </div>
            <div className="space-y-2">
              {result.strongest.map((s) => {
                const meta = METRICS[s.code as MetricCode];
                return (
                  <PillarRow key={s.code} code={s.code} name={s.name} score={s.score} color={meta.color} />
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
                  <PillarRow key={s.code} code={s.code} name={s.name} score={s.score} color={meta.color} muted />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE ROLES + RANKED */}
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
            Roles you'd be at home in
          </div>
          <ul className="space-y-2 text-parchment-200">
            {result.primary.signatureRoles.map((r) => (
              <li key={r} className="font-display text-xl" style={{ color: c }}>
                &mdash; {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-3">
            Class affinity (top 5)
          </div>
          <div className="space-y-1">
            {result.ranked.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className={i === 0 ? "text-gold font-display text-base" : "text-parchment-400 font-body"}>
                  {i + 1}. {r.name}
                </span>
                <span className="font-mono text-xs text-parchment-600">{(r.cosine * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN */}
      <section className="mb-16">
        <div className="text-xs font-mono text-parchment-600 tracking-[0.3em] uppercase mb-4">
          Four-week development plan
        </div>
        {!plan && (
          <button
            onClick={generatePlan}
            disabled={planLoading}
            className="px-6 py-3 border border-gold text-gold-bright hover:bg-gold/10 transition-all font-display tracking-wide disabled:opacity-50"
          >
            {planLoading ? "Drafting your plan…" : "Generate my plan →"}
          </button>
        )}
        {plan && (
          <div className="border border-parchment-800/40 p-8 bg-ink-elevated/30">
            <p className="text-parchment-100 leading-relaxed mb-6">{plan.voice}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl text-gold-bright mb-3">Weekly habits</h3>
                <ul className="space-y-2 text-sm text-parchment-200">
                  {plan.weeklyHabits.map((h, i) => (
                    <li key={i}>&mdash; {h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl text-teal-bright mb-3">Monthly experiments</h3>
                <ul className="space-y-2 text-sm text-parchment-200">
                  {plan.monthlyExperiments.map((h, i) => (
                    <li key={i}>&mdash; {h}</li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-display text-xl text-parchment-100 mb-3">Recommended reading</h3>
                <ul className="space-y-2 text-sm">
                  {plan.readingList.map((b, i) => (
                    <li key={i} className="text-parchment-200">
                      <span className="text-gold">{b.title}</span> &mdash;{" "}
                      <span className="text-parchment-600 italic">{b.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.warnings.length > 0 && (
                <div className="md:col-span-2 mt-2 pt-4 border-t border-parchment-800/40">
                  <h3 className="font-display text-sm text-danger mb-2 uppercase tracking-wider">Warnings</h3>
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
        Read the <Link href="/methodology" className="text-gold hover:underline">methodology</Link> &middot;{" "}
        <Link href="/quiz" className="text-gold hover:underline">retake the trial</Link>
      </footer>
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
          <span className={muted ? "text-parchment-400" : "text-parchment-100"}>{name}</span>
          <span className="font-mono text-xs text-parchment-600">{score}</span>
        </div>
        <div className="h-1 bg-parchment-800/40 mt-1 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${score}%`, background: color, opacity: muted ? 0.5 : 1 }}
          />
        </div>
      </div>
    </div>
  );
}
