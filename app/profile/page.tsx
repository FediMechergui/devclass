import { auth } from "@/auth";
import { SignInGate } from "@/components/SignInGate";
import ProfileClient from "./ProfileClient";

export const metadata = { title: "Profile · Devclass" };

export default async function ProfilePage() {
  const session = await auth().catch(() => null);

  if (!session?.user) {
    return (
      <SignInGate
        eyebrow="profile locked"
        title="Your character sheet lives behind GitHub."
        copy="Sign in to revisit your latest class result, GitHub-derived signals, AI plan, build log, and retake controls from any browser."
        redirectTo="/profile"
      />
    );
  }

  return <ProfileClient />;
}
