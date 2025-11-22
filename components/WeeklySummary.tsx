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
    <div className="mt-4 rounded-2xl bg-slate-900/60 p-5 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Weekly Summary</p>
          <h3 className="text-xl font-semibold text-slate-100">Current Week</h3>
        </div>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/40">
          {completionRate}% done
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div className="rounded-xl bg-slate-800/80 p-3 ring-1 ring-white/5">
          <p className="text-slate-400">Total tasks</p>
          <p className="text-2xl font-bold text-slate-100">{totals.total}</p>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-3 ring-1 ring-white/5">
          <p className="text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-emerald-400">{totals.completed}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
