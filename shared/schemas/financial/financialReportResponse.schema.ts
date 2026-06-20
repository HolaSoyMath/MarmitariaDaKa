import { z } from 'zod'

const dishBySize = z.object({
  size: z.string(),
  quantity: z.number().int(),
  revenue: z.number(),
})

const dishReport = z.object({
  name: z.string(),
  quantity: z.number().int(),
  revenue: z.number(),
  bySize: z.array(dishBySize),
})

const paymentMethodReport = z.object({
  quantity: z.number().int(),
  value: z.number(),
})

export const financialReportResponse = z.object({
  revenue: z.number(),
  cost: z.number(),
  profit: z.number(),
  profitMarginPercent: z.number(),
  toReceive: z.number(),
  byMethod: z.object({
    Pix: paymentMethodReport,
    Swile: paymentMethodReport,
  }),
  dishes: z.array(dishReport),
})

export type FinancialReportResponse = z.infer<typeof financialReportResponse>
