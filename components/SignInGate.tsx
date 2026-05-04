import Link from "next/link";
import { ArrowRight, Github, LockKeyhole, Sparkles } from "lucide-react";
import { signInWithGithub } from "@/app/actions/auth";

interface SignInGateProps {
  title: string;
  eyebrow: string;
  copy: string;
  redirectTo: string;
  cta?: string;
}

export function SignInGate({
  title,
  eyebrow,
  copy,
  redirectTo,
  cta = "Sign in with GitHub",
}: SignInGateProps) {
  return (
    <main className="alive-surface flex min-h-screen items-center justify-center px-6 py-16">
      <div className="pointer-events-none fixed inset-0 energy-grid opacity-45" />
      <section className="glass-panel relative z-10 w-full max-w-2xl overflow-hidden p-7 text-center md:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-teal-bright to-coral" />
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center border border-gold/45 text-gold-bright">
          <LockKeyhole size={26} />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 border border-parchment-800/60 bg-ink-base/45 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-parchment-500">
          <Sparkles size={14} /> {eyebrow}
        </div>
        <h1 className="font-display text-4xl leading-tight text-parchment-100 md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-reading text-sm leading-relaxed text-parchment-300 md:text-base">
          {copy}
        </p>
        <form
          action={async () => {
            "use server";
            await signInWithGithub(redirectTo);
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-3 border border-gold bg-gold/10 px-6 py-4 font-display text-lg tracking-wide text-gold-bright transition-all hover:-translate-y-0.5 hover:bg-gold/18 hover:shadow-glow-gold"
          >
            <Github size={20} />
            {cta}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>
        <Link
          href="/methodology"
          className="mt-5 inline-block text-xs font-mono uppercase tracking-[0.2em] text-parchment-600 hover:text-gold"
        >
          read methodology first
        </Link>
      </section>
    </main>
  );
}
