import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devclass — A character sheet for your developer mind",
  description:
    "An evidence-informed reflection tool. Answer 63 honest questions; receive your nine pillars and your developer archetype. Not a hiring signal — a mirror.",
  metadataBase: new URL("https://devclass.app"),
  openGraph: {
    title: "Devclass — Discover your developer archetype",
    description:
      "Nine pillars. Ten archetypes. One honest mirror for the way you think and build.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
