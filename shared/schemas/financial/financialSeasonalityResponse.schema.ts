import { z } from 'zod'

const seasonalityPoint = z.object({
  year: z.number().int(),
  revenue: z.number().int(),
  cost: z.number().int(),
  profit: z.number().int(),
})

export const financialSeasonalityResponse = z.array(seasonalityPoint)

export type FinancialSeasonalityResponse = z.infer<typeof financialSeasonalityResponse>
