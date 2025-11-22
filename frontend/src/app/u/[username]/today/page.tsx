"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { TodayPageShell } from "@/components/today/TodayPageShell";

type DbStatus = "checking" | "ok" | "error";
type EntryState = "loading" | "loaded" | "error";

type TodayEntry = {
  id: number;
  title: string | null;
  content: string;
  createdAt: string;
};

type TodayApiResponse = {
  entry: TodayEntry | null;
  error?: string;
};

type DbCheckResponse = {
  ok: boolean;
  error?: string;
};

export default function UserTodayPage() {
  const { username } = useParams<{ username: string }>();  // ✅ 여기서 username 확보

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");
  const [latestEntry, setLatestEntry] = useState<TodayEntry | null>(null);
  const [entryState, setEntryState] = useState<EntryState>("loading");
  const [entryError, setEntryError] = useState<string | null>(null);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await fetch("/api/db-check", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("DB check failed");
        }
        const data: DbCheckResponse = await response.json();
        setDbStatus(data.ok ? "ok" : "error");
      } catch (error) {
        console.error("Failed to check DB status", error);
        setDbStatus("error");
      }
    };

    fetchDbStatus();
  }, []);

  useEffect(() => {
    const fetchLatestEntry = async () => {
      setEntryState("loading");
      setEntryError(null);
      try {
        const response = await fetch("/api/today", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch latest entry");
        }

        const data: TodayApiResponse = await response.json();
        setLatestEntry(data.entry ?? null);
        setEntryState("loaded");
      } catch (error) {
        console.error("Failed to fetch latest log entry", error);
        setEntryError("Could not load your latest log. Please try again.");
        setEntryState("error");
      }
    };

    fetchLatestEntry();
  }, []);

  return (
    <TodayPageShell
      username={username ?? ""}
      todayLabel={todayLabel}
      selectedMood={selectedMood}
      setSelectedMood={setSelectedMood}
      dbStatus={dbStatus}
      latestEntry={latestEntry}
      entryState={entryState}
      entryError={entryError}
    />
  );
}
