import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { PriceTypeResponse } from '@marmitaria/schemas/priceType/priceTypeResponse.schema'
import type { PriceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['priceTypes'] as const

export function usePriceTypes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<PriceTypeResponse[]>('/price-types')
      return data
    },
  })
}

export function useCreatePriceType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: PriceTypeInput) => {
      const res = await api.post<PriceTypeResponse>('/price-types', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Tipo de preço criado com sucesso.')
    },
    onError: (error) => toastError(error, 'Não foi possível criar o tipo de preço.'),
  })
}

export function useUpdatePriceType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PriceTypeInput }) => {
      const res = await api.patch<PriceTypeResponse>(`/price-types/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Tipo de preço atualizado.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar o tipo de preço.'),
  })
}

export function useDeletePriceType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/price-types/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Tipo de preço removido.')
    },
    onError: (error) => toastError(error, 'Não foi possível remover o tipo de preço.'),
  })
}
