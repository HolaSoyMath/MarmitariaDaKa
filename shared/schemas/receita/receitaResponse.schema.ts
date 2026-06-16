import { z } from 'zod'
import { recipeBase } from './receitaBase.schema'
import { ingredientResponse } from '../ingrediente/ingredienteResponse.schema'

const recipeIngredientResponse = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number(),
  ingredient: ingredientResponse,
})

export const recipeResponse = recipeBase
  .pick({ id: true, name: true })
  .extend({
    ingredients: z.array(recipeIngredientResponse),
    lastOnMenu: z.string().nullable(),
  })

export type RecipeResponse = z.infer<typeof recipeResponse>
