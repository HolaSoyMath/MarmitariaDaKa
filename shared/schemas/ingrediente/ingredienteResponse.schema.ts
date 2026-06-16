import { z } from 'zod'
import { ingredientBase } from './ingredienteBase.schema'

export const ingredientResponse = ingredientBase.pick({ id: true, name: true, unit: true })
export type IngredientResponse = z.infer<typeof ingredientResponse>
