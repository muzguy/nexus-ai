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
        ruby: {
          950: "#2d0309",
          900: "#4c0519",
          850: "#5e0720",
          800: "#7f1d1d",
          700: "#9f1239",
          600: "#be123c",
          500: "#e11d48",
          400: "#fb7185",
          300: "#fda4af",
          200: "#fecdd3",
          100: "#ffe4e6",
          50: "#fff1f2",
        },
        crimson: {
          950: "#2d0309",
          900: "#4c0519",
          800: "#7f1d1d",
          700: "#9f1239",
          600: "#be123c",
          500: "#e11d48",
          400: "#fb7185",
        },
        accent: {
          primary: "#be123c",
          ruby: "#be123c",
          crimson: "#7f1d1d",
          rose: "#be123c",
          cyan: "#38bdf8",
          emerald: "#10b981",
          amber: "#f59e0b",
          indigo: "#6366f1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-ruby": "var(--shadow-glow-ruby)",
        "glow-crimson": "var(--shadow-glow-crimson)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "glass-elevated": "0 20px 50px 0 rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "ruby-gradient": "linear-gradient(135deg, #7F1D1D 0%, #BE123C 50%, #E11D48 100%)",
        "ruby-gradient-hover": "linear-gradient(135deg, #991B1B 0%, #E11D48 50%, #EF4444 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
