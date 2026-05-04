import Image from "next/image";
import { auth } from "@/auth";
import { signInWithGithub, signOutAction } from "@/app/actions/auth";

interface AuthBarProps {
  redirectTo?: string;
}

export async function AuthBar({ redirectTo = "/" }: AuthBarProps) {
  const session = await auth().catch(() => null);
  const user = session?.user as
    | { name?: string | null; image?: string | null; githubLogin?: string }
    | undefined;

  return (
    <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
      {user ? (
        <>
          <div className="flex items-center gap-2 text-xs text-parchment-300 font-mono">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "user"}
                width={28}
                height={28}
                className="rounded-full border border-gold/40"
              />
            ) : null}
            <span className="hidden sm:inline">
              {user.githubLogin ? `@${user.githubLogin}` : user.name}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOutAction(redirectTo);
            }}
          >
            <button
              type="submit"
              className="text-[11px] uppercase tracking-widest text-parchment-600 hover:text-gold transition-colors font-mono"
            >
              Sign out
            </button>
          </form>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signInWithGithub(redirectTo);
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-parchment-800/60 text-parchment-200 hover:border-gold hover:text-gold transition-colors text-xs font-mono uppercase tracking-widest"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            Sign in with GitHub
          </button>
        </form>
      )}
    </div>
  );
}
