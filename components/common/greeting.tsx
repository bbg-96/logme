"use client";

import { useMemo } from "react";

export function Greeting() {
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
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{dateLabel}</p>
      <h1 className="text-[26px] font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
        {greeting}, <span className="text-gradient">let’s get things done.</span>
      </h1>
    </div>
  );
}
