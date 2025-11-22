"use client";

import { useMemo, useState } from "react";
import { Calendar } from "../components/Calendar";
import { DayDetail } from "../components/DayDetail";
import { TodaySummary } from "../components/TodaySummary";
import { WeeklySummary } from "../components/WeeklySummary";
import { formatDateKey } from "../lib/dateUtils";
import { loadPlannerData, savePlannerData } from "../lib/storage";
import { DayData, PlannerData, ScheduleItem, TaskItem } from "../lib/types";

const emptyDay: DayData = { schedules: [], tasks: [] };

export default function Home() {
  const [plannerData, setPlannerData] = useState<PlannerData>(() => loadPlannerData());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const selectedDayData = plannerData[selectedDateKey] || emptyDay;

  const persist = (updater: (prev: PlannerData) => PlannerData) => {
    setPlannerData((prev) => {
      const next = updater(prev);
      savePlannerData(next);
      return next;
    });
  };

  const getId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const ensureDay = (prev: PlannerData, dateKey: string): DayData =>
    prev[dateKey] || { schedules: [], tasks: [] };

  const handleAddSchedule = (item: Omit<ScheduleItem, "id">) => {
    persist((prev) => {
      const day = ensureDay(prev, selectedDateKey);
      const schedules = [...day.schedules, { ...item, id: getId() }].sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
      return {
        ...prev,
        [selectedDateKey]: { ...day, schedules },
      };
    });
  };

  const handleDeleteSchedule = (id: string) => {
    persist((prev) => {
      const day = ensureDay(prev, selectedDateKey);
      return {
        ...prev,
        [selectedDateKey]: {
          ...day,
          schedules: day.schedules.filter((item) => item.id !== id),
        },
      };
    });
  };

  const handleAddTask = (item: Omit<TaskItem, "id" | "done">) => {
    persist((prev) => {
      const day = ensureDay(prev, selectedDateKey);
      return {
        ...prev,
        [selectedDateKey]: {
          ...day,
          tasks: [...day.tasks, { ...item, id: getId(), done: false }],
        },
      };
    });
  };

  const handleToggleTask = (id: string) => {
    persist((prev) => {
      const day = ensureDay(prev, selectedDateKey);
      return {
        ...prev,
        [selectedDateKey]: {
          ...day,
          tasks: day.tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
          ),
        },
      };
    });
  };

  const handleDeleteTask = (id: string) => {
    persist((prev) => {
      const day = ensureDay(prev, selectedDateKey);
      return {
        ...prev,
        [selectedDateKey]: {
          ...day,
          tasks: day.tasks.filter((task) => task.id !== id),
        },
      };
    });
  };

  const handleSelectDate = (dateKey: string) => {
    setSelectedDate(new Date(dateKey));
  };

  return (
    <div className="space-y-6">
      <TodaySummary plannerData={plannerData} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            plannerData={plannerData}
          />
          <WeeklySummary plannerData={plannerData} />
        </div>

        <div className="lg:col-span-2">
          <DayDetail
            date={selectedDate}
            dayData={selectedDayData}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}
