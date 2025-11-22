"use client";

import Link from "next/link";

const howItWorksItems = [
  "Sign up to create a JWT-backed session stored in an HttpOnly cookie.",
  "Get redirected to /u/<username>/today where all data loads with your user_id.",
  "APIs validate the cookie and forbid access to other users' directories.",
];

export default function Home() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          LogMe
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Welcome to LogMe
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Log in or sign up to access your user-specific dashboard. Every
          workspace lives under <code className="font-mono">/u/&lt;username&gt;/...</code>,
          fully isolated by JWT-authenticated routes and PostgreSQL rows scoped
          to your user.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {howItWorksItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
