"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type NullableString = string | null;

interface TimeFieldProps {
  label?: string;
  value: NullableString;
  onChange: (value: NullableString) => void;
}

function formatTimeDisplay(value: NullableString) {
  if (!value) return "Select time";
  const [hoursString, minutesString] = value.split(":");
  if (!hoursString || !minutesString) return value;
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const result: string[] = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (const minute of [0, 30]) {
        const h = hour.toString().padStart(2, "0");
        const m = minute.toString().padStart(2, "0");
        result.push(`${h}:${m}`);
      }
    }
    return result;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[44px] w-full items-center justify-between rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-input)] px-3 text-left text-sm text-[var(--color-text-primary)] shadow-sm transition hover:border-[color:var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-[var(--color-text-primary)]">{formatTimeDisplay(value)}</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 text-[var(--color-text-muted)] transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-card)] p-2 shadow-xl">
          <ul role="listbox" className="space-y-1 text-sm text-[var(--color-text-primary)]">
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <li key={option}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
                      isSelected
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200"
                        : ""
                    }`}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
