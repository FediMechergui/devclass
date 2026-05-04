import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function Home() {
  const archetypesPath = path.join(process.cwd(), '../../data/archetypes.json');
  let archetypes = [];
  try {
    const data = fs.readFileSync(archetypesPath, 'utf8');
    archetypes = JSON.parse(data);
  } catch (error) {
    console.error("Failed to load archetypes", error);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--color-background)] relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-5 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-3xl mt-24 mb-32">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[var(--color-foreground)] mb-6 text-balance">
          You're not a 10x dev. <br />
          <span className="text-[var(--color-primary)]">You're a class.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--color-foreground)]/80 mb-12 font-body max-w-2xl text-balance">
          An open-source self-assessment that profiles your engineering shape. Find out which one you are.
        </p>
        
        <Link 
          href="/quiz"
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-[var(--color-primary)] px-8 font-medium text-black transition-all hover:bg-[var(--color-primary)]/90"
        >
          <span className="mr-2 text-lg font-bold tracking-wide uppercase">Take the Quiz</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <div className="w-full max-w-6xl z-10 pb-24">
        <h2 className="text-3xl font-heading text-center mb-12 text-[var(--color-foreground)]/60 uppercase tracking-widest">
          The Starter Classes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {archetypes.map((arc: any) => (
            <div 
              key={arc.id}
              className="group relative flex flex-col p-6 rounded-xl border border-[var(--color-foreground)]/10 bg-[var(--color-surface)]/50 backdrop-blur-sm transition-all hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)] cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <p className="text-[var(--color-primary)] text-sm font-mono mb-2">{arc.dnd_analog}</p>
                <h3 className="text-2xl font-heading mb-3">{arc.name}</h3>
                <p className="text-sm text-[var(--color-foreground)]/70 italic mb-4 leading-relaxed line-clamp-3">
                  "{arc.tagline}"
                </p>
                <div className="mt-auto pt-4 border-t border-[var(--color-foreground)]/10">
                  <p className="text-xs text-[var(--color-foreground)]/50 font-mono">
                    Top Traits: {Object.entries(arc.target_vector).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3).map(e => e[0]).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
