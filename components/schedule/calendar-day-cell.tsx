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
        // 셀: 세로가 살짝 더 긴 직사각형
        "group relative mx-auto flex h-[4.0rem] w-[4.4rem] flex-col items-center justify-between overflow-hidden rounded-2xl border p-1 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        // 기본 배경/테두리
        "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[rgba(148,163,184,0.25)] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--color-shadow-soft)] hover:bg-[var(--color-bg-card)]",
        !inCurrentMonth && "opacity-60",
        isToday &&
          !isSelected &&
          "ring-1 ring-indigo-400/50 ring-offset-2 ring-offset-[var(--color-bg-subtle)]",
        isSelected &&
          "border-indigo-300 bg-indigo-50 text-indigo-900 shadow-sm ring-1 ring-indigo-300/70 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-50 dark:ring-indigo-500/60",
      )}
      aria-label={`View schedules for ${date.toDateString()}`}
    >
      {/* 위쪽: 날짜 뱃지 - 셀 상단에서 약간 떨어진 위치 */}
      <div className="mt-[0.1rem] flex flex-col items-center">
        <span
          className={cx(
            "flex h-7 w-7 items-center justify-center rounded-lg text-sm font-medium",
            isSelected
              ? "bg-indigo-500 text-white shadow"
              : "bg-white/80 text-[var(--color-text-primary)]",
            !inCurrentMonth && "text-[var(--color-text-muted)]",
          )}
        >
          {dayNumber}
        </span>
      </div>

      {/* 아래쪽: 도트 + 추가 개수 인디케이터 */}
      <div className="mb-[0.01rem] flex items-center gap-1">
        {Array.from({ length: Math.min(schedulesCount, 3) }).map((_, index) => (
          <span
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_0_1px_var(--color-bg-card)]"
            aria-hidden
          />
        ))}

        {schedulesCount > 3 && (
          <span className="flex h-4 items-center justify-center rounded-full bg-indigo-100 px-2 text-[10px] font-semibold text-indigo-700 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-100">
            {schedulesCount}
          </span>
        )}
      </div>
    </button>
  );
}
