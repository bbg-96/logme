"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type TimePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

type Period = "AM" | "PM";
type FocusColumn = "period" | "hour" | "minute";

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

function to24h(period: Period, hour: number, minute: number) {
  const baseHour = period === "PM" ? (hour % 12) + 12 : hour % 12;
  const finalHour = baseHour === 24 ? 12 : baseHour;
  return `${finalHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("AM");
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [focusColumn, setFocusColumn] = useState<FocusColumn>("period");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const periodRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hourRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const minuteRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  useEffect(() => {
    if (!open) return;
    const focusTarget =
      focusColumn === "hour"
        ? hourRefs.current[hour ? hours.indexOf(hour) : 0]
        : focusColumn === "minute"
          ? minuteRefs.current[minute ? minutes.indexOf(minute) : 0]
          : periodRefs.current[period === "AM" ? 0 : 1];
    requestAnimationFrame(() => {
      focusTarget?.focus();
      focusTarget?.scrollIntoView({ block: "nearest" });
    });
  }, [open, value, focusColumn, hour, minute, period]);

  const commitChange = (nextPeriod: Period, nextHour: number | null, nextMinute: number | null) => {
    if (nextHour == null || nextMinute == null) return;
    onChange(to24h(nextPeriod, nextHour, nextMinute));
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
    triggerRef.current?.focus();
    setOpen(false);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        syncFromValue(value);
        setFocusColumn(hour ? "hour" : minute ? "minute" : "period");
      }
      return next;
    });
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    const moveWithin = (items: number[], current: number | null, delta: number) => {
      const idx = current != null ? items.indexOf(current) : 0;
      const nextIdx = Math.min(Math.max(idx + delta, 0), items.length - 1);
      return items[nextIdx];
    };

    if (focusColumn === "period") {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const next = period === "AM" ? "PM" : "AM";
        handlePeriodSelect(next);
        const target = periodRefs.current[next === "AM" ? 0 : 1];
        target?.focus();
      } else if (e.key === "Tab" && !e.shiftKey) {
        setFocusColumn("hour");
      }
    } else if (focusColumn === "hour") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = moveWithin(hours, hour, 1);
        handleHourSelect(next);
        hourRefs.current[hours.indexOf(next)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = moveWithin(hours, hour, -1);
        handleHourSelect(next);
        hourRefs.current[hours.indexOf(next)]?.focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusColumn("minute");
        minuteRefs.current[minute ? minutes.indexOf(minute) : 0]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusColumn("period");
        periodRefs.current[period === "AM" ? 0 : 1]?.focus();
      }
    } else if (focusColumn === "minute") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = moveWithin(minutes, minute, 1);
        handleMinuteSelect(next);
        minuteRefs.current[minutes.indexOf(next)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = moveWithin(minutes, minute, -1);
        handleMinuteSelect(next);
        minuteRefs.current[minutes.indexOf(next)]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusColumn("hour");
        hourRefs.current[hour ? hours.indexOf(hour) : 0]?.focus();
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        className="inline-flex min-w-[9.5rem] items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-100 shadow-inner shadow-black/30 transition hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="dialog"
        aria-expanded={open}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !open) {
            e.preventDefault();
            handleToggle();
          }
        }}
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
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 min-w-[16rem] rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl shadow-black/40 backdrop-blur"
          role="dialog"
          aria-label="Time picker"
          onKeyDown={handleKeyNavigation}
        >
          <div className="flex gap-3 text-sm text-slate-100">
            <div className="w-20 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">오전/오후</p>
              <div
                role="listbox"
                aria-label="Period"
                className="flex flex-col rounded-xl bg-slate-900/70 ring-1 ring-slate-800"
              >
                {["AM", "PM"].map((p, idx) => (
                  <button
                    key={p}
                    ref={(el) => (periodRefs.current[idx] = el)}
                    role="option"
                    aria-selected={period === p}
                    onFocus={() => setFocusColumn("period")}
                    type="button"
                    onClick={() => handlePeriodSelect(p as Period)}
                    className={`flex items-center justify-between px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      period === p
                        ? "bg-indigo-600 text-white shadow-inner shadow-indigo-900/40"
                        : "text-slate-200 hover:bg-slate-800"
                    } ${idx === 0 ? "rounded-t-xl" : ""} ${idx === 1 ? "rounded-b-xl" : ""}`}
                  >
                    {p === "AM" ? "오전" : "오후"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">시간 선택</p>
              <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-inner shadow-black/30">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>시 (Hour)</span>
                    <span className="text-[10px] uppercase">Arrow keys to move</span>
                  </div>
                  <div
                    role="listbox"
                    aria-label="Hour"
                    className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1"
                  >
                    {hours.map((h, idx) => (
                      <button
                        key={h}
                        ref={(el) => (hourRefs.current[idx] = el)}
                        role="option"
                        aria-selected={hour === h}
                        type="button"
                        onFocus={() => setFocusColumn("hour")}
                        onClick={() => handleHourSelect(h)}
                        className={`rounded-lg px-3 py-2 text-center text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          hour === h
                            ? "bg-indigo-600 text-white shadow-inner shadow-indigo-900/40"
                            : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>분 (Minute)</span>
                    <span className="text-[10px] uppercase">Arrow keys to move</span>
                  </div>
                  <div
                    role="listbox"
                    aria-label="Minute"
                    className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1"
                  >
                    {minutes.map((m, idx) => (
                      <button
                        key={m}
                        ref={(el) => (minuteRefs.current[idx] = el)}
                        role="option"
                        aria-selected={minute === m}
                        type="button"
                        onFocus={() => setFocusColumn("minute")}
                        onClick={() => handleMinuteSelect(m)}
                        className={`rounded-lg px-3 py-2 text-center text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          minute === m
                            ? "bg-indigo-600 text-white shadow-inner shadow-indigo-900/40"
                            : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        {m.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
            <div className="flex flex-col text-xs text-slate-400">
              <span className="text-slate-300">{value ? formatDisplay(value) : "시간을 선택하세요"}</span>
              <span className="text-[10px] uppercase">Enter/Space to select, Esc to close</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={hour == null || minute == null}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
