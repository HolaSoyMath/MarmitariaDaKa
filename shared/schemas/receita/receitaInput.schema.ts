import { z } from 'zod'
import { recipeBase } from './receitaBase.schema'

const recipeIngredientInput = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
})

export const recipeInput = recipeBase
  .pick({ nome: true })
  .extend({ ingredientes: z.array(recipeIngredientInput) })

export type RecipeInput = z.infer<typeof recipeInput>
