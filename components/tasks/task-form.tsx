"use client";

import { useMemo, useState } from "react";
import { toLocalDateString } from "@/lib/date";
import { Priority } from "@/lib/types";
import { DateField } from "../common/date-field";

interface Props {
  onCreate: (input: {
    title: string;
    dueDate: string;
    priority: Priority;
    notes: string;
  }) => void;
  onClose?: () => void;
}

export function TaskForm({ onCreate, onClose }: Props) {
  const today = useMemo(() => toLocalDateString(new Date()), []);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setTitle("");
    setDueDate(today);
    setPriority("medium");
    setNotes("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), dueDate, priority, notes: notes.trim() });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface relative space-y-3.5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-strong)]"
      aria-label="Create a new task"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] text-xs font-semibold text-[var(--color-text-muted)] shadow-sm transition hover:bg-[var(--color-bg-card)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          aria-label="Close task form"
        >
          ×
        </button>
      )}

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Create Task</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">New item</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
          Stay organized
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--color-text-primary)]">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Draft proposal, book dentist, ..."
            className="input-field"
          />
        </label>

        <DateField label="Due date" value={dueDate} onChange={setDueDate} min={today} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--color-text-primary)]">
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="input-field rounded-full"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-[var(--color-text-primary)]">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Add context or next steps"
            className="input-field"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] disabled:opacity-50"
        aria-label="Add task"
      >
        + Add Task
      </button>
    </form>
  );
}
