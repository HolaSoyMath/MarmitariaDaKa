import { z } from 'zod'
import { ingredientBase } from './ingredienteBase.schema'

export const ingredientResponse = ingredientBase.pick({ id: true, nome: true, unidade: true })
export type IngredientResponse = z.infer<typeof ingredientResponse>
