/**
 * NextAuth v5 (Auth.js) configuration — GitHub OAuth.
 *
 * Wired but inert until AUTH_GITHUB_ID + AUTH_GITHUB_SECRET are set in the
 * environment. Users can take the quiz as a guest (cookie-based attempt id)
 * either way; signing in just attaches their attempts to a stable user.
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
  adapter: MongoDBAdapter(clientPromise, { databaseName: process.env.MONGODB_DB ?? "devclass" }),
  session: { strategy: "jwt" },
  providers: githubConfigured
    ? [
        GitHub({
          clientId: process.env.AUTH_GITHUB_ID!,
          clientSecret: process.env.AUTH_GITHUB_SECRET!,
          authorization: { params: { scope: "read:user user:email public_repo" } },
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        // store GitHub login + access token for future signal extraction
        token.githubLogin = (profile as { login?: string }).login;
        if (account.access_token) token.githubAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { githubLogin?: string }).githubLogin = token.githubLogin as string | undefined;
      }
      return session;
    },
  },
  pages: { signIn: "/" },
});
