"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { RuneProgress } from "@/components/RuneProgress";
import { MetricGlyph } from "@/components/MetricGlyph";
import type { AnswerRecord, Question } from "@/lib/types";
import { METRICS } from "@/lib/metrics";
import { METRIC_VISUALS } from "@/lib/visuals";

const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

const KIND_COPY: Record<Question["kind"], { label: string; detail: string }> = {
  likert: { label: "signal dial", detail: "trait calibration" },
  forced_choice: { label: "trade-off", detail: "pick the truer pull" },
  behavioral: { label: "field story", detail: "past-action anchor" },
};

export default function QuizPage() {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quiz/start", { method: "POST" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Unable to start quiz.");
        return data;
      })
      .then((data) => {
        setAttemptId(data.attemptId);
        setQuestions(data.questions);
      })
      .catch((e) => {
        console.error("quiz/start failed", e);
        setError(e instanceof Error ? e.message : "Unable to start quiz.");
      });
  }, []);

  if (!questions.length) {
    return (
      <main className="alive-surface flex min-h-screen items-center justify-center px-6 text-center">
        <div className="glass-panel max-w-sm p-8">
          {error ? (
            <AlertCircle className="mx-auto mb-4 text-danger" size={28} />
          ) : (
            <Sparkles className="mx-auto mb-4 text-gold-bright" size={28} />
          )}
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-parchment-500">
            {error ? "trial unavailable" : "Preparing your trial"}
          </p>
          {error ? (
            <p className="mt-4 text-sm leading-relaxed text-parchment-300">
              {error}
            </p>
          ) : (
            <div className="mt-5 h-1 overflow-hidden bg-parchment-800/50">
              <div className="h-full w-2/3 animate-pulse bg-gold" />
            </div>
          )}
        </div>
      </main>
    );
  }

  const q = questions[step];
  const isLast = step === questions.length - 1;
  const meta = METRICS[q.metric];
  const visual = METRIC_VISUALS[q.metric];
  const kind = KIND_COPY[q.kind];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  async function record(value: number, optionIndex?: number) {
    const ans: AnswerRecord = { questionId: q.id, value, optionIndex };
    const next = [...answers.filter((a) => a.questionId !== q.id), ans];
    setAnswers(next);

    if (attemptId) {
      fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, ...ans }),
      }).catch(() => {});
    }

    if (isLast) {
      setSubmitting(true);
      const res = await fetch("/api/quiz/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitting(false);
        setError(data.error ?? "Unable to finish quiz.");
        return;
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("devclass:result", JSON.stringify(data));
      }
      router.push("/reveal");
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <main className="alive-surface min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background: `linear-gradient(135deg, ${meta.color}1f, transparent 34%), linear-gradient(245deg, ${meta.color}14, transparent 52%)`,
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <header className="mb-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-parchment-600">
              question {step + 1} / {questions.length}
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-parchment-500">
              <span>{progress}% charged</span>
              <div className="h-1.5 w-24 overflow-hidden bg-parchment-800/50">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <RuneProgress step={step} total={questions.length} />
          {error ? (
            <div className="mt-5 border border-danger/40 bg-danger/[0.06] px-4 py-3 text-sm text-parchment-100">
              {error}
            </div>
          ) : null}
        </header>

        <AnimatePresence mode="wait">
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="grid flex-1 gap-6 lg:grid-cols-[330px_minmax(0,1fr)]"
          >
            <aside className="glass-panel flex flex-col justify-between p-6">
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <MetricGlyph code={q.metric} color={meta.color} size={54} />
                  <span
                    className="border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em]"
                    style={{
                      borderColor: `${meta.color}66`,
                      color: meta.color,
                    }}
                  >
                    {q.metric}
                  </span>
                </div>
                <h1
                  className="font-display text-4xl leading-tight"
                  style={{ color: meta.color }}
                >
                  {meta.name}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-parchment-300">
                  {meta.description}
                </p>
              </div>

              <div className="mt-8 border-t border-parchment-800/50 pt-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-600">
                  <Gauge size={14} /> {kind.label}
                </div>
                <p className="font-display text-2xl text-parchment-100">
                  {visual.charge}
                </p>
                <p className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-parchment-600">
                  {kind.detail}
                </p>
              </div>
            </aside>

            <div className="glass-panel flex flex-col justify-center p-5 md:p-8 lg:p-10">
              <div className="mx-auto w-full max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 border border-parchment-800/60 bg-ink-base/45 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-500">
                  <Hourglass size={14} /> answer honestly, not ideally
                </div>
                <h2 className="font-display text-3xl leading-snug text-parchment-100 md:text-5xl">
                  {q.prompt}
                </h2>

                {q.context && (
                  <p className="mt-5 max-w-reading text-sm italic leading-relaxed text-parchment-500">
                    {q.context}
                  </p>
                )}

                {q.kind === "likert" ? (
                  <div className="mt-10 grid gap-3">
                    {LIKERT_LABELS.map((label, i) => {
                      const value = i + 1;
                      return (
                        <ChoiceButton
                          key={value}
                          label={label}
                          prefix={String(value)}
                          color={meta.color}
                          disabled={submitting}
                          onClick={() => record(value)}
                          intensity={(value / 5) * 100}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-10 grid gap-3">
                    {q.options?.map((opt, i) => (
                      <ChoiceButton
                        key={i}
                        label={opt.label}
                        prefix={String.fromCharCode(65 + i)}
                        color={meta.color}
                        disabled={submitting}
                        onClick={() => record(opt.value, i)}
                        intensity={28 + i * 16}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {submitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-base/88 px-6 backdrop-blur"
        >
          <div className="glass-panel max-w-sm p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 text-gold-bright" size={34} />
            <div className="font-display text-3xl text-parchment-100">
              Casting your class
            </div>
            <p className="mt-3 text-sm text-parchment-500">
              The vector is settling. The reveal is waking up.
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}

function ChoiceButton({
  label,
  prefix,
  color,
  disabled,
  onClick,
  intensity,
}: {
  label: string;
  prefix: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
  intensity: number;
}) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { x: 6, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      onClick={onClick}
      disabled={disabled}
      className="group relative min-h-[58px] overflow-hidden border border-parchment-800/55 bg-ink-base/55 px-4 py-4 text-left text-parchment-100 transition-colors hover:border-gold disabled:opacity-50 md:px-5"
    >
      <div
        className="absolute inset-y-0 left-0 opacity-12 transition-opacity group-hover:opacity-22"
        style={{ width: `${Math.max(18, intensity)}%`, background: color }}
      />
      <div className="relative z-10 flex items-center gap-4">
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-xs"
          style={{ borderColor: `${color}77`, color }}
        >
          {prefix}
        </span>
        <span className="flex-1 text-sm leading-relaxed md:text-base">
          {label}
        </span>
        <ArrowRight
          size={17}
          className="shrink-0 text-parchment-700 transition-transform group-hover:translate-x-1"
        />
      </div>
    </motion.button>
  );
}
