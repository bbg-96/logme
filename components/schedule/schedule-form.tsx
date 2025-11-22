"use client";

import { useMemo, useState } from "react";
import { toLocalDateString } from "@/lib/date";
import { DateField } from "../common/date-field";
import { TimeField } from "../common/time-field";

interface Props {
  onCreate: (input: { title: string; date: string; time: string; notes: string }) => void;
  onClose?: () => void;
}

export function ScheduleForm({ onCreate, onClose }: Props) {
  const today = useMemo(() => toLocalDateString(new Date()), []);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setTitle("");
    setDate(today);
    setTime("09:00");
    setNotes("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), date, time, notes: notes.trim() });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface relative space-y-3.5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-strong)]"
      aria-label="Create a new schedule entry"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] text-xs font-semibold text-[var(--color-text-muted)] shadow-sm transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
          aria-label="Close schedule form"
        >
          ×
        </button>
      )}

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Add to Schedule</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">New entry</p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-100">
          Plan ahead
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--color-text-primary)]">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Team sync, gym session, deep work"
            className="input-field"
          />
        </label>

        <DateField label="Date" value={date} onChange={setDate} min={today} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TimeField label="Time" value={time} onChange={setTime} />

        <label className="space-y-1 text-sm font-medium text-[var(--color-text-primary)]">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Add agenda or prep steps"
            className="input-field"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] disabled:opacity-50"
      >
        + Add Schedule
      </button>
    </form>
  );
}
