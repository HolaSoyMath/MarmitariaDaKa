import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { ClientResponse } from '@marmitaria/schemas/client/clientResponse.schema'
import type { ClientInput } from '@marmitaria/schemas/client/clientInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['clients'] as const

export function useClients() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<ClientResponse[]>('/clients')
      return data
    },
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ClientInput) => {
      const res = await api.post<ClientResponse>('/clients', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cliente criado com sucesso.')
    },
    onError: (error) => toastError(error, 'Não foi possível criar o cliente.'),
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientInput }) => {
      const res = await api.patch<ClientResponse>(`/clients/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Cliente atualizado.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar o cliente.'),
  })
}
