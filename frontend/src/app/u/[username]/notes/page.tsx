"use client";

import { FormEvent, useState } from "react";
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

export default function UserNotesPage() {
  const { username } = useParams<{ username: string }>();

  const { entries, setEntries, loadState, error: loadError } = useJournalEntries();
  const isReadonly = loadState === "unauthorized";

  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitError(null);

    if (isReadonly) {
      setSubmitState("error");
      setSubmitError("You must be signed in to save notes.");
      return;
    }

    try {
      const entry = await createJournalEntry({ content });
      setEntries((prev) => [entry, ...prev]);
      setContent("");
      setSubmitState("idle");
    } catch (err) {
      console.error("Failed to save note", err);
      setSubmitState("error");
      setSubmitError((err as Error).message || "Could not save note.");
    }
  };

  const renderNotes = () => {
    if (loadState === "loading") {
      return <p className="text-sm text-slate-500">Loading notes...</p>;
    }

    if (loadState === "error") {
      return <p className="text-sm text-rose-600">{loadError}</p>;
    }

    if (loadState === "unauthorized") {
      return <p className="text-sm text-rose-600">You must be signed in to view {username}&apos;s notes.</p>;
    }

    if (entries.length === 0) {
      return <p className="text-sm text-slate-600">No notes yet. Add your first thought below.</p>;
    }

    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(entry.createdAt)}</p>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Private</span>
            </div>
            {entry.title && <p className="mt-2 text-sm font-semibold text-slate-900">{entry.title}</p>}
            <p className="mt-1 whitespace-pre-line text-sm text-slate-800">{entry.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <h1 className="text-2xl font-semibold text-slate-900">{username}&apos;s notes</h1>
          </div>
          <Link
            href={`/u/${username}/today`}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Back to Today
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Keep personal notes for {username}. These routes should always verify the JWT to prevent cross-user access.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Quick note</h2>
          <span className="text-xs text-slate-500">Saved to your journal table</span>
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitState === "submitting" || isReadonly}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
            >
              {isReadonly ? "Sign in to save" : submitState === "submitting" ? "Saving..." : "Save note"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your notes</h2>
          <span className="text-xs text-slate-500">Newest first</span>
        </div>
        <div className="mt-4">{renderNotes()}</div>
      </section>
    </div>
  );
}
