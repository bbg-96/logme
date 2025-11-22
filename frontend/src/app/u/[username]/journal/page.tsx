import Link from "next/link";

export default function UserJournalPage({ params }: { params: { username: string } }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Journal</p>
            <h1 className="text-2xl font-semibold text-slate-900">{params.username}&apos;s work log</h1>
          </div>
          <Link
            href={`/u/${params.username}/today`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Back to Today
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          This space is isolated for <span className="font-semibold text-slate-900">{params.username}</span>. Other users cannot view or
          edit these entries.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <p>
          Hook up your journal entry CRUD here by calling your authenticated APIs. Make sure each request includes the JWT cookie so
          the backend filters by <span className="font-semibold">user_id</span> and <span className="font-semibold">username</span>.
        </p>
      </section>
    </div>
  );
}
