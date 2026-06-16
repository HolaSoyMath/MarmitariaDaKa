import { z } from 'zod'

export const recipeIngredientBase = z.object({
  recipeId: z.string().uuid(),
  ingredientId: z.string().uuid(),
  quantity: z.number().positive(),
})

export const recipeBase = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  deletedAt: z.date().nullable(),
})

export type RecipeBase = z.infer<typeof recipeBase>
export type RecipeIngredientBase = z.infer<typeof recipeIngredientBase>
