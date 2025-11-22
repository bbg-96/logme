export default function CalendarPage() {
  const meetings = [
    { date: "May 14", title: "Backend sync", detail: "Service contracts" },
    { date: "May 16", title: "Design review", detail: "Dashboard layout" },
    { date: "May 18", title: "Planning", detail: "Sprint scope" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calendar</p>
            <h1 className="text-2xl font-semibold text-slate-900">Schedule overview</h1>
          </div>
          <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Month
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming events</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {meetings.map((item) => (
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
                  Hold
                </span>
              </li>
            ))}
          </ul>
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
