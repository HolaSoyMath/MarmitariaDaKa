import { z } from 'zod'

export const financialPeriod = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('week'),
    weekId: z.string().uuid(),
  }),
  z.object({
    type: z.literal('month'),
    month: z.number().int().min(1).max(12),
    year: z.number().int(),
  }),
  z.object({
    type: z.literal('period'),
    startDate: z.string(),
    endDate: z.string(),
  }),
])

export type FinancialPeriod = z.infer<typeof financialPeriod>
