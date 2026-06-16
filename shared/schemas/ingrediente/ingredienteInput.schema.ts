import { z } from 'zod'
import { ingredientBase } from './ingredienteBase.schema'

export const ingredientInput = ingredientBase.pick({ name: true, unit: true })
export type IngredientInput = z.infer<typeof ingredientInput>
