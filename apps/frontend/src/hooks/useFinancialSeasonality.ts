import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialSeasonalityResponse } from '@marmitaria/schemas/financial/financialSeasonalityResponse.schema'

export type SeasonalityGranularity = 'week' | 'month' | 'year'

export function useFinancialSeasonality(granularity: SeasonalityGranularity, referenceNumber: number | null) {
  const needsReference = granularity !== 'year'

  return useQuery({
    queryKey: ['financial-seasonality', granularity, referenceNumber],
    queryFn: async () => {
      const { data } = await api.get<FinancialSeasonalityResponse>('/financial/seasonality', {
        params: { granularity, ...(needsReference && referenceNumber ? { number: referenceNumber } : {}) },
      })
      return data
    },
    enabled: !needsReference || !!referenceNumber,
  })
}
