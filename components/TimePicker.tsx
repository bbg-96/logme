"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TimePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

type Period = "AM" | "PM";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

function formatDisplay(value: string | null) {
  if (!value) return "Time";
  const [hourStr, minuteStr] = value.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const period: Period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const label = period === "AM" ? "오전" : "오후";
  return `${label} ${hour12}:${minute.toString().padStart(2, "0")}`;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("AM");
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const displayValue = useMemo(() => formatDisplay(value), [value]);

  const syncFromValue = (val: string | null) => {
    if (!val) {
      setHour(null);
      setMinute(null);
      setPeriod("AM");
      return;
    }
    const [hourStr, minuteStr] = val.split(":");
    const parsedHour = Number(hourStr);
    const parsedMinute = Number(minuteStr);
    const isPM = parsedHour >= 12;
    const normalizedHour = parsedHour % 12 === 0 ? 12 : parsedHour % 12;
    setPeriod(isPM ? "PM" : "AM");
    setHour(normalizedHour);
    setMinute(parsedMinute);
  };

  const commitChange = (nextPeriod: Period, nextHour: number | null, nextMinute: number | null) => {
    if (nextHour == null || nextMinute == null) return;
    const baseHour = nextPeriod === "PM" ? (nextHour % 12) + 12 : nextHour % 12;
    const finalHour = baseHour === 24 ? 12 : baseHour;
    const formatted = `${finalHour.toString().padStart(2, "0")}:${nextMinute.toString().padStart(2, "0")}`;
    onChange(formatted);
  };

  const handleHourSelect = (h: number) => {
    setHour(h);
    commitChange(period, h, minute);
  };

  const handleMinuteSelect = (m: number) => {
    setMinute(m);
    commitChange(period, hour, m);
  };

  const handlePeriodSelect = (p: Period) => {
    setPeriod(p);
    commitChange(p, hour, minute);
  };

  const clear = () => {
    setHour(null);
    setMinute(null);
    setPeriod("AM");
    onChange(null);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => {
            const next = !prev;
            if (!prev) {
              syncFromValue(value);
            }
            return next;
          })
        }
        className="inline-flex w-28 items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-100 shadow-inner shadow-black/30 transition hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span className={value ? "text-slate-100" : "text-slate-500"}>{displayValue}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 text-slate-400"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-lg shadow-black/40">
          <div className="grid grid-cols-2 gap-2">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodSelect(p as Period)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  period === p
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {p === "AM" ? "오전" : "오후"}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1 rounded-lg bg-slate-800/70 p-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hour</p>
              <div className="grid grid-cols-3 gap-1">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={`rounded-md px-2 py-1 text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      hour === h ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    {h.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1 rounded-lg bg-slate-800/70 p-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Minute</p>
              <div className="grid grid-cols-3 gap-1">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    className={`rounded-md px-2 py-1 text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      minute === m ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{value ? formatDisplay(value) : "No time selected"}</span>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
