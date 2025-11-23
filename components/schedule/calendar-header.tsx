"use client";

import { useMemo } from "react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onChangeMonth: (offset: number) => void;
  onSelectMonth: (year: number, month: number) => void;
}

export function CalendarHeader({ currentMonth, onChangeMonth, onSelectMonth }: CalendarHeaderProps) {
  const monthOptions = useMemo(() => {
    const currentYear = currentMonth.getFullYear();
    const minYear = currentYear - 5;
    const maxYear = currentYear + 5;

    const options: { value: string; label: string }[] = [];

    for (let year = minYear; year <= maxYear; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        const date = new Date(year, month, 1);
        const label = date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
        options.push({ value: `${year}-${month}`, label });
      }
    }

    return options;
  }, [currentMonth]);

  const handleSelect = (value: string) => {
    const [yearString, monthString] = value.split("-");
    const year = Number(yearString);
    const month = Number(monthString);
    onSelectMonth(year, month);
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-2 shadow-sm">
      <button
        onClick={() => onChangeMonth(-1)}
        className="rounded-full px-3 py-2 text-base font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        aria-label="Previous month"
      >
        &lt;
      </button>

      <div className="flex-1 text-center">
        <label htmlFor="calendar-month-select" className="sr-only">
          Select month
        </label>
        <div className="relative inline-flex">
          <select
            id="calendar-month-select"
            value={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
            onChange={(event) => handleSelect(event.target.value)}
            className="appearance-none rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] px-4 py-2 pr-9 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            {monthOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-text-muted)]">
            ▼
          </span>
        </div>
      </div>

      <button
        onClick={() => onChangeMonth(1)}
        className="rounded-full px-3 py-2 text-base font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        aria-label="Next month"
      >
        &gt;
      </button>
    </div>
  );
}
