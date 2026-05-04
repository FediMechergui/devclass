"use client";

import { useEffect, useState } from "react";

export function DumbbellChallenge({ metric }: { metric: string }) {
  const [data, setData] = useState<{
    metric: string;
    metricName: string;
    date: string;
    challenge: string;
  } | null>(null);

  useEffect(() => {
    if (!metric) return;
    fetch(`/api/dumbbell?metric=${encodeURIComponent(metric)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, [metric]);

  if (!data) return null;

  return (
    <div className="border border-gold/30 bg-gold/[0.03] p-5">
      <div className="text-[11px] font-mono text-parchment-600 tracking-widest uppercase">
        Today's dumbbell · {data.date}
      </div>
      <div className="text-xs font-mono text-gold mt-1 mb-2">
        Working: {data.metricName}
      </div>
      <p className="text-parchment-100 text-sm leading-relaxed">{data.challenge}</p>
      <p className="text-[10px] text-parchment-700 mt-3 italic font-mono">
        One concrete rep on your weakest pillar. New challenge tomorrow.
      </p>
    </div>
  );
}
