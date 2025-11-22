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

  const filterTabClass = (key: string) =>
    `tab-button ${filter === key ? "is-active shadow-[0_10px_24px_var(--shadow-soft)]" : "hover:shadow-sm"}`;

  return (
    <div className="card-surface space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">Tasks</h2>
          <p className="text-sm text-[var(--text-muted)]">Sort, filter, and manage your personal to-dos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="input-field rounded-full px-4 py-2 text-xs font-semibold"
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
                className={filterTabClass(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredTasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[var(--card-muted)] p-6 text-center text-sm text-[var(--text-muted)]">
            No tasks found for this view.
          </div>
        )}

        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--card)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <input
                  id={`task-${task.id}`}
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="mt-1 h-5 w-5 rounded border-[color:var(--border)] text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-base font-semibold ${
                      task.completed ? "text-[var(--muted)] line-through" : "text-[var(--text)]"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                    <PriorityBadge priority={task.priority} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--card-muted)] px-2 py-1">
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

            {task.notes && <p className="rounded-xl bg-[var(--card-muted)] px-3 py-2 text-sm text-[var(--text)]">{task.notes}</p>}
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
