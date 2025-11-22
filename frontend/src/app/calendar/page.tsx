"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useJournalEntries } from "@/lib/journal-client";

const sampleMeetings = [
  { date: "May 14", title: "Backend sync", detail: "Service contracts" },
  { date: "May 16", title: "Design review", detail: "Dashboard layout" },
  { date: "May 18", title: "Planning", detail: "Sprint scope" },
];

type GroupedEntries = Record<
  string,
  ReturnType<typeof useJournalEntries>["entries"]
>;

export default function CalendarPage() {
  const { entries, loadState, error } = useJournalEntries();
  const isReadonly = loadState === "unauthorized";

  const groupedByDate: GroupedEntries = useMemo(() => {
    if (isReadonly) {
      return {};
    }

    return entries.reduce<GroupedEntries>((acc, entry) => {
      const dateKey = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(entry.createdAt));

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(entry);
      return acc;
    }, {});
  }, [entries, isReadonly]);

  const renderEntries = () => {
    if (loadState === "loading") {
      return <p className="text-sm text-slate-500">Loading your calendar...</p>;
    }

    if (loadState === "error") {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (isReadonly || entries.length === 0) {
      return (
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {sampleMeetings.map((item) => (
            <li
              key={item.title}
              className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.date}</p>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p>{item.detail}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                {isReadonly ? "Example" : "Hold"}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, dateEntries]) => (
          <div key={date} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{date}</p>
              <span className="text-xs font-semibold text-slate-500">{dateEntries.length} entr{dateEntries.length === 1 ? "y" : "ies"}</span>
            </div>
            <div className="mt-3 space-y-3">
              {dateEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  {entry.title && <p className="text-sm font-semibold text-slate-900">{entry.title}</p>}
                  <p className="mt-1 text-sm text-slate-700 line-clamp-3">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calendar</p>
            <h1 className="text-2xl font-semibold text-slate-900">Schedule overview</h1>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {isReadonly ? "Sign in" : "Logged in"}
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          로그인하면 동일한 Calendar UI에서 내 저널 데이터를 날짜별로 묶어 확인할 수 있어요. 비로그인 상태에서는 샘플 일정이
          보여집니다.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming events</h2>
          {renderEntries()}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Quick planner</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-500">Focus</p>
              <p className="mt-1 font-semibold text-slate-900">Deep work blocks</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-500">Meetings</p>
              <p className="mt-1 font-semibold text-slate-900">Limit to 2/day</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-500">Reminders</p>
              <p className="mt-1 font-semibold text-slate-900">Send prep notes</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-500">Next sprint</p>
              <p className="mt-1 font-semibold text-slate-900">Finalize backlog</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
