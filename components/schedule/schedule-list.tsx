"use client";

import { useMemo } from "react";
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
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">Schedule</h2>
          <p className="text-sm text-[var(--text-muted)]">Chronological list of your upcoming sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sorted.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[var(--card-muted)] p-6 text-center text-sm text-[var(--text-muted)]">
            No schedule entries yet. Add your first one!
          </div>
        )}

        {sorted.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--card)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-muted)]">
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                   ·
                  <span className="text-[var(--text)]">{entry.time}</span>
                </p>
                <h3 className="text-base font-semibold text-[var(--text)]">{entry.title}</h3>
                {entry.notes && <p className="text-sm text-[var(--text-muted)]">{entry.notes}</p>}
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
