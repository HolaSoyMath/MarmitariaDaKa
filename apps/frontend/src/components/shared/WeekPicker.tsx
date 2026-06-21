'use client'

import { useWeek } from '@/context/WeekContext'

function isoWeeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28)
  const dow = dec28.getDay() || 7
  const thu = new Date(dec28)
  thu.setDate(dec28.getDate() + 4 - dow)
  return Math.ceil(
    ((thu.getTime() - new Date(thu.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7,
  )
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

function mondayOfIsoWeek(week: number, year: number): Date {
  const jan4 = new Date(year, 0, 4)
  const dow = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dow + 1 + (week - 1) * 7)
  return monday
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

  const monthLabel = currentWeek
    ? capitalize(monthFormatter.format(mondayOfIsoWeek(currentWeek.number, currentWeek.year)))
    : '…'

  return (
    <div className="inline-flex items-center gap-0.5 rounded-[10px] bg-sidebar p-1">
      <button
        onClick={handlePrev}
        disabled={isLoading}
        aria-label="Semana anterior"
        className="grid h-7 w-7 place-items-center rounded-[7px] text-[17px] leading-none text-[oklch(0.85_0.01_80)] transition-colors hover:bg-white/[0.12] disabled:opacity-40"
      >
        ‹
      </button>

      <span className="px-[11px] font-mono text-[12px] whitespace-nowrap text-white">
        {currentWeek ? (
          <>
            Semana{' '}
            <b className="text-primary font-medium">{currentWeek.number}</b>
            {' · '}
            {monthLabel} {currentWeek.year}
          </>
        ) : (
          '…'
        )}
      </span>

      <button
        onClick={handleNext}
        disabled={isLoading}
        aria-label="Próxima semana"
        className="grid h-7 w-7 place-items-center rounded-[7px] text-[17px] leading-none text-[oklch(0.85_0.01_80)] transition-colors hover:bg-white/[0.12] disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}
