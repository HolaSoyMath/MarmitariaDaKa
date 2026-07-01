"use client";

import {
  addDays,
  getISOWeeksInYear,
  setISOWeek,
  setISOWeekYear,
  startOfISOWeek,
} from "date-fns";
import { useWeek } from "@/context/WeekContext";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function weekBounds(week: number, year: number): { start: Date; end: Date } {
  const start = startOfISOWeek(
    setISOWeek(setISOWeekYear(new Date(), year), week),
  );
  return { start, end: addDays(start, 6) };
}

function isoWeeksInYear(year: number): number {
  return getISOWeeksInYear(new Date(year, 0, 1));
}

function offsetWeek(n: number, y: number, delta: 1 | -1) {
  let num = n + delta;
  let year = y;
  if (num < 1) {
    year--;
    num = isoWeeksInYear(year);
  } else if (num > isoWeeksInYear(year)) {
    year++;
    num = 1;
  }
  return { number: num, year };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

export function WeekPicker() {
  const { currentWeek, isLoading, goToPrev, goToNext } = useWeek();

  const bounds = currentWeek
    ? weekBounds(currentWeek.number, currentWeek.year)
    : null;
  const dateRange = bounds
    ? `${dateFormatter.format(bounds.start)} – ${dateFormatter.format(bounds.end)}`
    : "…";

  return (
    <div className="inline-flex items-center gap-0.5 rounded-sm bg-sidebar p-1">
      <Button
        onClick={goToPrev}
        disabled={isLoading}
        aria-label="Semana anterior"
        className="rounded-sm w-8 h-8"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="px-2.75 font-mono text-[12px] whitespace-nowrap text-white">
        {currentWeek ? (
          <>
            Semana{" "}
            <b className="text-primary font-medium">{currentWeek.number}</b>
            {" · "}
            {dateRange}
          </>
        ) : (
          "…"
        )}
      </span>

      <Button
        onClick={goToNext}
        disabled={isLoading}
        aria-label="Próxima semana"
        className="rounded-sm w-8 h-8"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
