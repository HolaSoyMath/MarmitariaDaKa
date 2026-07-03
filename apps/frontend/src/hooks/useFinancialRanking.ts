import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialRankingResponse } from '@marmitaria/schemas/financial/financialRankingResponse.schema'

export function useClientRanking() {
  return useQuery({
    queryKey: ['financial-client-ranking'],
    queryFn: async () => {
      const { data } = await api.get<FinancialRankingResponse>('/financial/client-ranking')
      return data
    },
  })
}

export function useGroupRanking() {
  return useQuery({
    queryKey: ['financial-group-ranking'],
    queryFn: async () => {
      const { data } = await api.get<FinancialRankingResponse>('/financial/group-ranking')
      return data
    },
  })
}
