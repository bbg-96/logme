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
  const [activeForm, setActiveForm] = useState<null | "task" | "schedule">(null);

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

  const closeForm = () => setActiveForm(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeForm();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleTabChange = (tab: "tasks" | "schedule") => {
    setActiveForm(null);
    setActiveTab(tab);
  };

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

  const isSchedule = activeTab === "schedule";

  return (
    <main
      className={`mx-auto flex min-h-screen w-full max-w-[1080px] flex-col px-4 pb-16 sm:px-6 lg:px-8 ${
        isSchedule ? "gap-4 pt-5" : "gap-6 pt-8"
      }`}
    >
      <header
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
          isSchedule ? "gap-2" : "gap-4"
        }`}
      >
        <Greeting compact={isSchedule} />
        <ThemeToggle />
      </header>

      <section className={`grid grid-cols-1 sm:grid-cols-2 ${isSchedule ? "gap-2.5" : "gap-3"}`}>
        <SummaryCard
          label="Tasks"
          primary={stats.tasksRemaining}
          description="Incomplete"
          compact={isSchedule}
        />
        <SummaryCard
          label="Schedule"
          primary={stats.scheduleCount}
          description="Upcoming"
          compact={isSchedule}
        />
      </section>

      <div
        className={`card-surface flex flex-wrap items-center justify-between ${
          isSchedule ? "gap-2 px-3 py-1.5" : "gap-3 px-3 py-2"
        }`}
      >
        <div className={`flex items-center ${isSchedule ? "gap-1.5" : "gap-2"}`}>
          <button onClick={() => handleTabChange("tasks")} className={tabClass("tasks")}>
            Tasks
          </button>
          <button onClick={() => handleTabChange("schedule")} className={tabClass("schedule")}>
            Schedule
          </button>
        </div>
        <p
          className={`font-medium uppercase tracking-wide text-[var(--color-text-muted)] ${
            isSchedule ? "text-[11px]" : "text-xs"
          }`}
        >
          {activeTab === "tasks" ? "Prioritize and complete" : "Plan your day"}
        </p>
      </div>

      {!isReady ? (
        <div className="card-surface animate-pulse p-6 text-sm text-[var(--color-text-muted)]">
          Loading your dashboard...
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "tasks" ? (
            <>
              <div
                className={`grid grid-cols-1 gap-4 transition-all duration-200 ${
                  activeForm === "task" ? "scale-[0.99] -translate-y-0.5" : "scale-100 translate-y-0"
                }`}
                aria-expanded={activeForm === "task"}
              >
                <TaskList
                  tasks={tasks}
                  onToggleComplete={toggleTask}
                  onDelete={deleteTask}
                  onRequestCreate={() => setActiveForm("task")}
                  isFormOpen={activeForm === "task"}
                  formContent={<TaskForm onCreate={addTask} onClose={closeForm} />}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-4 transition-all duration-200 ${
                  activeForm === "schedule" ? "scale-[0.99] -translate-y-0.5" : "scale-100 translate-y-0"
                }`}
                aria-expanded={activeForm === "schedule"}
              >
                <ScheduleCalendar
                  schedules={schedules}
                  onDelete={deleteSchedule}
                  onRequestCreate={() => setActiveForm("schedule")}
                  isFormOpen={activeForm === "schedule"}
                  formContent={<ScheduleForm onCreate={addSchedule} onClose={closeForm} />}
                />
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
  description,
  compact = false,
}: {
  label: string;
  primary: number;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`card-surface flex items-center justify-between shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${
        compact ? "p-3" : "p-3.5"
      }`}
    >
      <div className="leading-tight">
        <p
          className={
            compact
              ? "text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
              : "text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
          }
        >
          {label}
        </p>
        <p className={compact ? "text-2xl font-bold text-[var(--color-text-primary)]" : "text-3xl font-bold text-[var(--color-text-primary)]"}>
          {primary}
        </p>
      </div>
      <span
        className={`rounded-full bg-[var(--color-bg-subtle)] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] ${
          compact ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]"
        }`}
      >
        {description}
      </span>
    </div>
  );
}
