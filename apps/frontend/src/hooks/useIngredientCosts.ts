import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialIngredientRankingResponse, FinancialIngredientSeriesResponse } from '@marmitaria/schemas/financial/financialIngredientCostResponse.schema'

export function useIngredientCostRanking() {
  return useQuery({
    queryKey: ['financial-ingredient-ranking'],
    queryFn: async () => {
      const { data } = await api.get<FinancialIngredientRankingResponse>('/financial/ingredient-costs')
      return data
    },
  })
}

export function useIngredientPriceSeries(ingredientId: string | null) {
  return useQuery({
    queryKey: ['financial-ingredient-series', ingredientId],
    queryFn: async () => {
      const { data } = await api.get<FinancialIngredientSeriesResponse>('/financial/ingredient-costs', {
        params: { ingredientId },
      })
      return data
    },
    enabled: !!ingredientId,
  })
}
