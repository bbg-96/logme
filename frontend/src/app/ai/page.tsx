const messages = [
  { role: "user", text: "Summarize today&apos;s meetings" },
  { role: "assistant", text: "You met with the backend team and reviewed Q2 roadmap." },
  { role: "user", text: "Draft follow-up tasks" },
];

export default function AIPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI Assistant</p>
            <h1 className="text-2xl font-semibold text-slate-900">GPT workspace helper</h1>
          </div>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            New chat
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ring-1 ${
                  message.role === "assistant"
                    ? "border-slate-100 bg-slate-50 text-slate-800"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{message.role}</p>
                <p className="mt-1 leading-relaxed">{message.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-slate-900">Message</label>
            <textarea
              placeholder="Ask LogMe AI to help with your tasks"
              className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <div className="flex justify-end">
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Shortcuts</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="rounded-xl bg-slate-50 px-4 py-3">Summarize today&apos;s log</li>
            <li className="rounded-xl bg-slate-50 px-4 py-3">Generate next steps</li>
            <li className="rounded-xl bg-slate-50 px-4 py-3">Draft meeting notes</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
