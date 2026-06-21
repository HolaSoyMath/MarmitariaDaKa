import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'
import type { IngredientInput } from '@marmitaria/schemas/ingredient/ingredientInput.schema'

const QUERY_KEY = ['ingredients'] as const

export function useIngredients() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<IngredientResponse[]>('/ingredients')
      return data
    },
  })
}

export function useCreateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: IngredientInput) => {
      const res = await api.post<IngredientResponse>('/ingredients', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Ingrediente criado com sucesso.')
    },
  })
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IngredientInput }) => {
      const res = await api.patch<IngredientResponse>(`/ingredients/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Ingrediente atualizado.')
    },
  })
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ingredients/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Ingrediente removido.')
    },
  })
}
