'use client'

import { addDays, getISOWeeksInYear, setISOWeek, setISOWeekYear, startOfISOWeek } from 'date-fns'
import { useWeek } from '@/context/WeekContext'

function thursdayOfIsoWeek(week: number, year: number): Date {
  const monday = startOfISOWeek(setISOWeek(setISOWeekYear(new Date(), year), week))
  return addDays(monday, 3)
}

function isoWeeksInYear(year: number): number {
  return getISOWeeksInYear(new Date(year, 0, 1))
}

function offsetWeek(n: number, y: number, delta: 1 | -1) {
  let num = n + delta
  let year = y
  if (num < 1) {
    year--
    num = isoWeeksInYear(year)
  } else if (num > isoWeeksInYear(year)) {
    year++
    num = 1
  }
  return { number: num, year }
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function WeekPicker() {
  const { currentWeek, setWeek, isLoading } = useWeek()

  const handlePrev = () => {
    if (!currentWeek) return
    const { number, year } = offsetWeek(currentWeek.number, currentWeek.year, -1)
    setWeek(number, year)
  }

  const handleNext = () => {
    if (!currentWeek) return
    const { number, year } = offsetWeek(currentWeek.number, currentWeek.year, 1)
    setWeek(number, year)
  }

  const thursday = currentWeek ? thursdayOfIsoWeek(currentWeek.number, currentWeek.year) : null
  const monthLabel = thursday ? capitalize(monthFormatter.format(thursday)) : '…'

  return (
    <div className="inline-flex items-center gap-0.5 rounded-sm bg-sidebar p-1">
      <button
        onClick={handlePrev}
        disabled={isLoading}
        aria-label="Semana anterior"
        className="grid h-7 w-7 place-items-center rounded-[7px] text-[17px] leading-none text-[oklch(0.85_0.01_80)] transition-colors hover:bg-white/12 disabled:opacity-40"
      >
        ‹
      </button>

      <span className="px-2.75 font-mono text-[12px] whitespace-nowrap text-white">
        {currentWeek ? (
          <>
            Semana{' '}
            <b className="text-primary font-medium">{currentWeek.number}</b>
            {' · '}
            {monthLabel} {thursday?.getFullYear()}
          </>
        ) : (
          '…'
        )}
      </span>

      <button
        onClick={handleNext}
        disabled={isLoading}
        aria-label="Próxima semana"
        className="grid h-7 w-7 place-items-center rounded-[7px] text-[17px] leading-none text-[oklch(0.85_0.01_80)] transition-colors hover:bg-white/12 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}
