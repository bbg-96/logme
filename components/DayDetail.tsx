"use client";

import { useMemo, useState } from "react";
import { formatDateKey } from "../lib/dateUtils";
import { DayData, ScheduleItem, TaskItem } from "../lib/types";

type Props = {
  date: Date;
  dayData: DayData;
  onAddSchedule: (item: Omit<ScheduleItem, "id">) => void;
  onDeleteSchedule: (id: string) => void;
  onAddTask: (item: Omit<TaskItem, "id" | "done">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function DayDetail({
  date,
  dayData,
  onAddSchedule,
  onDeleteSchedule,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: Props) {
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<"work" | "personal">("work");

  const sortedSchedules = useMemo(() => {
    return [...dayData.schedules].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  }, [dayData.schedules]);

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle.trim()) return;
    onAddSchedule({ title: scheduleTitle.trim(), time: scheduleTime || undefined, note: scheduleNote || undefined });
    setScheduleTitle("");
    setScheduleTime("");
    setScheduleNote("");
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask({ title: taskTitle.trim(), category: taskCategory });
    setTaskTitle("");
  };

  return (
    <div className="rounded-2xl bg-slate-900/70 p-6 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Selected Date</p>
          <h2 className="text-2xl font-semibold text-slate-100">{dateLabel}</h2>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-indigo-500/40">
          {formatDateKey(date)}
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Schedule</h3>
            <span className="text-sm text-slate-400">{sortedSchedules.length} items</span>
          </div>
          <form onSubmit={handleScheduleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-28 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-black/30 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Meeting with team"
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-100 shadow-inner shadow-black/30 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-100 shadow-inner shadow-black/30 focus:border-indigo-500 focus:outline-none"
              rows={2}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900 transition hover:bg-indigo-500"
            >
              Add Schedule
            </button>
          </form>

          <div className="space-y-3">
            {sortedSchedules.length === 0 && (
              <p className="text-sm text-slate-400">No schedule items yet.</p>
            )}
            {sortedSchedules.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-800/80 p-3 shadow-inner shadow-black/30"
              >
                <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-indigo-200 ring-1 ring-indigo-500/30">
                  {item.time || "All day"}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-100">{item.title}</p>
                      {item.note && <p className="text-sm text-slate-400">{item.note}</p>}
                    </div>
                    <button
                      onClick={() => onDeleteSchedule(item.id)}
                      className="text-sm text-slate-400 transition hover:text-rose-400"
                      aria-label="Delete schedule"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Tasks</h3>
            <span className="text-sm text-slate-400">{dayData.tasks.length} tasks</span>
          </div>
          <form onSubmit={handleTaskSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Finish project draft"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-100 shadow-inner shadow-black/30 focus:border-indigo-500 focus:outline-none"
              required
            />
            <div className="flex gap-3">
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as "work" | "personal")}
                className="w-36 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-black/30 focus:border-indigo-500 focus:outline-none"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900 transition hover:bg-indigo-500"
              >
                Add Task
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {dayData.tasks.length === 0 && <p className="text-sm text-slate-400">No tasks yet.</p>}
            {dayData.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-800/80 p-3 shadow-inner shadow-black/30"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.id)}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                  />
                  <div>
                    <p className={`font-semibold text-slate-100 ${task.done ? "line-through text-slate-500" : ""}`}>
                      {task.title}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        task.category === "work"
                          ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/30"
                          : "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30"
                      }`}
                    >
                      {task.category || "General"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-sm text-slate-400 transition hover:text-rose-400"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
