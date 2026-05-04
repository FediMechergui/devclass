"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { ARCHETYPES } from "@/lib/archetypes";
import { CLASS_VISUALS } from "@/lib/visuals";
import type { ArchetypeId } from "@/lib/types";
import { ClassCrest } from "@/components/ClassCrest";

export function ClassGallery() {
  const [selectedId, setSelectedId] = useState<ArchetypeId>(ARCHETYPES[0].id);
  const selected = useMemo(
    () => ARCHETYPES.find((a) => a.id === selectedId) ?? ARCHETYPES[0],
    [selectedId],
  );
  const visual = CLASS_VISUALS[selected.id];

  return (
    <section className="px-6 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 border border-gold/30 bg-gold/[0.06] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.28em] text-gold-bright">
              <Sparkles size={14} /> class gallery
            </div>
            <h2 className="font-display text-4xl text-parchment-100 md:text-5xl">
              Pick a class. Let it talk back.
            </h2>
          </div>
          <p className="max-w-reading text-sm leading-relaxed text-parchment-400 md:text-right">
            Every archetype is a readable engineering posture: a strength pattern,
            a shadow, and a way of moving through hard technical work.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div
            className="relative min-h-[560px] overflow-hidden border border-parchment-800/50 bg-ink-card shadow-lg"
            style={{ borderColor: `${selected.color}55` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 image-pan bg-cover bg-center"
                style={{ backgroundImage: `url(${visual.image})` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-ink-base via-ink-base/78 to-ink-base/18" />
            <div className="absolute inset-0 energy-grid opacity-70" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-6 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <motion.div
                  key={`${selected.id}-crest`}
                  initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="class-glow"
                  style={{ color: selected.color }}
                >
                  <ClassCrest id={selected.id} color={selected.color} size={132} />
                </motion.div>
                <div className="text-right font-mono text-[11px] uppercase tracking-[0.26em] text-parchment-500">
                  {visual.pulse}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.id}-copy`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="max-w-2xl"
                >
                  <div className="mb-3 text-xs font-mono uppercase tracking-[0.32em] text-parchment-500">
                    {selected.alias}
                  </div>
                  <h3
                    className="font-display text-5xl leading-none md:text-7xl"
                    style={{ color: selected.color }}
                  >
                    The {selected.name}
                  </h3>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-parchment-100">
                    {selected.blurb}
                  </p>

                  <div
                    className="mt-6 max-w-xl border-l-2 pl-4"
                    style={{ borderColor: selected.color }}
                  >
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-parchment-500">
                      <MessageSquare size={14} /> class dialogue
                    </div>
                    <p className="font-display text-2xl italic text-parchment-100">
                      &ldquo;{visual.dialogue}&rdquo;
                    </p>
                    <p className="mt-2 text-sm text-parchment-400">{visual.scene}</p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {selected.signatureRoles.map((role) => (
                      <span
                        key={role}
                        className="border bg-ink-base/50 px-3 py-1 text-xs font-mono text-parchment-200"
                        style={{ borderColor: `${selected.color}55` }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {ARCHETYPES.map((archetype) => {
              const active = archetype.id === selected.id;
              return (
                <button
                  key={archetype.id}
                  type="button"
                  onClick={() => setSelectedId(archetype.id)}
                  className="group relative min-h-[82px] overflow-hidden border border-parchment-800/50 bg-ink-elevated/70 p-3 text-left transition-all hover:-translate-y-0.5 hover:bg-ink-card focus-visible:outline-gold"
                  style={{ borderColor: active ? archetype.color : undefined }}
                >
                  <div
                    className="absolute inset-y-0 left-0 w-1 opacity-80 transition-all group-hover:w-2"
                    style={{ background: archetype.color }}
                  />
                  <div className="flex items-center justify-between gap-3 pl-2">
                    <div>
                      <div
                        className="font-display text-xl leading-tight"
                        style={{ color: active ? archetype.color : undefined }}
                      >
                        {archetype.name}
                      </div>
                      <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-parchment-600">
                        {archetype.alias}
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-parchment-700 transition-transform group-hover:translate-x-1"
                      style={{ color: active ? archetype.color : undefined }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
