import { z } from 'zod'

export const recipeIngredientBase = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number().positive(),
})

export const recipeBase = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  active: z.boolean(),
  deletedAt: z.date().nullable(),
})

export const recipeSizeBase = z.object({
  priceTypeId: z.string().uuid(),
})

export type RecipeBase = z.infer<typeof recipeBase>
export type RecipeIngredientBase = z.infer<typeof recipeIngredientBase>
export type RecipeSizeBase = z.infer<typeof recipeSizeBase>
