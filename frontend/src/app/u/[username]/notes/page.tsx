import Link from "next/link";

export default function UserNotesPage({ params }: { params: { username: string } }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <h1 className="text-2xl font-semibold text-slate-900">{params.username}&apos;s notes</h1>
          </div>
          <Link
            href={`/u/${params.username}/today`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Back to Today
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Keep personal notes for {params.username}. These routes should always verify the JWT to prevent cross-user access.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <p>
          Wire your note editor here and ensure every API call uses the authenticated user_id before reading or writing rows in the
          database.
        </p>
      </section>
    </div>
  );
}
