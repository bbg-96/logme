"use client";

import { ReactNode, useMemo, useState } from "react";
import { parseLocalDateString, toLocalDateString } from "@/lib/date";
import { ScheduleItem } from "@/lib/types";
import { CalendarDayCell } from "./calendar-day-cell";

interface Props {
  schedules: ScheduleItem[];
  onDelete: (id: string) => void;
  onRequestCreate?: () => void;
  isFormOpen?: boolean;
  formContent?: ReactNode;
}

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

function buildCalendar(monthStart: Date): CalendarDay[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const startDay = monthStart.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const firstCellDate = new Date(year, month, 1 - startDay);

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(firstCellDate);
    date.setDate(firstCellDate.getDate() + index);
    return { date, inCurrentMonth: date.getMonth() === month };
  });
}

export function ScheduleCalendar({
  schedules,
  onDelete,
  onRequestCreate,
  isFormOpen,
  formContent,
}: Props) {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toLocalDateString(today), [today]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const monthOptions = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );

  const yearOptions = useMemo(() => {
    const currentYear = today.getFullYear();
    const minYear = Math.min(currentYear - 5, currentMonth.getFullYear());
    const maxYear = Math.max(currentYear + 5, currentMonth.getFullYear());
    return Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
  }, [currentMonth, today]);

  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, ScheduleItem[]> = {};

    schedules.forEach((entry) => {
      grouped[entry.date] = grouped[entry.date] ? [...grouped[entry.date], entry] : [entry];
    });

    Object.values(grouped).forEach((items) => items.sort((a, b) => a.time.localeCompare(b.time)));
    return grouped;
  }, [schedules]);

  const monthDays = useMemo(() => buildCalendar(currentMonth), [currentMonth]);
  const selectedDateItems = schedulesByDate[selectedDate] ?? [];

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const synchronizeSelectedDate = (target: Date) => {
    setSelectedDate((existing) => {
      const parsed = parseLocalDateString(existing);
      if (parsed.getFullYear() === target.getFullYear() && parsed.getMonth() === target.getMonth()) {
        return existing;
      }
      return toLocalDateString(target);
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth((previous) => {
      const next = new Date(previous.getFullYear(), previous.getMonth() + offset, 1);
      synchronizeSelectedDate(next);
      return next;
    });
  };

  const changeMonthDirect = (month: number) => {
    const next = new Date(currentMonth.getFullYear(), month, 1);
    setCurrentMonth(next);
    synchronizeSelectedDate(next);
  };

  const changeYearDirect = (year: number) => {
    const next = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(next);
    synchronizeSelectedDate(next);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(toLocalDateString(date));
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="card-surface space-y-3 p-3 sm:space-y-4 sm:p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Schedule</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Monthly view</p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          {onRequestCreate && (
            <button
              onClick={onRequestCreate}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
            >
              + New Schedule
            </button>
          )}
        </div>
      </div>

      <div className={isFormOpen ? "grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]" : "space-y-3"}>
        {isFormOpen && formContent && (
          <div className="lg:sticky lg:top-4">{formContent}</div>
        )}

        <div
          className={`space-y-3 ${
            isFormOpen
              ? "lg:max-h-[700px] lg:overflow-y-auto lg:pr-1"
              : "lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-4 lg:space-y-0"
          }`}
        >
          <div className="space-y-2.5 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] p-3 shadow-[0_14px_36px_rgba(0,0,0,0.06)] sm:p-3 lg:p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]" htmlFor="month-select">
                  Month
                </label>
                <select
                  id="month-select"
                  value={currentMonth.getMonth()}
                  onChange={(event) => changeMonthDirect(Number(event.target.value))}
                  className="rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                >
                  {monthOptions.map((label, index) => (
                    <option key={label} value={index}>
                      {label}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]" htmlFor="year-select">
                  Year
                </label>
                <select
                  id="year-select"
                  value={currentMonth.getFullYear()}
                  onChange={(event) => changeYearDirect(Number(event.target.value))}
                  className="rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-1.5 shadow-sm">
                <button
                  onClick={() => changeMonth(-1)}
                  className="rounded-full px-2 py-1 text-lg font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <div className="min-w-[160px] text-center text-sm font-semibold text-[var(--color-text-primary)]">{monthLabel}</div>
                <button
                  onClick={() => changeMonth(1)}
                  className="rounded-full px-2 py-1 text-lg font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] sm:text-xs">
              {weekdayLabels.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="rounded-xl border border-[color:var(--color-border-subtle)]/70 bg-[color:var(--color-border-subtle)]/40 p-[3px] sm:p-1 lg:p-1.5">
              <div className="grid grid-cols-7 gap-[3px] sm:gap-1 lg:gap-1.5">
                {monthDays.map(({ date, inCurrentMonth }) => {
                  const key = toLocalDateString(date);
                  const daySchedules = schedulesByDate[key];
                  return (
                    <CalendarDayCell
                      key={key + inCurrentMonth}
                      date={date}
                      inCurrentMonth={inCurrentMonth}
                      isToday={key === todayKey}
                      isSelected={key === selectedDate}
                      schedulesCount={daySchedules ? daySchedules.length : 0}
                      previewTitle={daySchedules?.[0]?.title}
                      onSelect={handleSelectDate}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] p-3 shadow-sm lg:sticky lg:top-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Day details</p>
                <p className="text-base font-semibold text-[var(--color-text-primary)]">
                  {parseLocalDateString(selectedDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-bg-card)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] shadow-sm">
                {selectedDateItems.length} item{selectedDateItems.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              {selectedDateItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] p-3 text-sm text-[var(--color-text-muted)]">
                  No schedule entries for this day.
                </div>
              )}

              {selectedDateItems.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-1.5 rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] p-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{entry.time}</p>
                      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{entry.title}</h3>
                    </div>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="self-start rounded-full border border-transparent bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                  {entry.notes && <p className="text-sm text-[var(--color-text-muted)]">{entry.notes}</p>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
