"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClassCrest } from "@/components/ClassCrest";
import Link from "next/link";

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
    const raw = sessionStorage.getItem("devclass:result");
    if (!raw) {
      router.replace("/");
      return;
    }
    setResult(JSON.parse(raw));
  }, [router]);

  if (!result) return <main className="min-h-screen bg-black" />;

  const c = result.primary.color;
  const isMulticlass = result.multiclass.length > 1;

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* halo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c}88 0%, transparent 60%)`,
        }}
      />

      {/* rune ring */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.4, rotate: 360 }}
        transition={{ opacity: { duration: 1.5, delay: 0.4 }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
        className="absolute"
        style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          border: `1px solid ${c}`,
          boxShadow: `inset 0 0 60px ${c}33`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <ClassCrest id={result.primary.id} color={c} size={220} animated />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="relative z-10 mt-12 text-center"
      >
        <div className="text-xs font-mono tracking-[0.4em] text-parchment-600 uppercase mb-3">
          You are
        </div>
        <h1 className="font-display text-7xl md:text-8xl tracking-tight" style={{ color: c }}>
          The {result.primary.name}
        </h1>
        <div className="mt-4 text-lg italic text-parchment-200 font-display">
          &laquo;{result.primary.alias}&raquo;
        </div>
        <p className="mt-6 max-w-xl mx-auto text-parchment-200 leading-relaxed">
          {result.primary.tagline}
        </p>
        <p className="mt-2 text-sm text-parchment-600 font-mono italic">
          &mdash; {result.primary.motto}
        </p>

        {isMulticlass && (
          <p className="mt-4 text-xs text-parchment-600">
            with secondary affinity for{" "}
            {result.multiclass
              .slice(1)
              .map((m) => m.name)
              .join(" & ")}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.6 }}
        className="relative z-10 mt-12"
      >
        <Link
          href="/profile"
          className="px-8 py-4 border font-display text-lg tracking-wide transition-all hover:bg-white/5"
          style={{ borderColor: c, color: c, boxShadow: `0 0 20px ${c}44` }}
        >
          See your character sheet &rarr;
        </Link>
      </motion.div>
    </main>
  );
}
