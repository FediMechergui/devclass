import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          base: "#0B0F1A",
          elevated: "#131826",
          overlay: "#0F1422",
          card: "#1A2032",
          muted: "#1F2638",
        },
        parchment: {
          100: "#E8DCC4",
          200: "#D5C8AC",
          400: "#B5AB97",
          600: "#7A7464",
          800: "#4A4538",
        },
        gold: {
          bright: "#E8C885",
          DEFAULT: "#C9A86A",
          deep: "#8B7042",
        },
        teal: {
          bright: "#7DD8D5",
          DEFAULT: "#5EC4C0",
          deep: "#3A8985",
        },
        success: "#6FCF97",
        warning: "#E8B86A",
        danger: "#D86A6A",
        info: "#5E96C4",
        cls: {
          architect: "#7BA8D9",
          artisan: "#D9A87B",
          sage: "#95B58E",
          pathfinder: "#E8B547",
          sentinel: "#6B8CAE",
          diplomat: "#B58EAE",
          hacker: "#6FCF97",
          oracle: "#8E7BB5",
          berserker: "#D86A6A",
          druid: "#7BA88E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / 0.4)",
        md: "0 4px 12px rgb(0 0 0 / 0.5)",
        lg: "0 12px 32px rgb(0 0 0 / 0.6)",
        "glow-gold": "0 0 24px rgb(201 168 106 / 0.3)",
        "glow-teal": "0 0 24px rgb(94 196 192 / 0.3)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        in: "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      maxWidth: {
        reading: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
