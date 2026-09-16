import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3b82f6",
          "blue-dim": "rgba(59,130,246,0.15)",
          green: "#22c55e",
          "green-dim": "rgba(34,197,94,0.12)",
          red: "#ef4444",
          "red-dim": "rgba(239,68,68,0.12)",
          amber: "#f59e0b",
          "amber-dim": "rgba(245,158,11,0.12)",
        },
        surface: {
          DEFAULT: "#18181b",
          raised: "#1f1f23",
          overlay: "#27272a",
        },
        sql: {
          bg: "#0d1117",
          keyword: "#ff7b72",
          function: "#d2a8ff",
          string: "#a5d6ff",
          number: "#79c0ff",
          comment: "#8b949e",
          table: "#ffa657",
          column: "#e6edf3",
          operator: "#ff7b72",
          placeholder: "#f0883e",
        },
      },
      fontFamily: {
        sans: ["Fira Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "JetBrains Mono", "Cascadia Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "flow": "flow 3s ease-in-out infinite",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(59,130,246,0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        flow: {
          "0%, 100%": { opacity: "0.4", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-4px)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "blue-glow": "0 0 30px rgba(59,130,246,0.25)",
        "green-glow": "0 0 30px rgba(34,197,94,0.2)",
        "surface": "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "elevated": "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
