"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RuneProgress } from "@/components/RuneProgress";
import type { Question, AnswerRecord } from "@/lib/types";
import { METRICS } from "@/lib/metrics";

const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

export default function QuizPage() {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/quiz/start", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setAttemptId(data.attemptId);
        setQuestions(data.questions);
      })
      .catch((e) => console.error("quiz/start failed", e));
  }, []);

  if (!questions.length) {
    return (
      <main className="min-h-screen flex items-center justify-center text-parchment-600 font-mono text-sm">
        Preparing your trial&hellip;
      </main>
    );
  }

  const q = questions[step];
  const isLast = step === questions.length - 1;

  async function record(value: number, optionIndex?: number) {
    const ans: AnswerRecord = { questionId: q.id, value, optionIndex };
    const next = [...answers.filter((a) => a.questionId !== q.id), ans];
    setAnswers(next);

    // fire-and-forget persistence
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
      if (typeof window !== "undefined") {
        sessionStorage.setItem("devclass:result", JSON.stringify(data));
      }
      router.push("/reveal");
    } else {
      setStep((s) => s + 1);
    }
  }

  const meta = METRICS[q.metric];

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto flex flex-col">
      <header className="mb-12">
        <RuneProgress step={step} total={questions.length} />
        <div
          className="text-center text-[11px] font-mono tracking-[0.3em] uppercase mt-4"
          style={{ color: meta.color }}
        >
          {meta.name}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-1 flex flex-col"
        >
          <h2 className="font-display text-3xl md:text-4xl text-parchment-100 leading-snug mb-10 text-center">
            {q.prompt}
          </h2>

          {q.context && (
            <p className="text-sm text-parchment-600 italic text-center -mt-6 mb-8 max-w-reading mx-auto">
              {q.context}
            </p>
          )}

          {q.kind === "likert" ? (
            <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
              {LIKERT_LABELS.map((label, i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    onClick={() => record(value)}
                    disabled={submitting}
                    className="text-left px-5 py-4 border border-parchment-800/50 hover:border-gold hover:bg-gold/5 transition-all font-body text-parchment-100 disabled:opacity-50"
                  >
                    <span className="text-gold font-mono text-xs mr-3">{value}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
              {q.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => record(opt.value, i)}
                  disabled={submitting}
                  className="text-left px-5 py-4 border border-parchment-800/50 hover:border-gold hover:bg-gold/5 transition-all font-body text-parchment-100 disabled:opacity-50"
                >
                  <span className="text-gold font-mono text-xs mr-3">{String.fromCharCode(65 + i)}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submitting && (
        <p className="text-center text-parchment-600 font-mono text-xs mt-8 animate-pulse">
          Casting the assignment&hellip;
        </p>
      )}
    </main>
  );
}
