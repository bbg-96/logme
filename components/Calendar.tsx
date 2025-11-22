"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateKey, getCalendarDays, isSameDay } from "../lib/dateUtils";
import { PlannerData } from "../lib/types";

type Props = {
  selectedDate: Date;
  onSelectDate: (dateKey: string) => void;
  plannerData: PlannerData;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({ selectedDate, onSelectDate, plannerData }: Props) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const today = useMemo(() => new Date(), []);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Calendar</p>
          <h2 className="text-2xl font-semibold text-slate-100">{monthLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous month"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              )
            }
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-200 transition hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ←
          </button>
          <button
            aria-label="Next month"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              )
            }
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-200 transition hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-sm text-slate-400">
        {weekdayLabels.map((day) => (
          <div key={day} className="rounded-xl bg-slate-900/70 py-2 font-medium ring-1 ring-slate-800">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const dayData = plannerData[dateKey];
          const hasItems = !!dayData && (dayData.schedules.length > 0 || dayData.tasks.length > 0);

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`group relative flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-600/15 text-indigo-100"
                  : "border-slate-800 bg-slate-900/70 text-slate-200"
              } ${!isCurrentMonth ? "text-slate-600" : ""} hover:bg-slate-800/60 hover:border-indigo-500/50`}
            >
              <span
                className={`text-base font-semibold ${
                  isToday ? "text-emerald-400" : ""
                } ${!isCurrentMonth ? "text-slate-600" : ""}`}
              >
                {day.getDate()}
              </span>
              {hasItems && (
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400"></span>
              )}
              {isToday && (
                <span className="absolute right-2 top-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
