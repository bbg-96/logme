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
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Today</p>
            <h1 className="text-3xl font-bold text-slate-100">{formattedDate}</h1>
            <p className="mt-2 text-sm text-slate-400">{message}</p>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-600/15 px-4 py-3 text-right shadow-inner shadow-indigo-900/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Tasks</p>
            <p className="text-2xl font-semibold text-indigo-50">
              {completed} / {total}
            </p>
            <p className="text-sm text-indigo-100">{rate}% completed</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Task Summary</p>
            <p className="text-3xl font-bold text-slate-100">{completed}</p>
            <p className="text-sm text-slate-400">Completed today</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total</p>
            <p className="text-lg font-semibold text-slate-100">{total}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span className="font-semibold text-emerald-400">{rate}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${rate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
