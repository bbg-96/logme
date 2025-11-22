"use client";

import { useMemo, useState } from "react";
import { Priority } from "@/lib/types";

interface Props {
  onCreate: (input: {
    title: string;
    dueDate: string;
    priority: Priority;
    notes: string;
  }) => void;
}

export function TaskForm({ onCreate }: Props) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
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
      className="card-surface space-y-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-strong)]"
      aria-label="Create a new task"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">Create Task</h2>
          <p className="text-sm text-[var(--text-muted)]">Add your next task with due date, priority, and optional notes.</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
          Stay organized
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Draft proposal, book dentist, ..."
            className="input-field"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
          Due date
          <input
            required
            type="date"
            min={today}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="input-field"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
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

        <label className="space-y-1 text-sm font-medium text-[var(--text)]">
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] disabled:opacity-50"
        aria-label="Add task"
      >
        + Add Task
      </button>
    </form>
  );
}
