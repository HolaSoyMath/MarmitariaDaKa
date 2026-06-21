import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'
import type { OrderInput } from '@marmitaria/schemas/order/orderInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['orders'] as const

export function useOrders(weekId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, weekId],
    queryFn: async () => {
      const { data } = await api.get<OrderResponse[]>('/orders', { params: { weekId } })
      return data
    },
    enabled: !!weekId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: OrderInput) => {
      const res = await api.post<OrderResponse>('/orders', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Pedido criado com sucesso.')
    },
    onError: (error) => toastError(error, 'Não foi possível criar o pedido.'),
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OrderInput }) => {
      const res = await api.patch<OrderResponse>(`/orders/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Pedido atualizado.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar o pedido.'),
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/orders/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Pedido removido.')
    },
    onError: (error) => toastError(error, 'Não foi possível remover o pedido.'),
  })
}

export function useMarkProduced() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<OrderResponse>(`/orders/${id}/mark-produced`)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error) => toastError(error, 'Não foi possível marcar como produzido.'),
  })
}

export function useMarkPaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { paymentMethod: 'Pix' | 'Swile' } }) => {
      const res = await api.patch<OrderResponse>(`/orders/${id}/mark-paid`, data)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error) => toastError(error, 'Não foi possível marcar como pago.'),
  })
}

export function useRevertToPending() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<OrderResponse>(`/orders/${id}/revert-to-pending`)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error) => toastError(error, 'Não foi possível reverter o pedido.'),
  })
}

export function useRevertToProduced() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<OrderResponse>(`/orders/${id}/revert-to-produced`)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (error) => toastError(error, 'Não foi possível desmarcar o pagamento.'),
  })
}
