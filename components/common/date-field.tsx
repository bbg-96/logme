"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { parseLocalDateString, toLocalDateString } from "@/lib/date";

type NullableString = string | null;

interface DateFieldProps {
  label?: string;
  value: NullableString;
  onChange: (value: NullableString) => void;
  min?: string;
}

const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateDisplay(value: NullableString) {
  if (!value) return "Select date";
  const date = parseLocalDateString(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`;
}

function isBeforeMin(date: Date, min?: string) {
  if (!min) return false;
  const minDate = parseLocalDateString(min);
  if (Number.isNaN(minDate.getTime())) return false;
  return date.getTime() < minDate.getTime();
}

export function DateField({ label, value, onChange, min }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const baseDate = useMemo(() => {
    if (!value) return new Date();
    const parsed = parseLocalDateString(value);
    if (Number.isNaN(parsed.getTime())) return new Date();
    return parsed;
  }, [value]);

  const visibleMonth = useMemo(
    () => new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1),
    [baseDate, monthOffset],
  );

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [visibleMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsidePopover = popoverRef.current?.contains(target);

      if (!isInsideContainer && !isInsidePopover) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const width = 280;
      const viewportWidth = window.innerWidth;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      let left = rect.left + scrollX;
      const rightOverflow = left + width - viewportWidth;
      if (rightOverflow > 0) {
        left = Math.max(16, left - rightOverflow);
      }

      setPopoverPosition({
        top: rect.bottom + scrollY + 8,
        left,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const handleSelectDate = (date: Date) => {
    if (isBeforeMin(date, min)) return;
    onChange(toLocalDateString(date));
    setMonthOffset(0);
    setOpen(false);
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[44px] w-full items-center justify-between rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-input)] px-3 text-left text-sm text-[var(--color-text-primary)] shadow-sm transition hover:border-[color:var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="truncate text-[var(--color-text-primary)]">{formatDateDisplay(value)}</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-[var(--color-text-muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="4" y1="10" x2="20" y2="10" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60] pointer-events-none">
            <div
              ref={popoverRef}
              className="pointer-events-auto absolute rounded-2xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] p-3 shadow-xl"
              style={{ width: 280, top: popoverPosition.top, left: popoverPosition.left }}
            >
              <div className="mb-3 flex items-center justify-between text-sm text-[var(--color-text-primary)]">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                  onClick={() => setMonthOffset((current) => current - 1)}
                  aria-label="Previous month"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <span className="font-semibold">{visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>

                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                  onClick={() => setMonthOffset((current) => current + 1)}
                  aria-label="Next month"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-medium text-[var(--color-text-muted)]">
                {dayNames.map((day) => (
                  <div key={day} className="w-full">
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
                {days.map((day, index) => {
                  if (!day) {
                    return <span key={index} className="block h-9" />;
                  }

                  const localDate = toLocalDateString(day);
                  const isSelected = value === localDate;
                  const disabled = isBeforeMin(day, min);

                  return (
                    <button
                      key={localDate}
                      type="button"
                      onClick={() => handleSelectDate(day)}
                      disabled={disabled}
                      className={`h-9 flex items-center justify-center rounded-md border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
                        isSelected
                          ? "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200"
                          : "border-transparent text-[var(--color-text-primary)] hover:border-[color:var(--color-border-subtle)] hover:bg-[var(--color-bg-subtle)]"
                      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
