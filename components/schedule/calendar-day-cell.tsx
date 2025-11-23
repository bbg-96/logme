"use client";

interface DayCellProps {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  schedulesCount: number;
  previewTitle?: string;
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
  previewTitle,
  onSelect,
}: DayCellProps) {
  const dayNumber = date.getDate();

  return (
    <button
      onClick={() => onSelect(date)}
      className={cx(
        "group relative mx-auto flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-2xl border p-1 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[rgba(148,163,184,0.25)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)] hover:bg-[var(--color-bg-card)]",
        !inCurrentMonth && "opacity-60",
        isToday && !isSelected && "ring-1 ring-indigo-400/50 ring-offset-2 ring-offset-[var(--color-bg-subtle)]",
        isSelected &&
          "border-indigo-300 bg-indigo-50 text-indigo-900 shadow-sm ring-1 ring-indigo-300/70 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-50 dark:ring-indigo-500/60",
      )}
      aria-label={`View schedules for ${date.toDateString()}`}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cx(
            "flex h-7 w-7 items-center justify-center rounded-lg text-sm font-medium",
            isSelected
              ? "bg-indigo-500 text-white text-sm font-semibold shadow"
              : "bg-white/80 text-[var(--color-text-primary)]",
            !inCurrentMonth && "text-[var(--color-text-muted)]",
          )}
        >
          {dayNumber}
        </span>

        <p
          className={cx(
            "max-w-[92%] overflow-hidden text-ellipsis text-center text-[9px] leading-none text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]",
            "h-3",
            !previewTitle && "opacity-0",
          )}
          aria-hidden={!previewTitle}
        >
          {previewTitle ?? "placeholder"}
        </p>
      </div>

      <div className="flex h-2 w-full items-center justify-center gap-1">
        {Array.from({ length: Math.min(schedulesCount, 3) }).map((_, index) => (
          <span
            key={index}
            className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_0_1px_var(--color-bg-card)]"
            aria-hidden
          />
        ))}
        {schedulesCount > 3 && (
          <span className="flex h-2 items-center rounded-full bg-indigo-100 px-1 text-[9px] font-semibold text-indigo-700 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-100">
            · {schedulesCount}
          </span>
        )}
      </div>
    </button>
  );
}
