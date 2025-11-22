export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  notes?: string;
  completed: boolean;
  createdAt: number | string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: number | string;
}
