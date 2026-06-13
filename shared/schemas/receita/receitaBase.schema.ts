import { z } from 'zod'

export const recipeIngredientBase = z.object({
  receitaId: z.string().uuid(),
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
})

export const recipeBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  deletedAt: z.date().nullable(),
})

export type RecipeBase = z.infer<typeof recipeBase>
export type RecipeIngredientBase = z.infer<typeof recipeIngredientBase>
