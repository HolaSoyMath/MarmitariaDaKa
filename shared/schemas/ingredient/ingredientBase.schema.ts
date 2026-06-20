import { z } from 'zod'
import { IngredientUnitEnum } from '../enums'

export const ingredientBase = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  unit: IngredientUnitEnum,
  deletedAt: z.date().nullable(),
})

export type IngredientBase = z.infer<typeof ingredientBase>
