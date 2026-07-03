import { z } from 'zod'

const paymentMethodPoint = z.object({
  quantity: z.number().int(),
  value: z.number().int(),
})

const timeseriesPoint = z.object({
  weekId: z.string().uuid(),
  weekNumber: z.number().int(),
  year: z.number().int(),
  revenue: z.number().int(),
  cost: z.number().int(),
  profit: z.number().int(),
  profitMarginPercent: z.number(),
  byMethod: z.object({
    Pix: paymentMethodPoint,
    Swile: paymentMethodPoint,
  }),
})

export const financialTimeseriesResponse = z.array(timeseriesPoint)

export type FinancialTimeseriesResponse = z.infer<typeof financialTimeseriesResponse>
