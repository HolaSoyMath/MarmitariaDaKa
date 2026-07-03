import { z } from 'zod'

const ingredientRankingItem = z.object({
  ingredientId: z.string().uuid(),
  name: z.string(),
  totalValue: z.number().int(),
  changePercent: z.number().nullable(),
})

const ingredientPricePoint = z.object({
  weekNumber: z.number().int(),
  year: z.number().int(),
  unitValue: z.number().int(),
  quantity: z.number(),
  totalValue: z.number().int(),
})

export const financialIngredientRankingResponse = z.array(ingredientRankingItem)
export const financialIngredientSeriesResponse = z.array(ingredientPricePoint)

export type FinancialIngredientRankingResponse = z.infer<typeof financialIngredientRankingResponse>
export type FinancialIngredientSeriesResponse = z.infer<typeof financialIngredientSeriesResponse>
