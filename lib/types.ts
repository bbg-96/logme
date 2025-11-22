export type ScheduleItem = {
  id: string;
  time?: string; // HH:mm
  title: string;
  note?: string;
};

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  category?: "work" | "personal";
};

export type DayData = {
  schedules: ScheduleItem[];
  tasks: TaskItem[];
};

export type PlannerData = {
  [dateKey: string]: DayData;
};
