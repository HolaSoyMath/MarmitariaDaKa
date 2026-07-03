import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'
import type { FinancialPeriodFilter } from '@/types/financial'

function periodParams(period: FinancialPeriodFilter): Record<string, string> {
  if (period.type === 'week') return { type: 'week', weekId: period.weekId }
  if (period.type === 'month') return { type: 'month', month: String(period.month), year: String(period.year) }
  return { type: 'period', startDate: period.startDate, endDate: period.endDate }
}

function periodKey(period: FinancialPeriodFilter): string {
  return JSON.stringify(periodParams(period))
}

export function useFinancialReport(period: FinancialPeriodFilter | null) {
  return useQuery({
    queryKey: ['financial-report', period ? periodKey(period) : null],
    queryFn: async () => {
      const { data } = await api.get<FinancialReportResponse>('/financial', {
        params: periodParams(period!),
      })
      return data
    },
    enabled: !!period,
    placeholderData: keepPreviousData,
  })
}
