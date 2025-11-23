"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onChangeMonth: (offset: number) => void;
  onSelectMonth: (year: number, month: number) => void;
}

export function CalendarHeader({ currentMonth, onChangeMonth, onSelectMonth }: CalendarHeaderProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [visibleYear, setVisibleYear] = useState(() => currentMonth.getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleYear(currentMonth.getFullYear());
  }, [currentMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      }),
    [currentMonth],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-between gap-2 rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-2 shadow-sm"
    >
      <button
        onClick={() => onChangeMonth(-1)}
        className="rounded-full px-3 py-2 text-base font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
        aria-label="Previous month"
      >
        &lt;
      </button>

      <div className="flex-1 text-center">
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => setIsPickerOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition hover:bg-[var(--color-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
            aria-haspopup="dialog"
            aria-expanded={isPickerOpen}
          >
            <span>{monthLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 transition-transform ${isPickerOpen ? "rotate-180" : "rotate-0"}`}
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isPickerOpen && (
            <div className="absolute left-1/2 z-20 mt-2 w-64 -translate-x-1/2 rounded-xl bg-white text-[var(--color-text-primary)] shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] px-3 py-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setVisibleYear((year) => year - 1)}
                  className="rounded-full px-3 py-1 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Previous year"
                >
                  &lt;
                </button>
                <span>{visibleYear}년</span>
                <button
                  type="button"
                  onClick={() => setVisibleYear((year) => year + 1)}
                  className="rounded-full px-3 py-1 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Next year"
                >
                  &gt;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 p-3 text-sm">
                {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                  <button
                    key={month}
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-[var(--color-text-primary)] transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                    onClick={() => {
                      onSelectMonth(visibleYear, month - 1);
                      setIsPickerOpen(false);
                    }}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
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
