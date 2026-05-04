/**
 * NextAuth v5 (Auth.js) configuration — GitHub OAuth.
 *
 * Wired but inert until AUTH_GITHUB_ID + AUTH_GITHUB_SECRET are set in the
 * environment. The quiz/profile workflow now requires GitHub sign-in so an
 * attempt can become a durable character sheet with public GitHub signals.
 *
 * After Vercel deploy:
 *   1) Create a GitHub OAuth app with callback https://<your-app>.vercel.app/api/auth/callback/github
 *   2) Set AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET, NEXTAUTH_URL in Vercel envs
 *   3) Optional: enable extra scopes (read:user, public_repo) for GitHub signal extraction
 */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb";

const githubConfigured =
  !!process.env.AUTH_GITHUB_ID && !!process.env.AUTH_GITHUB_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB ?? "devclass",
  }),
  session: { strategy: "jwt" },
  providers: githubConfigured
    ? [
        GitHub({
          clientId: process.env.AUTH_GITHUB_ID!,
          clientSecret: process.env.AUTH_GITHUB_SECRET!,
          authorization: {
            params: { scope: "read:user user:email public_repo" },
          },
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user?.id) token.userId = user.id;
      if (account?.provider === "github" && profile) {
        token.githubLogin = (profile as { login?: string }).login;
        if (account.access_token)
          token.githubAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string;
          githubLogin?: string;
          githubAccessToken?: string;
        };
        if (token.userId) u.id = token.userId as string;
        else if (token.sub) u.id = token.sub;
        u.githubLogin = token.githubLogin as string | undefined;
        u.githubAccessToken = token.githubAccessToken as string | undefined;
      }
      return session;
    },
  },
  pages: { signIn: "/" },
});
