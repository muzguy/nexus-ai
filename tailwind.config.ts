import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        nexus: {
          950: "rgb(var(--nexus-950) / <alpha-value>)",
          900: "rgb(var(--nexus-900) / <alpha-value>)",
          850: "rgb(var(--nexus-850) / <alpha-value>)",
          800: "rgb(var(--nexus-800) / <alpha-value>)",
          750: "rgb(var(--nexus-750) / <alpha-value>)",
          700: "rgb(var(--nexus-700) / <alpha-value>)",
          600: "rgb(var(--nexus-600) / <alpha-value>)",
          500: "rgb(var(--nexus-500) / <alpha-value>)",
          400: "rgb(var(--nexus-400) / <alpha-value>)",
          300: "rgb(var(--nexus-300) / <alpha-value>)",
          200: "rgb(var(--nexus-200) / <alpha-value>)",
          100: "rgb(var(--nexus-100) / <alpha-value>)",
          50: "rgb(var(--nexus-50) / <alpha-value>)",
        },
        accent: {
          indigo: "#10b981",
          violet: "#059669",
          cyan: "#10b981",
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
        glow: "var(--shadow-glow)",
        "glow-cyan": "var(--shadow-glow-cyan)",
        "glow-violet": "var(--shadow-glow-violet)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
