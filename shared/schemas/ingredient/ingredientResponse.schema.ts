import { z } from 'zod'
import { ingredientBase } from './ingredientBase.schema'

export const ingredientResponse = ingredientBase.pick({ id: true, name: true, unit: true })
export type IngredientResponse = z.infer<typeof ingredientResponse>
