'use client';

import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

export default function ProfileClient({ userScores, primaryArchetype }: { userScores: any, primaryArchetype: any }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Trigger reveal animation after a short delay
    const timer = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const chartData = Object.keys(userScores).map(key => ({
    metric: key,
    user: userScores[key],
    archetype: primaryArchetype?.target_vector[key] || 50,
  }));

  if (!revealed) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-t-2 border-[var(--color-primary)] rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-[var(--color-primary)] font-mono uppercase tracking-widest text-sm">Casting identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-12 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      {/* Left Column: Radar & Class */}
      <div className="w-full md:w-1/2 flex flex-col gap-8">
        
        {/* Class Header */}
        <div className="text-center md:text-left">
          <p className="text-[var(--color-primary)] font-mono mb-2">You are</p>
          <h1 className="text-5xl md:text-6xl font-heading mb-4 text-[var(--color-primary)] drop-shadow-[0_0_15px_rgba(201,168,106,0.3)]">
            {primaryArchetype.name}
          </h1>
          <p className="text-xl text-[var(--color-foreground)]/80 italic">
            "{primaryArchetype.tagline}"
          </p>
        </div>

        {/* Radar Chart */}
        <div className="w-full aspect-square relative bg-[var(--color-surface)]/30 rounded-2xl border border-[var(--color-foreground)]/10 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="rgba(232, 220, 196, 0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(232, 220, 196, 0.5)', fontSize: 12, fontFamily: 'monospace' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              {/* Archetype shape (background) */}
              <Radar
                name="Archetype"
                dataKey="archetype"
                stroke="rgba(201, 168, 106, 0.3)"
                fill="rgba(201, 168, 106, 0.1)"
                fillOpacity={1}
              />
              
              {/* User shape (foreground) */}
              <Radar
                name="You"
                dataKey="user"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Lore Card */}
        <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-foreground)]/10">
          <p className="font-body text-[var(--color-foreground)]/80 leading-relaxed">
            {primaryArchetype.lore_long}
          </p>
        </div>
      </div>

      {/* Right Column: Details & Plan */}
      <div className="w-full md:w-1/2 flex flex-col gap-8 pt-8 md:pt-32">
        
        {/* Shadow Warning */}
        <div className="p-6 rounded-xl border border-red-900/30 bg-red-950/10">
          <h3 className="text-red-400 font-mono text-sm uppercase mb-3 flex items-center gap-2">
            <span>⚠️</span> The Shadow
          </h3>
          <p className="text-[var(--color-foreground)]/70 italic text-sm">
            {primaryArchetype.shadow}
          </p>
        </div>

        {/* The Dumbbell (Improvement Plan) */}
        <div className="p-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-surface)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-bl-full pointer-events-none" />
          <h3 className="text-xl font-heading text-[var(--color-primary)] mb-4">The Dumbbell</h3>
          <p className="text-sm text-[var(--color-foreground)]/70 mb-6">
            Take the aspect you're worst at and start lifting that dumbbell. Based on your profile, focus on:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-lg border border-[var(--color-foreground)]/5">
              <h4 className="font-bold mb-1">Increase CRE (Creativity)</h4>
              <p className="text-sm text-[var(--color-foreground)]/60">
                You lean heavily on structure and analysis. Try building a small, throwaway project using a framework you've never touched, without planning the architecture first.
              </p>
            </div>
            <div className="p-4 bg-black/40 rounded-lg border border-[var(--color-foreground)]/5">
              <h4 className="font-bold mb-1">Engage with Open Source</h4>
              <p className="text-sm text-[var(--color-foreground)]/60">
                Read PRs on repositories you use. Notice how authors justify unconventional decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Canonical Roles */}
        <div>
          <h3 className="text-sm font-mono text-[var(--color-foreground)]/50 uppercase mb-4">Canonical Roles</h3>
          <div className="flex flex-wrap gap-2">
            {primaryArchetype.canonical_roles.map((role: string) => (
              <span key={role} className="px-3 py-1 text-sm rounded-full border border-[var(--color-foreground)]/20 bg-[var(--color-surface)] text-[var(--color-foreground)]/80">
                {role}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
