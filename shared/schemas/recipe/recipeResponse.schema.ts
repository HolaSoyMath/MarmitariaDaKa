import { z } from 'zod'
import { recipeBase, recipeIngredientBase } from './recipeBase.schema'
import { ingredientResponse } from '../ingredient/ingredientResponse.schema'

const recipeIngredientResponse = recipeIngredientBase
  .pick({ ingredientId: true, quantity: true })
  .extend({ ingredient: ingredientResponse })

export const recipeResponse = recipeBase
  .pick({ id: true, name: true })
  .extend({
    ingredients: z.array(recipeIngredientResponse),
    lastOnMenu: z.string().nullable(),
  })

export type RecipeResponse = z.infer<typeof recipeResponse>
