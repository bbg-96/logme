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
        "group relative flex aspect-square flex-col items-center rounded-2xl border text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[color:var(--color-border-subtle)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)] hover:bg-[var(--color-bg-card)]",
        !inCurrentMonth && "opacity-60",
        isSelected &&
          "border-indigo-400 bg-indigo-50 text-indigo-900 shadow-sm dark:border-indigo-500 dark:bg-indigo-900/25 dark:text-indigo-50",
      )}
      aria-label={`View schedules for ${date.toDateString()}`}
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
        <span
          className={cx(
            "flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold",
            isSelected ? "bg-indigo-600 text-white" : "bg-[var(--color-bg-card)] text-[var(--color-text-primary)]",
            isToday && !isSelected && "ring-2 ring-indigo-400/70 ring-offset-2 ring-offset-[var(--color-bg-subtle)]",
          )}
        >
          {dayNumber}
        </span>

        {previewTitle && (
          <p className="max-w-[90%] overflow-hidden text-ellipsis text-center text-[11px] leading-snug text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]">
            {previewTitle}
          </p>
        )}
      </div>

      <div className="mt-auto flex w-full items-center justify-center gap-1 pb-2">
        {Array.from({ length: Math.min(schedulesCount, 3) }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_0_1px_var(--color-bg-card)]"
            aria-hidden
          />
        ))}
        {schedulesCount > 3 && (
          <span className="rounded-full bg-indigo-100 px-2 py-[2px] text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100">
            +{schedulesCount - 3}
          </span>
        )}
      </div>
    </button>
  );
}
