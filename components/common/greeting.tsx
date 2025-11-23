"use client";

import { useMemo } from "react";

interface GreetingProps {
  compact?: boolean;
}

export function Greeting({ compact = false }: GreetingProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const dateLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className={`flex flex-col ${compact ? "gap-1" : "gap-2"}`}>
      <p
        className={
          compact
            ? "text-[11px] font-semibold uppercase tracking-wide text-indigo-500"
            : "text-sm font-semibold uppercase tracking-wide text-indigo-500"
        }
      >
        {dateLabel}
      </p>
      <h1
        className={
          compact
            ? "text-xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-2xl"
            : "text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl"
        }
      >
        {greeting}, <span className="text-gradient">let’s get things done.</span>
      </h1>
    </div>
  );
}
