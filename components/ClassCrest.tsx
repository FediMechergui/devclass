"use client";
import { motion } from "framer-motion";
import type { ArchetypeId } from "@/lib/types";

interface Props {
  id: ArchetypeId | string;
  size?: number;
  color?: string;
  animated?: boolean;
}

const STROKE = 2.2;

/**
 * Each crest is a distinct geometric signature for the class.
 * Per design.md §6.3 — stylized, monoline, never pictorial.
 */
export function ClassCrest({ id, size = 120, color = "#C9A86A", animated = true }: Props) {
  const w = size;
  const h = size;
  const c = color;

  const wrap = (children: React.ReactNode) => (
    <motion.svg
      width={w}
      height={h}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={animated ? { scale: 1.05, filter: `drop-shadow(0 0 12px ${c})` } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ overflow: "visible" }}
    >
      {children}
    </motion.svg>
  );

  switch (id) {
    case "architect":
      // Triangle with internal grid of construction lines, drawn-on
      return wrap(
        <>
          <motion.polygon
            points="60,12 108,100 12,100"
            stroke={c}
            strokeWidth={STROKE}
            initial={animated ? { pathLength: 0 } : undefined}
            animate={animated ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
          <line x1="36" y1="56" x2="84" y2="56" stroke={c} strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="12" x2="60" y2="100" stroke={c} strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
          <line x1="12" y1="100" x2="84" y2="56" stroke={c} strokeWidth="0.8" opacity="0.3" />
          <line x1="108" y1="100" x2="36" y2="56" stroke={c} strokeWidth="0.8" opacity="0.3" />
          <circle cx="60" cy="56" r="3" fill={c} />
        </>
      );
    case "artisan":
      // Off-center cut circle, slow rotation
      return wrap(
        <motion.g
          animate={animated ? { rotate: 360 } : undefined}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="60" cy="60" r="44" stroke={c} strokeWidth={STROKE} />
          <path d="M 26 78 L 94 42" stroke={c} strokeWidth={STROKE} />
          <circle cx="60" cy="60" r="6" stroke={c} strokeWidth="1.5" />
          <circle cx="60" cy="60" r="2" fill={c} />
        </motion.g>
      );
    case "sage":
      // Open book — vertical spine, two pages with three horizontal lines each
      return wrap(
        <>
          <line x1="60" y1="20" x2="60" y2="100" stroke={c} strokeWidth={STROKE} />
          <motion.path
            d="M 60 22 Q 30 22 22 30 L 22 92 Q 30 96 60 96"
            stroke={c}
            strokeWidth={STROKE}
            initial={animated ? { pathLength: 0 } : undefined}
            animate={animated ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.path
            d="M 60 22 Q 90 22 98 30 L 98 92 Q 90 96 60 96"
            stroke={c}
            strokeWidth={STROKE}
            initial={animated ? { pathLength: 0 } : undefined}
            animate={animated ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          />
          {[40, 56, 72].map((y) => (
            <g key={y}>
              <line x1="32" y1={y} x2="52" y2={y} stroke={c} strokeWidth="1" opacity="0.7" />
              <line x1="68" y1={y} x2="88" y2={y} stroke={c} strokeWidth="1" opacity="0.7" />
            </g>
          ))}
        </>
      );
    case "pathfinder":
      // Arrow overshooting a circle — float-y
      return wrap(
        <motion.g
          animate={animated ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="50" cy="70" r="32" stroke={c} strokeWidth={STROKE} opacity="0.8" />
          <line x1="22" y1="98" x2="104" y2="16" stroke={c} strokeWidth={STROKE} />
          <polyline points="86,16 104,16 104,34" stroke={c} strokeWidth={STROKE} fill="none" />
          <circle cx="50" cy="70" r="3" fill={c} />
        </motion.g>
      );
    case "sentinel":
      // Reinforced square — corner brackets, glow-pulse
      return wrap(
        <motion.g
          animate={animated ? { opacity: [0.85, 1, 0.85] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="22" y="22" width="76" height="76" stroke={c} strokeWidth={STROKE} />
          {[
            [22, 22],
            [98, 22],
            [22, 98],
            [98, 98],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={c} strokeWidth={STROKE + 1} />
              <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke={c} strokeWidth={STROKE + 1} />
            </g>
          ))}
          <circle cx="60" cy="60" r="12" stroke={c} strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="3" fill={c} />
        </motion.g>
      );
    case "diplomat":
      // Vesica piscis — two intersecting circles, breathing
      return wrap(
        <motion.g
          animate={animated ? { scale: [1, 1.04, 1] } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="44" cy="60" r="34" stroke={c} strokeWidth={STROKE} />
          <circle cx="76" cy="60" r="34" stroke={c} strokeWidth={STROKE} />
          <line x1="60" y1="30" x2="60" y2="90" stroke={c} strokeWidth="1" opacity="0.6" />
        </motion.g>
      );
    case "hacker":
      // Square with offset hole — glitch shimmer
      return wrap(
        <>
          <rect x="20" y="20" width="80" height="80" stroke={c} strokeWidth={STROKE} />
          <motion.rect
            x="48"
            y="44"
            width="36"
            height="36"
            stroke={c}
            strokeWidth={STROKE}
            fill="#0B0F1A"
            animate={animated ? { x: [48, 47, 49, 48], y: [44, 45, 43, 44] } : undefined}
            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3.6, ease: "easeInOut" }}
          />
          <line x1="20" y1="60" x2="48" y2="60" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="84" y1="60" x2="100" y2="60" stroke={c} strokeWidth="1" opacity="0.5" />
        </>
      );
    case "oracle":
      // Spiral inside circle — slow spin
      return wrap(
        <>
          <circle cx="60" cy="60" r="44" stroke={c} strokeWidth={STROKE} />
          <motion.path
            d="M 60 60 m 0 -2 a 2 2 0 1 1 -0.001 0 M 60 60 m 0 -8 a 8 8 0 1 1 -0.001 0 M 60 60 m 0 -16 a 16 16 0 1 1 -0.001 0 M 60 60 m 0 -28 a 28 28 0 1 1 -0.001 0"
            stroke={c}
            strokeWidth="1.4"
            fill="none"
            animate={animated ? { rotate: 360 } : undefined}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          />
          <circle cx="60" cy="60" r="2" fill={c} />
        </>
      );
    case "berserker":
      // Lightning bolt inside square frame — quick flash
      return wrap(
        <>
          <rect x="22" y="22" width="76" height="76" stroke={c} strokeWidth={STROKE} />
          <motion.polygon
            points="62,28 38,64 56,64 50,92 80,52 60,52 70,28"
            fill={c}
            stroke={c}
            strokeWidth="1.5"
            animate={animated ? { opacity: [1, 0.4, 1, 1] } : undefined}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
          />
        </>
      );
    case "druid":
      // Circle bisected horizontally with a node growing on top
      return wrap(
        <motion.g
          animate={animated ? { scale: [1, 1.03, 1] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <circle cx="60" cy="60" r="44" stroke={c} strokeWidth={STROKE} />
          <line x1="16" y1="60" x2="104" y2="60" stroke={c} strokeWidth={STROKE} />
          <line x1="60" y1="60" x2="60" y2="28" stroke={c} strokeWidth={STROKE} />
          <circle cx="60" cy="22" r="6" fill={c} />
          <line x1="60" y1="60" x2="46" y2="46" stroke={c} strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="60" x2="74" y2="46" stroke={c} strokeWidth="1" opacity="0.6" />
        </motion.g>
      );
    default:
      return wrap(<circle cx="60" cy="60" r="44" stroke={c} strokeWidth={STROKE} />);
  }
}
