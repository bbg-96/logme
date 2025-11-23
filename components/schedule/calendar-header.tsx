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
    <div ref={containerRef} className="relative flex items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onChangeMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-gray-500 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Previous month"
        >
          <span>&lt;</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen((open) => !open)}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
            <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 min-w-[200px] rounded-xl bg-white p-4 text-[var(--color-text-primary)] shadow-lg ring-1 ring-black/5">
              <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setVisibleYear((year) => year - 1)}
                  className="rounded-full px-3 py-1 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Previous year"
                >
                  &lt;
                </button>
                <span className="py-1 font-semibold">{visibleYear}년</span>
                <button
                  type="button"
                  onClick={() => setVisibleYear((year) => year + 1)}
                  className="rounded-full px-3 py-1 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  aria-label="Next year"
                >
                  &gt;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-3 text-sm">
                {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
                  const isActive =
                    visibleYear === currentMonth.getFullYear() && month - 1 === currentMonth.getMonth();
                  return (
                    <button
                      key={month}
                      type="button"
                      className={`w-full rounded-lg px-2 py-1 text-center transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                        isActive ? "bg-gray-900 text-white" : "text-[var(--color-text-primary)]"
                      }`}
                      onClick={() => {
                        onSelectMonth(visibleYear, month - 1);
                        setIsPickerOpen(false);
                      }}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onChangeMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-gray-500 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Next month"
        >
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
}
