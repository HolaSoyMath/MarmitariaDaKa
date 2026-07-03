import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FinancialDishLastSoldResponse } from '@marmitaria/schemas/financial/financialDishLastSoldResponse.schema'

export function useDishLastSold() {
  return useQuery({
    queryKey: ['financial-dish-last-sold'],
    queryFn: async () => {
      const { data } = await api.get<FinancialDishLastSoldResponse>('/financial/dish-last-sold')
      return data
    },
  })
}
