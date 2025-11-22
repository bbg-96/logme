"use client";

import { useMemo, useState } from "react";

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

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
            <h1 className="text-2xl font-semibold text-slate-900">{todayLabel}</h1>
          </div>
          <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Live
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
      </section>
    </div>
  );
}
