"use client";

import { useEffect, useState } from "react";

interface DistRow {
  id: string;
  name: string;
  color: string;
  count: number;
  pct: number;
}

export function CommunityDistribution({ highlightId }: { highlightId?: string }) {
  const [data, setData] = useState<{ total: number; distribution: DistRow[] } | null>(null);

  useEffect(() => {
    fetch("/api/community/distribution")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ total: 0, distribution: [] }));
  }, []);

  if (!data) return null;
  if (data.total === 0) {
    return (
      <p className="text-xs text-parchment-600 italic">
        No public attempts yet — you may be the first.
      </p>
    );
  }

  return (
    <div>
      <div className="text-[11px] font-mono text-parchment-600 mb-3 uppercase tracking-widest">
        {data.total} attempts · anonymous
      </div>
      <div className="space-y-1.5">
        {data.distribution.map((row) => {
          const isYou = row.id === highlightId;
          return (
            <div key={row.id} className="flex items-center gap-3 text-xs">
              <div
                className={`w-32 truncate ${isYou ? "text-gold font-display" : "text-parchment-300"}`}
                title={row.name}
              >
                {row.name}
                {isYou ? " (you)" : ""}
              </div>
              <div className="flex-1 h-2 bg-parchment-800/40 relative">
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${Math.max(2, row.pct)}%`,
                    background: row.color,
                    opacity: isYou ? 1 : 0.55,
                  }}
                />
              </div>
              <div className="w-10 text-right font-mono text-parchment-500">{row.pct}%</div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-parchment-700 mt-3 italic font-mono">
        No leaderboard. No ranking. Just the shape of the room.
      </p>
    </div>
  );
}
