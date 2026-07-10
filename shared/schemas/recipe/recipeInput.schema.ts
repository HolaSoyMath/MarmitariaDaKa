import { z } from 'zod'
import { recipeBase, recipeIngredientBase, recipeSizeBase } from './recipeBase.schema'

const recipeIngredientInput = recipeIngredientBase.pick({ ingredientId: true, quantity: true })

const recipeSizeInput = recipeSizeBase.pick({ priceTypeId: true }).extend({
  ingredients: z.array(recipeIngredientInput).min(1),
})

export const recipeInput = recipeBase
  .pick({ name: true })
  .extend({
    sizes: z.array(recipeSizeInput).min(1),
  })

export type RecipeInput = z.infer<typeof recipeInput>
