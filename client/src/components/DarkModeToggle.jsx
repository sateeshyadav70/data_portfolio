import React, { createContext, useContext, useEffect, useState } from "react";

/*
  DarkModeToggle.jsx
  - Single-file React component + provider to enable Dark/Light theme using TailwindCSS (class strategy)
  - Features:
    - Reads user preference from localStorage
    - Respects system preference on first load (prefers-color-scheme)
    - Persists choice to localStorage
    - Adds smooth transition
    - Exposes a hook and a Toggle button component

  Usage:
    1) Make sure Tailwind config uses: darkMode: 'class'
    2) Wrap your app with <ThemeProvider> (or use ThemeProvider in index.jsx)
    3) Use <ThemeToggle /> anywhere to show the toggle
    4) Tailwind examples in this file show how to style light/dark
*/

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      return "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // toggle class
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/* Toggle button component */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ring-slate-400 dark:ring-slate-600`}
    >
      {/* simple sun/moon icons */}
      {theme === "dark" ? (
        // Sun icon (show when currently dark to indicate switching to light)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M6.343 6.343L4.929 4.929M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        // Moon icon (show when currently light to indicate switching to dark)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
