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
        primary: {
          DEFAULT: "#1e3a8a", // Navy Blue
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#dc2626", // Red
          light: "#ef4444",
          dark: "#b91c1c",
        },
        neutral: {
          light: "#f3f4f6",
          DEFAULT: "#6b7280",
          dark: "#1f2937",
        },
      },
    },
  },
  plugins: [],
};
export default config;
