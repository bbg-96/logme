"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import { createJournalEntry, useJournalEntries } from "@/lib/journal-client";

const sampleNotes = [
  { title: "API checklist", tag: "Backend", detail: "Auth, logging, pagination" },
  { title: "Prompt patterns", tag: "AI", detail: "System + guardrails" },
  { title: "Deployment steps", tag: "Infra", detail: "Docker, Helm, K8s rollout" },
];

type SubmitState = "idle" | "submitting" | "error";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function NotesPage() {
  const { entries, setEntries, loadState, error } = useJournalEntries();

  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isReadonly = loadState === "unauthorized";

  const visibleNotes = useMemo(() => {
    if (isReadonly || entries.length === 0) {
      return sampleNotes;
    }

    return entries.map((entry) => ({
      title: entry.title || "Untitled note",
      tag: "Personal",
      detail: entry.content,
      createdAt: formatDate(entry.createdAt),
    }));
  }, [entries, isReadonly]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isReadonly) {
      setSubmitError("로그인 후에만 노트를 저장할 수 있어요.");
      return;
    }

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const entry = await createJournalEntry({ content });
      setEntries((prev) => [entry, ...prev]);
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
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <h1 className="text-2xl font-semibold text-slate-900">Reference library</h1>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {isReadonly ? "Sign in" : "Logged in"}
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          로그인 상태에서는 기존 Notes UI를 그대로 사용하면서 사용자별 노트를 불러오고 저장합니다. 로그인하지 않은 경우
          샘플 카드가 표시돼요.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Quick note</h2>
            <p className="text-xs text-slate-500">작성한 내용은 동일한 /api/journal 엔드포인트에 저장됩니다.</p>
          </div>
          {isReadonly && <span className="text-xs font-semibold text-amber-600">Sign in to save</span>}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            placeholder="Capture a thought or reminder"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
              {isReadonly ? "Sign in to save" : submitState === "submitting" ? "Saving..." : "Save note"}
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleNotes.map((note) => (
          <div
            key={`${note.title}-${note.detail}`}
            className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">{note.tag}</span>
              <span className="text-slate-500">{isReadonly ? "Pinned" : note.createdAt || "Private"}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line">{note.detail}</p>
            {!isReadonly && (
              <span className="mt-2 self-start rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
                Saved
              </span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
