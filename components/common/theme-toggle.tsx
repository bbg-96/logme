"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!isReady}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-70"
      aria-label="Toggle theme"
    >
      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" aria-hidden />
      {isReady ? (theme === "dark" ? "Dark" : "Light") : "Loading..."}
    </button>
  );
}
