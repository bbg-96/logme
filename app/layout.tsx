import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogMe | Personal Task & Schedule Dashboard",
  description:
    "A polished personal dashboard for managing tasks, schedules, and theme preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 antialiased dark:from-slate-950 dark:via-slate-950 dark:to-slate-900`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
