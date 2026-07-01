import { z } from 'zod'
import { recipeBase, recipeIngredientBase } from './recipeBase.schema'

const recipeIngredientInput = recipeIngredientBase.pick({ ingredientId: true, quantity: true })

export const recipeInput = recipeBase
  .pick({ name: true })
  .extend({
    ingredients: z.array(recipeIngredientInput),
    priceTypeIds: z.array(z.string().uuid()).min(1),
  })

export type RecipeInput = z.infer<typeof recipeInput>
