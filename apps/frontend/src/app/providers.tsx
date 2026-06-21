'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { makeQueryClient } from '@/lib/queryClient'
import { WeekProvider } from '@/context/WeekContext'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <WeekProvider>
        {children}
      </WeekProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
