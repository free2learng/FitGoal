import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        mint: "#36d399",
        leaf: "#1f8a5b",
        peach: "#ffb38a",
        sky: "#6ab7ff",
        paper: "#fbfaf7",
        fit: {
          bg: "var(--fit-bg)",
          surface: "var(--fit-surface)",
          surfaceElevated: "var(--fit-surface-elevated)",
          darkSurface: "var(--fit-dark-surface)",
          darkElevated: "var(--fit-dark-elevated)",
          text: "var(--fit-text)",
          primary: "var(--fit-primary)",
          secondary: "var(--fit-secondary)",
          accent: "var(--fit-accent)",
          success: "var(--fit-success)",
          warning: "var(--fit-warning)",
          danger: "var(--fit-danger)",
          muted: "var(--fit-muted)",
          mutedText: "var(--fit-muted-text)",
          border: "var(--fit-border)"
        }
      },
      boxShadow: {
        soft: "0 18px 40px rgba(23, 33, 28, 0.10)",
        premium: "0 24px 60px rgba(11, 15, 24, 0.10)"
      },
      keyframes: {
        "toast-in": {
          "0%": { transform: "translateY(18px) scale(0.96)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" }
        },
        "success-pop": {
          "0%": { transform: "scale(0.92)" },
          "55%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        "toast-in": "toast-in 260ms ease-out both",
        "success-pop": "success-pop 420ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
