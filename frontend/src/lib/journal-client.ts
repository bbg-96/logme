"use client";

import { useCallback, useEffect, useState } from "react";

export type Entry = {
  id: number;
  title: string | null;
  content: string;
  createdAt: string;
};

type JournalResponse = {
  entries: Entry[];
  error?: string;
};

type CreateJournalResponse = {
  entry?: Entry;
  error?: string;
};

export type LoadState = "idle" | "loading" | "error" | "unauthorized";

export function useJournalEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadState("loading");
    setError(null);

    try {
      const response = await fetch("/api/journal", { cache: "no-store" });

      if (response.status === 401) {
        setEntries([]);
        setLoadState("unauthorized");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load entries");
      }

      const data: JournalResponse = await response.json();
      setEntries(data.entries);
      setLoadState("idle");
    } catch (err) {
      console.error("[journal-client] failed to load entries", err);
      setEntries([]);
      setLoadState("error");
      setError("Could not load your journal. Please try again.");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, setEntries, loadState, error, refresh };
}

export async function createJournalEntry(payload: {
  title?: string | null;
  content: string;
}) {
  const response = await fetch("/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: CreateJournalResponse = await response.json();

  if (!response.ok || !data.entry) {
    const errorMessage = data.error || (response.status === 401 ? "Unauthorized" : "Failed to save entry");
    throw new Error(errorMessage);
  }

  return data.entry;
}
