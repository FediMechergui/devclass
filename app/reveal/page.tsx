"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Layers, MessageSquare, Sparkles } from "lucide-react";
import { ClassCrest } from "@/components/ClassCrest";
import { getClassVisual } from "@/lib/visuals";

interface Result {
  attemptId: string;
  primary: {
    id: string;
    name: string;
    alias: string;
    color: string;
    tagline: string;
    motto: string;
  };
  multiclass: { id: string; name: string; cosine: number }[];
}

export default function RevealPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    async function loadReveal() {
      const raw = sessionStorage.getItem("devclass:result");
      if (raw) {
        setResult(JSON.parse(raw));
        return;
      }

      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/profile");
        return;
      }
      const data = await res.json();
      if (data.result) {
        sessionStorage.setItem("devclass:result", JSON.stringify(data.result));
        setResult(data.result);
      } else {
        router.replace("/profile");
      }
    }

    loadReveal().catch(() => router.replace("/profile"));
  }, [router]);

  if (!result) return <main className="min-h-screen bg-ink-base" />;

  const c = result.primary.color;
  const visual = getClassVisual(result.primary.id);
  const secondary = result.multiclass.slice(1);

  return (
    <main className="alive-surface relative min-h-screen overflow-hidden px-6 py-10">
      <div
        className="absolute inset-0 image-pan bg-cover bg-center opacity-54"
        style={{ backgroundImage: `url(${visual.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-base via-ink-base/82 to-ink-base/38" />
      <div className="absolute inset-0 energy-grid opacity-70" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[430px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.86, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-start"
        >
          <div className="crest-orbit class-glow p-10" style={{ color: c }}>
            <ClassCrest id={result.primary.id} color={c} size={260} animated />
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 border border-gold/35 bg-ink-base/55 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.28em] text-gold-bright">
            <Sparkles size={14} /> assignment complete
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.35em] text-parchment-500">
            You are
          </div>
          <h1
            className="mt-3 font-display text-6xl leading-none md:text-8xl"
            style={{ color: c }}
          >
            The {result.primary.name}
          </h1>
          <div className="mt-4 font-display text-2xl italic text-parchment-100">
            &laquo;{result.primary.alias}&raquo;
          </div>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-parchment-100">
            {result.primary.tagline}
          </p>

          <div
            className="mt-7 max-w-2xl border-l-2 pl-5"
            style={{ borderColor: c }}
          >
            <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-500">
              <MessageSquare size={14} /> class dialogue
            </div>
            <p className="font-display text-3xl italic text-parchment-100">
              &ldquo;{visual.dialogue}&rdquo;
            </p>
            <p className="mt-3 text-sm leading-relaxed text-parchment-400">
              {visual.scene}
            </p>
            <p className="mt-3 text-xs font-mono italic text-parchment-600">
              motto: {result.primary.motto}
            </p>
          </div>

          {secondary.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 border border-parchment-800/60 bg-ink-base/50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-parchment-500">
                <Layers size={14} /> secondary affinity
              </span>
              {secondary.map((m) => (
                <span
                  key={m.id}
                  className="border border-gold/35 bg-gold/[0.06] px-3 py-1 text-sm text-gold-bright"
                >
                  {m.name}
                </span>
              ))}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 1.15 }}
            className="mt-10"
          >
            <Link
              href="/profile"
              className="group inline-flex items-center gap-3 border px-7 py-4 font-display text-lg tracking-wide transition-all hover:-translate-y-0.5 hover:bg-white/5"
              style={{ borderColor: c, color: c, boxShadow: `0 0 28px ${c}44` }}
            >
              Open your character sheet
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
