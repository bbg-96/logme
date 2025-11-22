import { PlannerData } from "./types";

const STORAGE_KEY = "plannerData_v1";

export const loadPlannerData = (): PlannerData => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PlannerData;
    return parsed || {};
  } catch (error) {
    console.error("Failed to load planner data", error);
    return {};
  }
};

export const savePlannerData = (data: PlannerData) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save planner data", error);
  }
};
