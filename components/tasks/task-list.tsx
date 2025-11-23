"use client";

import { ReactNode, useCallback, useMemo, useState } from "react";
import { parseLocalDateString, toLocalDateString } from "@/lib/date";
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
  onRequestCreate?: () => void;
  isFormOpen?: boolean;
  formContent?: ReactNode;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onRequestCreate,
  isFormOpen,
  formContent,
}: Props) {
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | "createdAt">("priority");
  const [filter, setFilter] = useState<"all" | "high" | "today" | "incomplete">("all");

  const today = toLocalDateString(new Date());

  const normalizeCreatedAt = useCallback((value: Task["createdAt"]) => {
    if (typeof value === "number") return value;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, []);

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
      return normalizeCreatedAt(a.createdAt) - normalizeCreatedAt(b.createdAt);
    });
  }, [filter, normalizeCreatedAt, sortBy, tasks, today]);

  const filterTabClass = (key: string) =>
    `tab-button ${filter === key ? "is-active shadow-[0_10px_24px_var(--color-shadow-soft)]" : "hover:shadow-sm"}`;

  return (
    <div className="card-surface space-y-3.5 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Tasks</h2>
        {onRequestCreate && (
          <button
            onClick={onRequestCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)] transition hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            + New Task
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="appearance-none rounded-full border border-gray-200 bg-white px-3 py-1.5 pr-8 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Sort tasks by"
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
            <option value="createdAt">Created</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
        </div>
      </div>

      {isFormOpen && formContent && (
        <div className="sticky top-0 z-10 -mx-4 -mt-1 bg-[var(--color-bg-card)] px-4 pb-2 pt-1">
          {formContent}
        </div>
      )}

      <div className={`grid grid-cols-1 gap-2.5 ${isFormOpen ? "max-h-[560px] overflow-y-auto pr-1" : ""}`}>
        {filteredTasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] p-6 text-center text-sm text-[var(--color-text-muted)]">
            No tasks found for this view.
          </div>
        )}

        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="flex flex-col gap-3 rounded-xl border border-[color:var(--color-border-subtle)] bg-[var(--color-list-surface)] px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)]"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <input
                  id={`task-${task.id}`}
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="h-5 w-5 rounded border-[color:var(--color-border-subtle)] text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-base font-semibold ${
                      task.completed ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-primary)]"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <PriorityBadge priority={task.priority} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-subtle)] px-2 py-1">
                      Due {parseLocalDateString(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
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
              <p className="rounded-xl bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-primary)]">{task.notes}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const classes: Record<Priority, string> = {
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${classes[priority]}`}>
      {priority === "high" && "⬆"}
      {priority === "medium" && "⬅"}
      {priority === "low" && "⬇"}
      {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
    </span>
  );
}
