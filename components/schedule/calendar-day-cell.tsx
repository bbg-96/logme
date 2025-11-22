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
        "group flex h-24 flex-col rounded-xl border p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[color:var(--color-border-subtle)]",
        !inCurrentMonth && "opacity-60",
        isSelected &&
          "border-indigo-400 bg-indigo-50 text-indigo-900 shadow-sm dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-50",
      )}
      aria-label={`View schedules for ${date.toDateString()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cx(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
              isSelected
                ? "bg-indigo-600 text-white"
                : "bg-[var(--color-bg-card)] text-[var(--color-text-primary)]",
              isToday && !isSelected && "ring-2 ring-indigo-400 ring-offset-2 ring-offset-[var(--color-bg-subtle)]",
            )}
          >
            {dayNumber}
          </span>
          {schedulesCount > 0 && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-100">
              {schedulesCount} item{schedulesCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {schedulesCount > 0 && (
          <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
        )}
      </div>

      {previewTitle && (
        <p className="mt-2 overflow-hidden text-ellipsis text-xs leading-snug text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]">
          {previewTitle}
        </p>
      )}
    </button>
  );
}
