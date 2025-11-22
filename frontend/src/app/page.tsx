export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">LogMe</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome to LogMe</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Log in or sign up to access your user-specific dashboard. Every workspace lives under /u/&lt;username&gt;/..., fully isolated by
          JWT-authenticated routes and PostgreSQL rows scoped to your user.
        </p>
        <div className="mt-6 flex gap-3">
          <a className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800" href="/login">
            Sign in
          </a>
          <a className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300" href="/signup">
            Create account
          </a>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Sign up to create a JWT-backed session stored in an HttpOnly cookie.</li>
          <li>Get redirected to /u/&lt;username&gt;/today where all data loads with your user_id.</li>
          <li>APIs validate the cookie and forbid access to other users&apos; directories.</li>
        </ul>
      </section>
    </div>
  );
}
