import { z } from 'zod'
import { recipeBase, recipeIngredientBase } from './recipeBase.schema'
import { ingredientResponse } from '../ingredient/ingredientResponse.schema'
import { priceTypeResponse } from '../priceType/priceTypeResponse.schema'

const recipeIngredientResponse = recipeIngredientBase
  .pick({ ingredientId: true, quantity: true })
  .extend({ ingredient: ingredientResponse })

export const recipeResponse = recipeBase
  .pick({ id: true, name: true })
  .extend({
    ingredients: z.array(recipeIngredientResponse),
    priceTypes: z.array(priceTypeResponse),
    lastOnMenu: z.string().nullable(),
  })

export type RecipeResponse = z.infer<typeof recipeResponse>
