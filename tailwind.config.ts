import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        accent: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        dark: {
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontWeight: {
        black: "900",
      },
    },
  },
  plugins: [],
};

export default config;
