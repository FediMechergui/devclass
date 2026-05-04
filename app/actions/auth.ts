"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGithub(redirectTo = "/") {
  await signIn("github", { redirectTo });
}

export async function signOutAction(redirectTo = "/") {
  await signOut({ redirectTo });
}
