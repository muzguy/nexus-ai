import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          950: "#06080e",
          900: "#0b0f19",
          850: "#101625",
          800: "#161e31",
          750: "#1d273e",
          700: "#25314d",
          600: "#364568",
          500: "#4e6088",
          400: "#7487ad",
          300: "#9fb0d0",
          200: "#cbd6eb",
          100: "#e7edf8",
          50: "#f4f7fc",
        },
        accent: {
          indigo: "#6366f1",
          violet: "#8b5cf6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(99, 102, 241, 0.25)",
        "glow-cyan": "0 0 24px -4px rgba(6, 182, 212, 0.25)",
        "glow-violet": "0 0 24px -4px rgba(139, 92, 246, 0.25)",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
