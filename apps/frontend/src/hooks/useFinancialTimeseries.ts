import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'
import type { FinancialPeriodFilter } from '@/types/financial'

function periodParams(period: FinancialPeriodFilter): Record<string, string> {
  if (period.type === 'week') return { type: 'week', weekId: period.weekId }
  if (period.type === 'month') return { type: 'month', month: String(period.month), year: String(period.year) }
  return { type: 'period', startDate: period.startDate, endDate: period.endDate }
}

export function useFinancialTimeseries(period: FinancialPeriodFilter | null) {
  return useQuery({
    queryKey: ['financial-timeseries', period ? JSON.stringify(periodParams(period)) : null],
    queryFn: async () => {
      const { data } = await api.get<FinancialTimeseriesResponse>('/financial/timeseries', {
        params: periodParams(period!),
      })
      return data
    },
    enabled: !!period && period.type !== 'week',
    placeholderData: keepPreviousData,
  })
}
