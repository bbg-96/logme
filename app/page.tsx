"use client";

import { useMemo, useState } from "react";
import { Greeting } from "@/components/common/greeting";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { usePersistentState } from "@/components/hooks/use-persistent-state";
import { ScheduleForm } from "@/components/schedule/schedule-form";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { createId } from "@/lib/id";
import { ScheduleItem, Task } from "@/lib/types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule">("tasks");

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
        createdAt: new Date().toISOString(),
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
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const deleteSchedule = (id: string) => setSchedules((current) => current.filter((entry) => entry.id !== id));

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: tasks.length - completed,
      scheduleCount: schedules.length,
    };
  }, [schedules.length, tasks]);

  const tabClass = (tab: "tasks" | "schedule") =>
    `tab-button ${activeTab === tab ? "is-active" : ""} ${
      activeTab === tab ? "shadow-[0_10px_24px_var(--shadow-soft)]" : "hover:shadow-sm"
    }`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Greeting />
        <ThemeToggle />
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard label="Tasks" primary={stats.totalTasks} accent={stats.completedTasks} description="Created" />
        <SummaryCard label="Schedule" primary={stats.scheduleCount} accent={stats.pendingTasks} description="Upcoming" />
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
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {activeTab === "tasks" ? "Prioritize and complete" : "Plan your day"}
        </p>
      </div>

      {!isReady ? (
        <div className="card-surface animate-pulse p-6 text-sm text-[var(--text-muted)]">
          Loading your dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {activeTab === "tasks" ? (
            <>
              <div className="lg:col-span-1">
                <TaskForm onCreate={addTask} />
              </div>
              <div className="lg:col-span-2">
                <TaskList tasks={tasks} onToggleComplete={toggleTask} onDelete={deleteTask} />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-1">
                <ScheduleForm onCreate={addSchedule} />
              </div>
              <div className="lg:col-span-2">
                <ScheduleList schedules={schedules} onDelete={deleteSchedule} />
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  label,
  primary,
  accent,
  description,
}: {
  label: string;
  primary: number;
  accent: number;
  description: string;
}) {
  return (
    <div className="card-surface flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
        <p className="text-3xl font-bold text-[var(--text)]">{primary}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{description}</p>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-purple-300 via-blue-300 to-cyan-200 px-4 py-3 text-right text-slate-900 shadow-[0_12px_30px_var(--shadow-soft)] dark:from-indigo-500 dark:via-purple-500 dark:to-cyan-400 dark:text-white dark:shadow-[0_14px_32px_var(--shadow-strong)]">
        <p className="text-sm font-medium">Snapshot</p>
        <p className="text-2xl font-bold">{accent}</p>
      </div>
    </div>
  );
}
