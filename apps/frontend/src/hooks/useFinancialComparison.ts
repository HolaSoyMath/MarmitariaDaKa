import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialComparisonResponse } from '@marmitaria/schemas/financial/financialComparisonResponse.schema'
import type { FinancialPeriodFilter } from '@/types/financial'

function periodParams(period: FinancialPeriodFilter): Record<string, string> {
  if (period.type === 'week') return { type: 'week', weekId: period.weekId }
  if (period.type === 'month') return { type: 'month', month: String(period.month), year: String(period.year) }
  return { type: 'period', startDate: period.startDate, endDate: period.endDate }
}

export function useFinancialComparison(period: FinancialPeriodFilter | null) {
  return useQuery({
    queryKey: ['financial-comparison', period ? JSON.stringify(periodParams(period)) : null],
    queryFn: async () => {
      const { data } = await api.get<FinancialComparisonResponse>('/financial/comparison', {
        params: periodParams(period!),
      })
      return data
    },
    enabled: !!period,
    placeholderData: keepPreviousData,
  })
}
