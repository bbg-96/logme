"use client";

import { useEffect, useMemo, useState } from "react";
import { Greeting } from "@/components/common/greeting";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { usePersistentState } from "@/components/hooks/use-persistent-state";
import { ScheduleForm } from "@/components/schedule/schedule-form";
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { createId } from "@/lib/id";
import { ScheduleItem, Task } from "@/lib/types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule">("tasks");
  const [overlay, setOverlay] = useState<null | "task" | "schedule">(null);

  const {
    value: tasks,
    setValue: setTasks,
    hydrated: tasksReady,
  } = usePersistentState<Task[]>("logme-tasks", []);

  const {
    value: schedules,
    setValue: setSchedules,
    hydrated: schedulesReady,
  } = usePersistentState<ScheduleItem[]>("logme-schedules", []);

  const isReady = tasksReady && schedulesReady;

  const addTask = (input: Omit<Task, "id" | "createdAt" | "completed">) => {
    setTasks((current) => [
      ...current,
      {
        ...input,
        id: createId(),
        createdAt: Date.now(),
        completed: false,
      },
    ]);
  };

  const toggleTask = (id: string) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));

  const deleteTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id));

  const addSchedule = (input: Omit<ScheduleItem, "id" | "createdAt">) => {
    setSchedules((current) => [
      ...current,
      {
        ...input,
        id: createId(),
        createdAt: Date.now(),
      },
    ]);
  };

  const deleteSchedule = (id: string) => setSchedules((current) => current.filter((entry) => entry.id !== id));

  const closeOverlay = () => setOverlay(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const stats = useMemo(() => {
    const incompleteTasks = tasks.filter((task) => !task.completed).length;
    return {
      tasksRemaining: incompleteTasks,
      scheduleCount: schedules.length,
    };
  }, [schedules.length, tasks]);

  const tabClass = (tab: "tasks" | "schedule") =>
    `tab-button ${activeTab === tab ? "is-active" : ""} ${
      activeTab === tab ? "shadow-[0_10px_24px_var(--color-shadow-soft)]" : "hover:shadow-sm"
    }`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Greeting />
        <ThemeToggle />
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard label="Tasks" primary={stats.tasksRemaining} description="Incomplete" />
        <SummaryCard label="Schedule" primary={stats.scheduleCount} description="Upcoming" />
      </section>

      <div className="card-surface flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab("tasks")} className={tabClass("tasks")}>
            Tasks
          </button>
          <button onClick={() => setActiveTab("schedule")} className={tabClass("schedule")}>
            Schedule
          </button>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          {activeTab === "tasks" ? "Prioritize and complete" : "Plan your day"}
        </p>
      </div>

      {!isReady ? (
        <div className="card-surface animate-pulse p-6 text-sm text-[var(--color-text-muted)]">
          Loading your dashboard...
        </div>
      ) : (
        <div className="relative">
          <div
            className={`grid grid-cols-1 gap-4 transition-all duration-300 ${
              overlay ? "scale-95 opacity-90 blur-[1px]" : "scale-100 opacity-100"
            }`}
            aria-hidden={Boolean(overlay)}
          >
            {activeTab === "tasks" ? (
              <TaskList
                tasks={tasks}
                onToggleComplete={toggleTask}
                onDelete={deleteTask}
                onRequestCreate={() => setOverlay("task")}
              />
            ) : (
              <ScheduleCalendar
                schedules={schedules}
                onDelete={deleteSchedule}
                onRequestCreate={() => setOverlay("schedule")}
              />
            )}
          </div>

          {overlay && (
            <div
              className="fixed inset-0 z-40 flex items-start justify-center bg-[color:var(--color-bg-page)]/70 px-4 py-10 backdrop-blur-md"
              onClick={closeOverlay}
            >
              <div
                className="relative z-10 w-full max-w-2xl animate-[fadeIn_200ms_ease-out] drop-shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="absolute -right-3 -top-3">
                  <button
                    onClick={closeOverlay}
                    className="rounded-full bg-[var(--color-bg-card)] px-3 py-1 text-sm font-semibold text-[var(--color-text-primary)] shadow-md transition hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                    aria-label="Close form overlay"
                  >
                    ×
                  </button>
                </div>
                {overlay === "task" ? <TaskForm onCreate={addTask} /> : <ScheduleForm onCreate={addSchedule} />}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  primary,
  description,
}: {
  label: string;
  primary: number;
  description: string;
}) {
  return (
    <div className="card-surface flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
        <p className="text-3xl font-bold text-[var(--color-text-primary)]">{primary}</p>
      </div>
      <span className="rounded-full bg-[var(--color-bg-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {description}
      </span>
    </div>
  );
}
