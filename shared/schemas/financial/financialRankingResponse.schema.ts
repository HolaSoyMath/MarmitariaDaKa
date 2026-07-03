import { z } from 'zod'

const rankingItem = z.object({
  id: z.string().uuid(),
  name: z.string(),
  quantity: z.number().int(),
  value: z.number().int(),
})

export const financialRankingResponse = z.array(rankingItem)

export type FinancialRankingResponse = z.infer<typeof financialRankingResponse>
