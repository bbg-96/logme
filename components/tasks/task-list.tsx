"use client";

import { useMemo, useState } from "react";
import { Priority, Task } from "@/lib/types";

const priorityRank: Record<Priority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

interface Props {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete }: Props) {
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "createdAt">("priority");
  const [filter, setFilter] = useState<"all" | "high" | "today" | "incomplete">("all");

  const today = new Date().toISOString().slice(0, 10);

  const filteredTasks = useMemo(() => {
    const list = tasks.filter((task) => {
      if (filter === "high") return task.priority === "high";
      if (filter === "today") return task.dueDate === today;
      if (filter === "incomplete") return !task.completed;
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === "priority") {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }
      if (sortBy === "dueDate") return a.dueDate.localeCompare(b.dueDate);
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [filter, sortBy, tasks, today]);

  return (
    <div className="card-surface space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Tasks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sort, filter, and manage your personal to-dos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
          >
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due date</option>
            <option value="createdAt">Sort: Created</option>
          </select>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "high", label: "High" },
              { key: "today", label: "Due today" },
              { key: "incomplete", label: "Incomplete" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`tab-button border border-transparent ${
                  filter === item.key
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredTasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            No tasks found for this view.
          </div>
        )}

        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <input
                  id={`task-${task.id}`}
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-base font-semibold ${
                      task.completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-50"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <PriorityBadge priority={task.priority} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80">
                      Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    {task.completed && <span className="text-emerald-500">Completed</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDelete(task.id)}
                  className="rounded-full border border-transparent bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-500 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  Delete
                </button>
              </div>
            </div>

            {task.notes && (
              <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                {task.notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const classes: Record<Priority, string> = {
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${classes[priority]}`}>
      {priority === "high" && "⬆"}
      {priority === "medium" && "⬅"}
      {priority === "low" && "⬇"}
      {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
    </span>
  );
}
