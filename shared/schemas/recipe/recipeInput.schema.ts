import { z } from 'zod'
import { recipeBase, recipeIngredientBase } from './recipeBase.schema'

const recipeIngredientInput = recipeIngredientBase.pick({ ingredientId: true, quantity: true })

export const recipeInput = recipeBase
  .pick({ name: true })
  .extend({ ingredients: z.array(recipeIngredientInput) })

export type RecipeInput = z.infer<typeof recipeInput>
