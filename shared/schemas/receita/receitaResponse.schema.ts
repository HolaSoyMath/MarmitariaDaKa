import { z } from 'zod'
import { recipeBase } from './receitaBase.schema'
import { ingredientResponse } from '../ingrediente/ingredienteResponse.schema'

const recipeIngredientResponse = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number(),
  ingrediente: ingredientResponse,
})

export const recipeResponse = recipeBase
  .pick({ id: true, nome: true })
  .extend({
    ingredientes: z.array(recipeIngredientResponse),
    ultimaVezNoCardapio: z.string().nullable(),
  })

export type RecipeResponse = z.infer<typeof recipeResponse>
