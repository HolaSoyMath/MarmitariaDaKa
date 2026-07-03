import { z } from 'zod'

const recordWeekBase = z.object({
  weekId: z.string().uuid(),
  weekNumber: z.number().int(),
  year: z.number().int(),
})

export const financialRecordWeekResponse = z.object({
  bestRevenueWeek: recordWeekBase.extend({ revenue: z.number().int() }).nullable(),
  bestProfitWeek: recordWeekBase.extend({ profit: z.number().int() }).nullable(),
})

export type FinancialRecordWeekResponse = z.infer<typeof financialRecordWeekResponse>
