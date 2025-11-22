const journalEntries = [
  { title: "API progress", date: "May 12", summary: "Finished core endpoints for auth" },
  { title: "UI sketch", date: "May 13", summary: "Iterated on Today layout and cards" },
  { title: "Infra notes", date: "May 14", summary: "Documented Kubernetes rollout plan" },
];

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Journal</p>
            <h1 className="text-2xl font-semibold text-slate-900">Work log</h1>
          </div>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            New entry
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {journalEntries.map((entry) => (
          <article
            key={entry.title}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.date}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{entry.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{entry.summary}</p>
            <div className="mt-4 flex gap-2 text-xs">
              <span className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                View
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                Edit
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
