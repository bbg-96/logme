"use client";

import { useMemo } from "react";
import { parseLocalDateString } from "@/lib/date";
import { ScheduleItem } from "@/lib/types";

interface Props {
  schedules: ScheduleItem[];
  onDelete: (id: string) => void;
}

export function ScheduleList({ schedules, onDelete }: Props) {
  const sorted = useMemo(() => {
    return [...schedules].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [schedules]);

  return (
    <div className="card-surface space-y-4 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Schedule</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Upcoming</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sorted.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] p-6 text-center text-sm text-[var(--color-text-muted)]">
            No schedule entries yet. Add your first one!
          </div>
        )}

        {sorted.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-col gap-3 rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-list-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {parseLocalDateString(entry.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  ·
                  <span className="text-[var(--color-text-primary)]">{entry.time}</span>
                </p>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{entry.title}</h3>
                {entry.notes && <p className="text-sm text-[var(--color-text-muted)]">{entry.notes}</p>}
              </div>

              <button
                onClick={() => onDelete(entry.id)}
                className="self-start rounded-full border border-transparent bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
