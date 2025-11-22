"use client";

import { getCurrentWeekDates } from "../lib/dateUtils";
import { PlannerData } from "../lib/types";

type Props = {
  plannerData: PlannerData;
};

export function WeeklySummary({ plannerData }: Props) {
  const weekDates = getCurrentWeekDates();
  const totals = weekDates.reduce(
    (acc, dateKey) => {
      const day = plannerData[dateKey];
      if (!day) return acc;
      acc.total += day.tasks.length;
      acc.completed += day.tasks.filter((t) => t.done).length;
      return acc;
    },
    { total: 0, completed: 0 }
  );

  const completionRate = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);

  return (
    <div className="mt-4 rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Weekly Summary</p>
          <h3 className="text-xl font-semibold text-slate-100">Current Week</h3>
        </div>
        <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/40">
          {completionRate}% done
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-black/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total tasks</p>
          <p className="text-3xl font-semibold text-slate-100">{totals.total}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-black/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Completed</p>
          <p className="text-3xl font-semibold text-emerald-400">{totals.completed}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-emerald-400">{completionRate}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
