"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Sign up failed");
        return;
      }

      router.push(data.redirectTo ?? "/");
    } catch (err) {
      console.error("Signup failed", err);
      setError("Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LogMe</p>
        <h1 className="text-2xl font-semibold text-slate-900">Create your workspace</h1>
        <p className="text-sm text-slate-600">Each username becomes your private directory (e.g. /u/username/today).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
          <p className="text-xs text-slate-500">Your dashboard lives at /u/&lt;username&gt;/today</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
          <p className="text-xs text-slate-500">Minimum 8 characters; stored using bcrypt.</p>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <a className="font-semibold text-slate-900 underline" href="/login">
          Sign in
        </a>
      </p>
    </div>
  );
}
