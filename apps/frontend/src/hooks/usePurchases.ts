import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { PurchaseResponse } from '@marmitaria/schemas/purchase/purchaseResponse.schema'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['purchases'] as const

export function usePurchase(weekId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, weekId],
    queryFn: async () => {
      const { data } = await api.get<PurchaseResponse | null>('/purchases', {
        params: { weekId },
      })
      return data
    },
    enabled: !!weekId,
    placeholderData: keepPreviousData,
  })
}

export function useUpsertPurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: PurchaseInput) => {
      const res = await api.post<PurchaseResponse>('/purchases', data)
      return res.data
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData([...QUERY_KEY, variables.weekId], data)
      queryClient.invalidateQueries({ queryKey: ['general-costs'] })
    },
    onError: (error) => toastError(error, 'Não foi possível salvar a compra.'),
  })
}
