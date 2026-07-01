'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getISOWeek, getISOWeekYear, getISOWeeksInYear } from 'date-fns'
import { api } from '@/lib/api'

type WeekState = { id: string; number: number; year: number } | null

interface WeekContextValue {
  currentWeek: WeekState
  setWeek: (number: number, year: number) => Promise<void>
  isLoading: boolean
  goToPrev: () => void
  goToNext: () => void
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

const WeekContext = createContext<WeekContextValue | null>(null)

function getCurrentISOWeek(): { number: number; year: number } {
  const now = new Date()
  return { number: getISOWeek(now), year: getISOWeekYear(now) }
}

async function openWeek(number: number, year: number): Promise<WeekState> {
  try {
    const { data } = await api.post<{ id: string; number: number; year: number }>('/weeks', { number, year })
    return { id: data.id, number: data.number, year: data.year }
  } catch {
    return null
  }
}

export function WeekProvider({ children }: { children: ReactNode }) {
  const [currentWeek, setCurrentWeek] = useState<WeekState>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { number, year } = getCurrentISOWeek()
    openWeek(number, year).then((week) => {
      setCurrentWeek(week)
      setIsLoading(false)
    })
  }, [])

  const setWeek = useCallback(async (number: number, year: number) => {
    setIsLoading(true)
    const week = await openWeek(number, year)
    setCurrentWeek(week)
    setIsLoading(false)
  }, [])

  const goToPrev = useCallback(() => {
    if (!currentWeek) return
    const { number, year } = offsetWeek(currentWeek.number, currentWeek.year, -1)
    setWeek(number, year)
  }, [currentWeek, setWeek])

  const goToNext = useCallback(() => {
    if (!currentWeek) return
    const { number, year } = offsetWeek(currentWeek.number, currentWeek.year, 1)
    setWeek(number, year)
  }, [currentWeek, setWeek])

  return (
    <WeekContext.Provider value={{ currentWeek, setWeek, isLoading, goToPrev, goToNext }}>
      {children}
    </WeekContext.Provider>
  )
}

export function useWeek(): WeekContextValue {
  const ctx = useContext(WeekContext)
  if (!ctx) throw new Error('useWeek must be used within WeekProvider')
  return ctx
}
