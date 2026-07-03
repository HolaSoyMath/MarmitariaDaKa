import { z } from 'zod'

const dishLastSold = z.object({
  recipeId: z.string().uuid(),
  recipeName: z.string(),
  lastSoldWeekNumber: z.number().int().nullable(),
  lastSoldYear: z.number().int().nullable(),
  weeksSinceLastSold: z.number().int().nullable(),
})

export const financialDishLastSoldResponse = z.array(dishLastSold)

export type FinancialDishLastSoldResponse = z.infer<typeof financialDishLastSoldResponse>
