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
      className="card-surface space-y-4 p-5 transition hover:-translate-y-0.5 hover:shadow-xl"
      aria-label="Create a new task"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Create Task</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add your next task with due date, priority, and optional notes.
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200">
          Stay organized
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Draft proposal, book dentist, ..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Due date
          <input
            required
            type="date"
            min={today}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Add context or next steps"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 dark:shadow-indigo-900/50 dark:focus-visible:ring-offset-slate-900"
        aria-label="Add task"
      >
        + Add Task
      </button>
    </form>
  );
}
