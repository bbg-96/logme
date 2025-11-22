"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import { createJournalEntry, useJournalEntries } from "@/lib/journal-client";

const sampleEntries = [
  { title: "API progress", date: "May 12", summary: "Finished core endpoints for auth" },
  { title: "UI sketch", date: "May 13", summary: "Iterated on Today layout and cards" },
  { title: "Infra notes", date: "May 14", summary: "Documented Kubernetes rollout plan" },
];

type SubmitState = "idle" | "submitting" | "error";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function JournalPage() {
  const { entries, setEntries, loadState, error } = useJournalEntries();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isReadonly = loadState === "unauthorized";

  const visibleEntries = useMemo(() => {
    if (isReadonly || entries.length === 0) {
      return sampleEntries;
    }

    return entries.map((entry) => ({
      title: entry.title || "Untitled entry",
      date: formatDate(entry.createdAt),
      summary: entry.content,
    }));
  }, [entries, isReadonly]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isReadonly) {
      setSubmitError("로그인 후에만 새 일지를 저장할 수 있어요.");
      return;
    }

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const entry = await createJournalEntry({ title, content });
      setEntries((prev) => [entry, ...prev]);
      setTitle("");
      setContent("");
      setSubmitState("idle");
    } catch (err) {
      setSubmitState("error");
      setSubmitError((err as Error).message || "저장에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Journal</p>
            <h1 className="text-2xl font-semibold text-slate-900">Work log</h1>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {isReadonly ? "Sign in" : "Logged in"}
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          동일한 UI로 로그인 후에도 바로 일지를 작성·저장할 수 있게 했어요. 로그인하지 않은 상태에서는 샘플 카드만
          보여집니다.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add a new entry</h2>
            <p className="text-xs text-slate-500">
              로그인하면 작성한 내용이 /api/journal을 통해 사용자별로 저장돼요.
            </p>
          </div>
          {isReadonly && <span className="text-xs font-semibold text-amber-600">Sign in to save</span>}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            disabled={isReadonly}
          />
          <textarea
            placeholder="What did you work on?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
            disabled={isReadonly}
          />
          {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
          {loadState === "error" && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitState === "submitting" || isReadonly}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isReadonly ? "Sign in to save" : submitState === "submitting" ? "Saving..." : "Save entry"}
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleEntries.map((entry) => (
          <article
            key={`${entry.title}-${entry.date}`}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.date}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{entry.title}</h3>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{entry.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
