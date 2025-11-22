"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function buildNavItems(pathname: string | null) {
  const userMatch = pathname?.match(/^\/u\/([^/]+)/);
  const username = userMatch?.[1];

  if (!username) {
    return [
      { label: "Today", href: "/" },
      { label: "Calendar", href: "/calendar" },
      { label: "Journal", href: "/journal" },
      { label: "Notes", href: "/notes" },
      { label: "AI Assistant", href: "/ai" },
    ];
  }

  return [
    { label: "Today", href: `/u/${username}/today` },
    { label: "Calendar", href: `/u/${username}/calendar` },
    { label: "Journal", href: `/u/${username}/journal` },
    { label: "Notes", href: `/u/${username}/notes` },
    { label: "AI Assistant", href: `/ai` },
  ];
}

function Sidebar() {
  const pathname = usePathname();
  const navItems = buildNavItems(pathname);

  return (
    <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-slate-200 bg-white px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">LogMe</div>
        <h1 className="text-xl font-bold text-slate-900">Workspace</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Today&apos;s focus</p>
        <p className="mt-1 text-slate-600">Keep your log up to date.</p>
      </div>
    </aside>
  );
}

function Header() {
  const pathname = usePathname();
  const userMatch = pathname?.match(/^\/u\/([^/]+)/);
  const username = userMatch?.[1];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h2 className="text-lg font-semibold text-slate-900">
          {username ? `${username}'s space` : "LogMe Overview"}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">v0.1 Preview</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          LM
        </div>
      </div>
    </header>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthPage) {
    return <main className="min-h-screen bg-slate-50 px-6 py-10">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 px-8 pb-12 pt-8">{children}</main>
      </div>
    </div>
  );
}
