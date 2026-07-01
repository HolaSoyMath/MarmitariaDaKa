import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { GeneralCostResponse } from '@marmitaria/schemas/generalCost/generalCostResponse.schema'
import type { GeneralCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['general-costs'] as const

export function useGeneralCosts(weekId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, weekId],
    queryFn: async () => {
      const { data } = await api.get<GeneralCostResponse[]>('/general-costs', {
        params: { weekId },
      })
      return data
    },
    enabled: !!weekId,
    placeholderData: keepPreviousData,
  })
}

export function useCreateGeneralCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: GeneralCostInput) => {
      const res = await api.post<GeneralCostResponse>('/general-costs', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Custo adicionado.')
    },
    onError: (error) => toastError(error, 'Não foi possível adicionar o custo.'),
  })
}

export function useUpdateGeneralCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GeneralCostInput> }) => {
      const res = await api.patch<GeneralCostResponse>(`/general-costs/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Custo atualizado.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar o custo.'),
  })
}

export function useDeleteGeneralCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/general-costs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Custo removido.')
    },
    onError: (error) => toastError(error, 'Não foi possível remover o custo.'),
  })
}
