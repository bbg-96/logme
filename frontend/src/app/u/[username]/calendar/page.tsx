"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserCalendarPage() {
  const { username } = useParams<{ username: string }>();

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
          This calendar is isolated to {username}. Align your events API to require the JWT cookie before reading or writing.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <p>
          Build your calendar UI here and route all fetches through authenticated endpoints that scope by <code>user_id</code> and
          <code>username</code> extracted from the JWT.
        </p>
      </section>
    </div>
  );
}
