import { z } from 'zod'
import { IngredientUnitEnum } from '../enums'

export const ingredientBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  unidade: IngredientUnitEnum,
  deletedAt: z.date().nullable(),
})

export type IngredientBase = z.infer<typeof ingredientBase>
