import { auth } from "@/auth";
import { SignInGate } from "@/components/SignInGate";
import QuizClient from "./QuizClient";

export const metadata = { title: "Take the Trial · Devclass" };

export default async function QuizPage() {
  const session = await auth().catch(() => null);

  if (!session?.user) {
    return (
      <SignInGate
        eyebrow="account required"
        title="Sign in before the trial."
        copy="Devclass now keeps your result as a real character sheet, blends it with your public GitHub signal, and lets you revisit, delete, or retake it later."
        redirectTo="/quiz"
        cta="Sign in and begin"
      />
    );
  }

  return <QuizClient />;
}
