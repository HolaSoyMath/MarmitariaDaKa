import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { api } from '@/lib/api'
import type { RecipeResponse } from '@marmitaria/schemas/recipe/recipeResponse.schema'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'

function toastError(error: unknown, fallback = 'Erro inesperado.') {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : null
  toast.error(message ?? fallback)
}

const QUERY_KEY = ['recipes'] as const

export function useRecipes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<RecipeResponse[]>('/recipes')
      return data
    },
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: RecipeInput) => {
      const res = await api.post<RecipeResponse>('/recipes', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Receita criada com sucesso.')
    },
    onError: (error) => toastError(error, 'Não foi possível criar a receita.'),
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecipeInput }) => {
      const res = await api.patch<RecipeResponse>(`/recipes/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Receita atualizada.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar a receita.'),
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recipes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Receita removida.')
    },
    onError: (error) => toastError(error, 'Não foi possível remover a receita.'),
  })
}

export function useSetRecipeActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await api.patch<RecipeResponse>(`/recipes/${id}/active`, { active })
      return res.data
    },
    onSuccess: (_data, { active }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(active ? 'Receita ativada.' : 'Receita desativada.')
    },
    onError: (error) => toastError(error, 'Não foi possível atualizar a receita.'),
  })
}
