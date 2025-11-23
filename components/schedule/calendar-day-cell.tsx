"use client";

interface DayCellProps {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  schedulesCount: number;
  onSelect: (date: Date) => void;
}

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function CalendarDayCell({
  date,
  inCurrentMonth,
  isToday,
  isSelected,
  schedulesCount,
  onSelect,
}: DayCellProps) {
  const dayNumber = date.getDate();

  return (
    <button
      onClick={() => onSelect(date)}
      className={cx(
        "group relative flex min-h-[5.1rem] w-full flex-col gap-2 rounded-xl border bg-[var(--color-bg-card)] p-2 text-left shadow-sm transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
        "hover:-translate-y-[3px] hover:shadow-md hover:bg-[var(--color-bg-subtle)] active:translate-y-[1px]",
        "border-[color:var(--color-border-subtle)] text-[var(--color-text-primary)] dark:text-slate-200",
        !inCurrentMonth && "opacity-50",
        isSelected &&
          "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-[0_10px_28px_rgba(99,102,241,0.18)] ring-1 ring-indigo-300/80 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-50 dark:ring-indigo-500/60",
        !isSelected &&
          isToday &&
          "border-indigo-300 text-indigo-700 ring-1 ring-indigo-200/80 dark:border-indigo-500/70 dark:text-indigo-100 dark:ring-indigo-600/40",
      )}
      aria-label={`View schedules for ${date.toDateString()}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-base font-semibold transition",
              "border-[color:var(--color-border-subtle)] bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] dark:text-slate-100",
              isSelected && "border-indigo-400 bg-indigo-500/10 text-indigo-700 dark:text-indigo-50",
              !isSelected && isToday && "border-indigo-200 text-indigo-700 dark:border-indigo-500/60 dark:text-indigo-100",
              !inCurrentMonth && "text-[var(--color-text-muted)] dark:text-slate-400",
            )}
          >
            {dayNumber}
          </span>

          {isToday && (
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-900/50 dark:text-indigo-100">
              Today
            </span>
          )}
        </div>

        {schedulesCount > 0 && (
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 shadow-sm transition group-hover:-translate-y-[1px] dark:bg-indigo-900/60 dark:text-indigo-100">
            {schedulesCount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-muted)] dark:text-slate-400">
        {schedulesCount === 0 && <span className="opacity-80">No events</span>}
        {Array.from({ length: Math.min(schedulesCount, 3) }).map((_, index) => (
          <span
            key={index}
            className="h-2 w-8 rounded-full bg-gradient-to-r from-indigo-400/80 via-indigo-500/80 to-indigo-600/80 shadow-[0_0_0_1px_rgba(255,255,255,0.3)] dark:from-indigo-300/90 dark:via-indigo-400/90 dark:to-indigo-500/90"
            aria-hidden
          />
        ))}

        {schedulesCount > 3 && (
          <span className="flex h-5 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-2 text-[10px] font-semibold text-indigo-700 shadow-sm dark:border-indigo-500/60 dark:bg-indigo-900/60 dark:text-indigo-100">
            +{schedulesCount - 3}
          </span>
        )}
      </div>
    </button>
  );
}
