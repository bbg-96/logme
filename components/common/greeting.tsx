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
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">{dateLabel}</p>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {greeting}, <span className="text-gradient">let’s get things done.</span>
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-300">
        Manage tasks, plan your schedule, and stay on top of what matters.
      </p>
    </div>
  );
}
