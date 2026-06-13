import { z } from 'zod'
import { ingredientBase } from './ingredienteBase.schema'

export const ingredientInput = ingredientBase.pick({ nome: true, unidade: true })
export type IngredientInput = z.infer<typeof ingredientInput>
