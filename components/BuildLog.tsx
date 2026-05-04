"use client";

import { useEffect, useState } from "react";
import { METRIC_CODES } from "@/lib/types";
import type { MetricCode } from "@/lib/types";

interface Entry {
  id: string;
  text: string;
  metric: MetricCode | null;
  createdAt: string;
}

export function BuildLog({ defaultMetric }: { defaultMetric?: MetricCode }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [text, setText] = useState("");
  const [metric, setMetric] = useState<string>(defaultMetric ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthed, setUnauthed] = useState(false);

  async function load() {
    const res = await fetch("/api/buildlog");
    if (res.status === 200) {
      const data = await res.json();
      setEntries(data.entries ?? []);
    } else {
      setEntries([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/buildlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), metric: metric || undefined }),
      });
      if (res.status === 401) {
        setUnauthed(true);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Failed to save.");
        return;
      }
      setText("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (unauthed) {
    return (
      <p className="text-xs text-parchment-600 italic">
        Sign in with GitHub to keep a build log of your deliberate practice.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="signal-card border border-parchment-800/40 bg-ink-base/45 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="One terse note. What you tried. What broke. What you learned."
          className="w-full resize-none border-none bg-transparent font-body text-sm text-parchment-100 outline-none placeholder:text-parchment-700"
          rows={2}
          maxLength={600}
        />
        <div className="flex items-center justify-between mt-2">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            title="Pillar this entry belongs to"
            aria-label="Pillar this entry belongs to"
            className="bg-ink-elevated text-xs font-mono text-parchment-400 border border-parchment-800/40 px-2 py-1"
          >
            <option value="">— pillar —</option>
            {METRIC_CODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={submit}
            disabled={busy || !text.trim()}
            className="border border-gold/45 px-3 py-1.5 text-xs font-mono uppercase tracking-widest text-gold hover:bg-gold/10 hover:text-gold-bright disabled:opacity-40"
          >
            {busy ? "saving…" : "log it →"}
          </button>
        </div>
        {error ? <p className="text-xs text-danger mt-1">{error}</p> : null}
      </div>

      <ul className="space-y-3">
        {entries === null ? (
          <li className="text-xs text-parchment-700 font-mono">loading…</li>
        ) : entries.length === 0 ? (
          <li className="text-xs text-parchment-700 italic">
            No entries yet. The log starts blank.
          </li>
        ) : (
          entries.map((e) => (
            <li
              key={e.id}
              className="border-l-2 border-parchment-800/60 bg-ink-base/35 p-3 pl-4"
            >
              <div className="text-[10px] font-mono text-parchment-700 flex gap-2">
                <span>{new Date(e.createdAt).toLocaleString()}</span>
                {e.metric ? (
                  <span className="text-gold">· {e.metric}</span>
                ) : null}
              </div>
              <p className="text-sm text-parchment-200 mt-0.5 whitespace-pre-wrap">
                {e.text}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
