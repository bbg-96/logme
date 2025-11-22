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

  const isTasksTab = activeTab === "tasks";
  const isScheduleTab = activeTab === "schedule";

  const layoutSpacing = isScheduleTab ? "gap-4 pt-6" : "gap-6 pt-8";

  return (
    <main
      className={`mx-auto flex min-h-screen w-full max-w-[1080px] flex-col ${layoutSpacing} px-4 pb-16 sm:px-6 lg:px-8`}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Greeting />
        <ThemeToggle />
      </header>

      <div
        className={`flex flex-col gap-3 transition-[background-color,box-shadow,padding] duration-200 ${
          isTasksTab
            ? "sticky top-0 z-30 -mx-4 px-4 pb-3 pt-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            : ""
        } ${isScheduleTab ? "gap-2.5" : ""}`}
        style={isTasksTab ? { backgroundColor: "var(--color-bg-page)" } : undefined}
      >
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SummaryCard label="Tasks" primary={stats.tasksRemaining} description="Incomplete" />
          <SummaryCard label="Schedule" primary={stats.scheduleCount} description="Upcoming" />
        </section>

        <div className="card-surface flex flex-wrap items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2">
            <button onClick={() => handleTabChange("tasks")} className={tabClass("tasks")}>
              Tasks
            </button>
            <button onClick={() => handleTabChange("schedule")} className={tabClass("schedule")}>
              Schedule
            </button>
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            {activeTab === "tasks" ? "Prioritize and complete" : "Plan your day"}
          </p>
        </div>
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
}: {
  label: string;
  primary: number;
  description: string;
}) {
  return (
    <div className="card-surface flex items-center justify-between p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="leading-tight">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
        <p className="text-3xl font-bold text-[var(--color-text-primary)]">{primary}</p>
      </div>
      <span className="rounded-full bg-[var(--color-bg-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {description}
      </span>
    </div>
  );
}
