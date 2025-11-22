export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LogMe</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome to LogMe</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Log in or sign up to access your user-specific dashboard. Every workspace lives under /u/&lt;username&gt;/..., fully isolated by
          JWT-authenticated routes and PostgreSQL rows scoped to your user.
        </p>
        <div className="mt-6 flex gap-3">
          <a className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800" href="/login">
            Sign in
          </a>
          <a className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300" href="/signup">
            Create account
          </a>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Sign up to create a JWT-backed session stored in an HttpOnly cookie.</li>
          <li>Get redirected to /u/&lt;username&gt;/today where all data loads with your user_id.</li>
          <li>APIs validate the cookie and forbid access to other users&apos; directories.</li>
        </ul>
"use client";

import { useEffect, useMemo, useState } from "react";

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

const moods = [
  { label: "Great", emoji: "😄" },
  { label: "Good", emoji: "😊" },
  { label: "Neutral", emoji: "😐" },
  { label: "Tired", emoji: "😴" },
  { label: "Stressed", emoji: "😣" },
];

const scheduleItems = [
  { time: "09:00", title: "Daily standup", description: "Team sync" },
  { time: "11:00", title: "Client review", description: "Review Q2 updates" },
  { time: "14:00", title: "Feature design", description: "LogMe calendar UX" },
  { time: "16:30", title: "Wrap-up notes", description: "Summarize today" },
];

const statusStyles: Record<DbStatus, { bg: string; text: string; label: string }> = {
  checking: {
    label: "Checking DB",
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  ok: {
    label: "DB Connected",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  error: {
    label: "DB Unavailable",
    bg: "bg-rose-100",
    text: "text-rose-700",
  },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function Home() {
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
    []
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

  const renderLatestEntry = () => {
    if (entryState === "loading") {
      return <p className="text-sm text-slate-500">Loading latest log...</p>;
    }

    if (entryState === "error") {
      return <p className="text-sm text-rose-600">{entryError}</p>;
    }

    if (!latestEntry) {
      return <p className="text-sm text-slate-600">아직 저장된 로그가 없습니다.</p>;
    }

    return (
      <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent log</p>
          <span className="text-xs font-medium text-slate-500">{formatDate(latestEntry.createdAt)}</span>
        </div>
        {latestEntry.title && <p className="text-base font-semibold text-slate-900">{latestEntry.title}</p>}
        <p className="whitespace-pre-line text-sm text-slate-700">{latestEntry.content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
            <h1 className="text-2xl font-semibold text-slate-900">{todayLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Live</div>
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${statusStyles[dbStatus].bg} ${statusStyles[dbStatus].text}`}
            >
              {statusStyles[dbStatus].label}
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">How are you feeling?</h2>
            <span className="text-xs text-slate-500">Tap to set your mood</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {moods.map((mood) => {
              const isActive = selectedMood === mood.label;
              return (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white shadow"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  {mood.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Today&apos;s schedule</h2>
            <span className="text-xs text-slate-500">4 items</span>
          </div>
          <div className="mt-4 space-y-4">
            {scheduleItems.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
              >
                <div className="min-w-[64px] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-slate-100">
                  {item.time}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest work log</h2>
            <span className="text-xs text-slate-500">Auto-refresh on load</span>
          </div>
          {renderLatestEntry()}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Today&apos;s log</h2>
            <span className="text-xs text-slate-500">Quick note</span>
          </div>
          <textarea
            placeholder="What did you work on today?"
            className="mt-4 h-48 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <div className="mt-3 flex justify-end">
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
              Save draft
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
            <span className="text-xs text-slate-500">Today</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="rounded-lg bg-slate-50 px-4 py-3">Ship API contract for journal-service</li>
            <li className="rounded-lg bg-slate-50 px-4 py-3">Draft AI assistant prompt flows</li>
            <li className="rounded-lg bg-slate-50 px-4 py-3">Align calendar sync with backend</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">How you feel</h2>
            <span className="text-xs text-slate-500">Mood selection</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-slate-50 px-4 py-3">
              Use the mood buttons above to log how you&apos;re doing today. It helps keep a light-weight record alongside your work
              logs.
            </p>
            {selectedMood ? (
              <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
                You marked today as <span className="font-semibold">{selectedMood}</span>.
              </p>
            ) : (
              <p className="rounded-lg bg-amber-50 px-4 py-3 text-amber-700">No mood selected yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
