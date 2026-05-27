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
        paper: "#fbfaf7"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(23, 33, 28, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
