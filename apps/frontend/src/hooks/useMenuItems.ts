import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['menuItems'] as const

export function useMenuItems(weekId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, weekId],
    queryFn: async () => {
      const { data } = await api.get<MenuItemResponse[]>('/menu-items', { params: { weekId } })
      return data
    },
    enabled: !!weekId,
  })
}

export function useAddMenuItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: MenuItemInput) => {
      const res = await api.post<MenuItemResponse>('/menu-items', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Prato adicionado ao cardápio.')
    },
    onError: (error) => toastError(error, 'Não foi possível adicionar o prato.'),
  })
}

export function useUpdateMenuItemPriceTypes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, priceTypeIds }: { id: string; priceTypeIds: string[] }) => {
      const res = await api.patch<MenuItemResponse>(`/menu-items/${id}/price-types`, { priceTypeIds })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Tamanhos atualizados.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar os tamanhos.'),
  })
}

export function useRemoveMenuItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/menu-items/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Prato removido do cardápio.')
    },
    onError: (error) => toastError(error, 'Não foi possível remover o prato.'),
  })
}
