import { z } from 'zod'

const dishBySize = z.object({
  size: z.string(),
  quantity: z.number().int(),
  revenue: z.number().int(),
})

const dishReport = z.object({
  name: z.string(),
  quantity: z.number().int(),
  revenue: z.number().int(),
  bySize: z.array(dishBySize),
})

const paymentMethodReport = z.object({
  quantity: z.number().int(),
  value: z.number().int(),
})

export const financialReportResponse = z.object({
  revenue: z.number().int(),
  cost: z.number().int(),
  profit: z.number().int(),
  profitMarginPercent: z.number(),
  toReceive: z.number().int(),
  byMethod: z.object({
    Pix: paymentMethodReport,
    Swile: paymentMethodReport,
  }),
  dishes: z.array(dishReport),
})

export type FinancialReportResponse = z.infer<typeof financialReportResponse>
