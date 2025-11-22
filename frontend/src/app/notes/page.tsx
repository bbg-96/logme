const notes = [
  { title: "API checklist", tag: "Backend", detail: "Auth, logging, pagination" },
  { title: "Prompt patterns", tag: "AI", detail: "System + guardrails" },
  { title: "Deployment steps", tag: "Infra", detail: "Docker, Helm, K8s rollout" },
];

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <h1 className="text-2xl font-semibold text-slate-900">Reference library</h1>
          </div>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Add note
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.title}
            className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">{note.tag}</span>
              <span className="text-slate-500">Pinned</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>
            <p className="text-sm text-slate-700">{note.detail}</p>
            <button className="mt-2 self-start rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
              Open
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
