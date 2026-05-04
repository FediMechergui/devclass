"use client";
import { motion } from "framer-motion";

interface Props {
  step: number;
  total: number;
}

/**
 * Rune-style progress: filled diamonds for completed, hollow for upcoming.
 */
export function RuneProgress({ step, total }: Props) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: current ? 1.2 : 1, opacity: 1 }}
            transition={{ delay: i * 0.015 }}
            style={{
              width: 8,
              height: 8,
              transform: "rotate(45deg)",
              background: done ? "#C9A86A" : "transparent",
              border: `1px solid ${done || current ? "#C9A86A" : "#4A4538"}`,
              boxShadow: current ? "0 0 8px #E8C885" : "none",
            }}
          />
        );
      })}
      <span className="ml-3 text-xs font-mono text-parchment-600">
        {step}/{total}
      </span>
    </div>
  );
}
