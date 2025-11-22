"use client";

import { formatDateKey } from "../lib/dateUtils";
import { PlannerData } from "../lib/types";

type Props = {
  plannerData: PlannerData;
};

export function TodaySummary({ plannerData }: Props) {
  const today = new Date();
  const dateKey = formatDateKey(today);
  const dayData = plannerData[dateKey] || { schedules: [], tasks: [] };
  const completed = dayData.tasks.filter((t) => t.done).length;
  const total = dayData.tasks.length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const message = (() => {
    if (total === 0) return "Set your goals for today.";
    if (rate === 100) return "Fantastic! All tasks completed.";
    if (rate >= 60) return "Great progress—keep the momentum!";
    if (rate > 0) return "You're getting there. Focus on the next task.";
    return "Let's start with the first task.";
  })();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Today</p>
          <h1 className="text-3xl font-bold text-slate-100">{formattedDate}</h1>
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        </div>
        <div className="rounded-2xl bg-indigo-600/20 px-4 py-3 text-right ring-1 ring-indigo-500/30">
          <p className="text-xs uppercase tracking-wide text-indigo-200">Tasks</p>
          <p className="text-2xl font-semibold text-indigo-100">
            {completed} / {total}
          </p>
          <p className="text-sm text-indigo-200">{rate}% completed</p>
        </div>
      </div>
    </div>
  );
}
