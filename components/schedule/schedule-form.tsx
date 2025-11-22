"use client";

import { useMemo, useState } from "react";

interface Props {
  onCreate: (input: { title: string; date: string; time: string; notes: string }) => void;
}

export function ScheduleForm({ onCreate }: Props) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
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
      className="card-surface space-y-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-strong)]"
      aria-label="Create a new schedule entry"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">Add to Schedule</h2>
          <p className="text-sm text-[var(--text-muted)]">Capture meetings, appointments, or time blocks.</p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-100">
          Plan ahead
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Team sync, gym session, deep work"
            className="input-field"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
          Date
          <input
            required
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="input-field"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
          Time
          <input
            required
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="input-field"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] disabled:opacity-50"
      >
        + Add Schedule
      </button>
    </form>
  );
}
