import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialRecordWeekResponse } from '@marmitaria/schemas/financial/financialRecordWeekResponse.schema'

export function useFinancialRecordWeek() {
  return useQuery({
    queryKey: ['financial-record-week'],
    queryFn: async () => {
      const { data } = await api.get<FinancialRecordWeekResponse>('/financial/record-week')
      return data
    },
  })
}
