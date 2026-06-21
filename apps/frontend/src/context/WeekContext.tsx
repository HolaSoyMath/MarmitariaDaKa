'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getISOWeek, getISOWeekYear } from 'date-fns'
import { api } from '@/lib/api'

type WeekState = { id: string; number: number; year: number } | null

interface WeekContextValue {
  currentWeek: WeekState
  setWeek: (number: number, year: number) => Promise<void>
  isLoading: boolean
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

  return (
    <WeekContext.Provider value={{ currentWeek, setWeek, isLoading }}>
      {children}
    </WeekContext.Provider>
  )
}

export function useWeek(): WeekContextValue {
  const ctx = useContext(WeekContext)
  if (!ctx) throw new Error('useWeek must be used within WeekProvider')
  return ctx
}
