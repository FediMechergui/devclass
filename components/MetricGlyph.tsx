"use client";
import type { MetricCode } from "@/lib/types";

interface Props {
  code: MetricCode | string;
  size?: number;
  color?: string;
}

export function MetricGlyph({ code, size = 28, color = "#E8DCC4" }: Props) {
  const c = color;
  const s = size;
  const sw = 1.6;

  const wrap = (children: React.ReactNode) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {children}
    </svg>
  );

  switch (code) {
    case "ANL": // connected nodes
      return wrap(
        <>
          <circle cx="6" cy="8" r="2" fill={c} />
          <circle cx="26" cy="10" r="2" fill={c} />
          <circle cx="10" cy="24" r="2" fill={c} />
          <circle cx="24" cy="22" r="2" fill={c} />
          <line x1="6" y1="8" x2="26" y2="10" stroke={c} strokeWidth={sw} />
          <line x1="6" y1="8" x2="10" y2="24" stroke={c} strokeWidth={sw} />
          <line x1="26" y1="10" x2="24" y2="22" stroke={c} strokeWidth={sw} />
          <line x1="10" y1="24" x2="24" y2="22" stroke={c} strokeWidth={sw} />
        </>
      );
    case "CRT": // magnifier on tilted square
      return wrap(
        <>
          <rect x="6" y="6" width="14" height="14" stroke={c} strokeWidth={sw} transform="rotate(15 13 13)" />
          <circle cx="20" cy="20" r="5" stroke={c} strokeWidth={sw} />
          <line x1="24" y1="24" x2="29" y2="29" stroke={c} strokeWidth={sw + 0.4} />
        </>
      );
    case "CRE": // 9-pointed asterisk
      return wrap(
        <>
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (i * 360) / 9;
            const rad = (a * Math.PI) / 180;
            const x2 = (16 + Math.cos(rad) * 12).toFixed(3);
            const y2 = (16 + Math.sin(rad) * 12).toFixed(3);
            return <line key={i} x1="16" y1="16" x2={x2} y2={y2} stroke={c} strokeWidth={sw} />;
          })}
          <circle cx="16" cy="16" r="2" fill={c} />
        </>
      );
    case "DOM": // stacked horizontal lines, varying weight
      return wrap(
        <>
          <line x1="4" y1="8" x2="28" y2="8" stroke={c} strokeWidth="3" />
          <line x1="4" y1="14" x2="24" y2="14" stroke={c} strokeWidth="2" />
          <line x1="4" y1="20" x2="20" y2="20" stroke={c} strokeWidth="1.5" />
          <line x1="4" y1="26" x2="16" y2="26" stroke={c} strokeWidth="1" />
        </>
      );
    case "FOC": // point with concentric ring
      return wrap(
        <>
          <circle cx="16" cy="16" r="12" stroke={c} strokeWidth={sw} opacity="0.4" />
          <circle cx="16" cy="16" r="7" stroke={c} strokeWidth={sw} opacity="0.7" />
          <circle cx="16" cy="16" r="3" fill={c} />
        </>
      );
    case "CUR": // arrow exiting circle
      return wrap(
        <>
          <circle cx="12" cy="16" r="9" stroke={c} strokeWidth={sw} />
          <line x1="12" y1="16" x2="28" y2="6" stroke={c} strokeWidth={sw} />
          <polyline points="22,6 28,6 28,12" stroke={c} strokeWidth={sw} fill="none" />
        </>
      );
    case "INT": // eye with partial frame
      return wrap(
        <>
          <path d="M 4 16 Q 16 6 28 16 Q 16 26 4 16 Z" stroke={c} strokeWidth={sw} />
          <circle cx="16" cy="16" r="4" stroke={c} strokeWidth={sw} />
          <circle cx="16" cy="16" r="1.5" fill={c} />
        </>
      );
    case "REG": // horizon line with sun
      return wrap(
        <>
          <line x1="3" y1="20" x2="29" y2="20" stroke={c} strokeWidth={sw} />
          <circle cx="16" cy="20" r="6" stroke={c} strokeWidth={sw} fill="none" />
          <line x1="10" y1="20" x2="22" y2="20" stroke={c} strokeWidth={sw} />
        </>
      );
    case "COM": // two overlapping speech rectangles
      return wrap(
        <>
          <rect x="4" y="6" width="16" height="12" stroke={c} strokeWidth={sw} />
          <polyline points="8,18 8,22 13,18" stroke={c} strokeWidth={sw} fill="none" />
          <rect x="12" y="14" width="16" height="12" stroke={c} strokeWidth={sw} fill="#0B0F1A" />
          <polyline points="24,26 24,30 19,26" stroke={c} strokeWidth={sw} fill="none" />
        </>
      );
    default:
      return wrap(<circle cx="16" cy="16" r="12" stroke={c} strokeWidth={sw} />);
  }
}
