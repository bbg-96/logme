"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onChangeMonth: (offset: number) => void;
  onSelectMonth: (year: number, month: number) => void;
}

export function CalendarHeader({
  currentMonth,
  onChangeMonth,
  onSelectMonth,
}: CalendarHeaderProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [visibleYear, setVisibleYear] = useState(
    () => currentMonth.getFullYear(),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  /* 년도 토글 */
  useEffect(() => {
    setVisibleYear(currentMonth.getFullYear());
  }, [currentMonth]);

  /* 외부 클릭 처리 */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () =>
      window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 현재 월 텍스트 */
  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      }),
    [currentMonth],
  );

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      <div className="flex items-center justify-center gap-2">

        {/* 이전 달 */}
        <button
          onClick={() => onChangeMonth(-1)}
          aria-label="Previous month"
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            text-sm font-semibold
            text-[var(--color-text-muted)]
            bg-transparent
            transition
            hover:bg-[color:var(--color-bg-subtle)]    /* 토큰 기반 hover */
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* 월 선택 pill */}
        <div className="relative">
          <button
            onClick={() => setIsPickerOpen((o) => !o)}
            aria-expanded={isPickerOpen}
            className="
              inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition
              bg-[color:var(--color-bg-card)]                /* light/dark 모두 토큰 기반 */
              text-[var(--color-text-primary)]
              border-[color:var(--color-border-subtle)]
              hover:bg-[color:var(--color-bg-subtle)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            "
          >
            <span>{monthLabel}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isPickerOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* 월 선택 드롭다운 */}
          {isPickerOpen && (
            <div
              className="
                absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 min-w-[200px]
                rounded-xl p-4 shadow-lg ring-1
                bg-[color:var(--color-bg-card)]
                text-[var(--color-text-primary)]
                ring-[color:var(--color-border-subtle)]
              "
            >
              {/* 연도 선택 */}
              <div
                className="
                  mb-2 flex items-center justify-between border-b pb-2 text-sm font-semibold
                  border-[color:var(--color-border-subtle)]
                "
              >
                <button
                  onClick={() => setVisibleYear((y) => y - 1)}
                  className="
                    rounded-full px-3 py-1 transition
                    hover:bg-[color:var(--color-bg-subtle)]
                  "
                >
                  &lt;
                </button>

                <span>{visibleYear}년</span>

                <button
                  onClick={() => setVisibleYear((y) => y + 1)}
                  className="
                    rounded-full px-3 py-1 transition
                    hover:bg-[color:var(--color-bg-subtle)]
                  "
                >
                  &gt;
                </button>
              </div>

              {/* 월 grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 text-sm">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                  const isActive =
                    visibleYear === currentMonth.getFullYear() &&
                    month - 1 === currentMonth.getMonth();

                  return (
                    <button
                      key={month}
                      onClick={() => {
                        onSelectMonth(visibleYear, month - 1);
                        setIsPickerOpen(false);
                      }}
                      className={`
                        w-full rounded-lg px-2 py-1 text-center transition
                        hover:bg-[color:var(--color-bg-subtle)]
                        ${
                          isActive
                            ? "bg-[color:var(--color-bg-active)] text-[color:var(--color-text-onactive)]"
                            : "text-[var(--color-text-primary)]"
                        }
                      `}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 다음 달 */}
        <button
          onClick={() => onChangeMonth(1)}
          aria-label="Next month"
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            text-sm font-semibold
            text-[var(--color-text-muted)]
            bg-transparent
            transition
            hover:bg-[color:var(--color-bg-subtle)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
