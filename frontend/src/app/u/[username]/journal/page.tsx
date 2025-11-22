"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { createJournalEntry, useJournalEntries } from "@/lib/journal-client";

type SubmitState = "idle" | "submitting" | "error";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function UserJournalPage() {
  const { username } = useParams<{ username: string }>();

  const { entries, setEntries, loadState, error: loadError } = useJournalEntries();
  const isReadonly = loadState === "unauthorized";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalEntries = useMemo(() => entries.length, [entries]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitError(null);

    if (isReadonly) {
      setSubmitState("error");
      setSubmitError("You must be signed in to save entries.");
      return;
    }

    try {
      const entry = await createJournalEntry({ title, content });
      setEntries((prev) => [entry, ...prev]);
      setTitle("");
      setContent("");
      setSubmitState("idle");
    } catch (err) {
      console.error("Failed to create journal entry", err);
      setSubmitError((err as Error).message || "Could not save entry.");
      setSubmitState("error");
    }
  };

  const renderEntries = () => {
    if (loadState === "loading") {
      return <p className="text-sm text-slate-500">Loading entries...</p>;
    }

    if (loadState === "error") {
      return <p className="text-sm text-rose-600">{loadError}</p>;
    }

    if (loadState === "unauthorized") {
      return (
        <p className="text-sm text-rose-600">
          You must be signed in to view {username}&apos;s journal entries.
        </p>
      );
    }

    if (entries.length === 0) {
      return <p className="text-sm text-slate-600">No journal entries yet. Add your first log below.</p>;
    }

    return (
      <div className="space-y-3">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(entry.createdAt)}</p>
              {entry.title && <span className="text-xs font-semibold text-slate-900">{entry.title}</span>}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{entry.content}</p>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Journal</p>
            <h1 className="text-2xl font-semibold text-slate-900">{username}&apos;s work log</h1>
          </div>
          <Link
            href={`/u/${username}/today`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Back to Today
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          This space is isolated for <span className="font-semibold text-slate-900">{username}</span>. Other users cannot view or
          edit these entries.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add a new entry</h2>
            <p className="text-xs text-slate-500">Entries are saved with your authenticated user_id via the JWT cookie.</p>
          </div>
          <span className="text-xs font-semibold text-slate-600">{totalEntries} total</span>
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitState === "submitting" || isReadonly}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
            >
              {isReadonly ? "Sign in to save" : submitState === "submitting" ? "Saving..." : "Save entry"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent entries</h2>
          <span className="text-xs text-slate-500">Newest first</span>
        </div>
        <div className="mt-4">{renderEntries()}</div>
      </section>
    </div>
  );
}
