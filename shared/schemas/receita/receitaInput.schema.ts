import { z } from 'zod'
import { recipeBase } from './receitaBase.schema'

const recipeIngredientInput = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number().positive(),
})

export const recipeInput = recipeBase
  .pick({ name: true })
  .extend({ ingredients: z.array(recipeIngredientInput) })

export type RecipeInput = z.infer<typeof recipeInput>
