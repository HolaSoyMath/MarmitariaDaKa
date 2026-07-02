import { z } from 'zod'
import { recipeBase, recipeIngredientBase } from './recipeBase.schema'
import { ingredientResponse } from '../ingredient/ingredientResponse.schema'
import { priceTypeResponse } from '../priceType/priceTypeResponse.schema'

const recipeIngredientResponse = recipeIngredientBase
  .pick({ ingredientId: true, quantity: true })
  .extend({
    ingredient: ingredientResponse,
    averageUnitCost: z.number().int().nullable().optional(),
    averageCost: z.number().int().nullable().optional(),
  })

export const recipeResponse = recipeBase
  .pick({ id: true, name: true, active: true })
  .extend({
    ingredients: z.array(recipeIngredientResponse),
    priceTypes: z.array(priceTypeResponse),
    lastOnMenu: z.string().nullable(),
    totalAverageCost: z.number().int().nullable().optional(),
    isPartialAverageCost: z.boolean().optional(),
  })

export type RecipeResponse = z.infer<typeof recipeResponse>
