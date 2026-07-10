export interface WeekRef {
  year: number
  weekNumber: number
}

export function compareWeeks(a: WeekRef, b: WeekRef): number {
  return a.year - b.year || a.weekNumber - b.weekNumber
}

export function isWeekAtOrBefore(week: WeekRef, reference: WeekRef): boolean {
  return compareWeeks(week, reference) <= 0
}
