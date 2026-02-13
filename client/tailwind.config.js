/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f172a",
          muted: "#1e293b",
        },
        accent: {
          cyan: "#22d3ee",
          sky: "#38bdf8",
          indigo: "#6366f1",
        },
      },
      boxShadow: {
        glow: "0 14px 35px rgba(34, 211, 238, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
