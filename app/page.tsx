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
          <button
            onClick={() => setActiveTab("tasks")}
            className={`tab-button ${
              activeTab === "tasks"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-slate-800"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`tab-button ${
              activeTab === "schedule"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white text-slate-700 ring-1 ring-slate-200/80 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-slate-800"
            }`}
          >
            Schedule
          </button>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {activeTab === "tasks" ? "Prioritize and complete" : "Plan your day"}
        </p>
      </div>

      {!isReady ? (
        <div className="card-surface animate-pulse p-6 text-sm text-slate-500">
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
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{primary}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{description}</p>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 px-4 py-3 text-right text-white shadow-lg">
        <p className="text-sm font-medium">Snapshot</p>
        <p className="text-2xl font-bold">{accent}</p>
      </div>
    </div>
  );
}
