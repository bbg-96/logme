"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useJournalEntries } from "@/lib/journal-client";

type GroupedEntries = Record<string, ReturnType<typeof useJournalEntries>["entries"]>;

export default function UserCalendarPage() {
  const { username } = useParams<{ username: string }>();

  const { entries, loadState, error } = useJournalEntries();

  const groupedByDate: GroupedEntries = useMemo(() => {
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
  }, [entries]);

  const renderEntries = () => {
    if (loadState === "loading") {
      return <p className="text-sm text-slate-500">Loading your calendar...</p>;
    }

    if (loadState === "error") {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (loadState === "unauthorized") {
      return <p className="text-sm text-rose-600">You must be signed in to view {username}&apos;s calendar.</p>;
    }

    if (entries.length === 0) {
      return <p className="text-sm text-slate-600">No journal activity yet. Add your first note to populate the calendar.</p>;
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
            <h1 className="text-2xl font-semibold text-slate-900">{username}&apos;s calendar</h1>
          </div>
          <Link
            href={`/u/${username}/today`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Back to Today
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Your journal entries are scoped to {username}. Every fetch goes through authenticated APIs that read <code>user_id</code>
          from the JWT cookie.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Activity by day</h2>
          <span className="text-xs text-slate-500">Latest 100 entries</span>
        </div>
        <div className="mt-4">{renderEntries()}</div>
      </section>
    </div>
  );
}
