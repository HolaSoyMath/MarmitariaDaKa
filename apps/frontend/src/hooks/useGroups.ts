import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { GroupResponse } from '@marmitaria/schemas/group/groupResponse.schema'
import type { GroupInput } from '@marmitaria/schemas/group/groupInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['groups'] as const

export function useGroups() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<GroupResponse[]>('/groups')
      return data
    },
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: GroupInput) => {
      const res = await api.post<GroupResponse>('/groups', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Grupo criado.')
    },
    onError: (error) => toastError(error, 'Não foi possível criar o grupo.'),
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GroupInput }) => {
      const res = await api.patch<GroupResponse>(`/groups/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Grupo renomeado.')
    },
    onError: (error) => toastError(error, 'Não foi possível renomear o grupo.'),
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/groups/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Grupo excluído.')
    },
    onError: (error) => toastError(error, 'Não foi possível excluir o grupo.'),
  })
}
