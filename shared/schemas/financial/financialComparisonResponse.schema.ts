import { z } from 'zod'
import { financialReportResponse } from './financialReportResponse.schema'

export const financialComparisonResponse = z.object({
  current: financialReportResponse,
  previous: financialReportResponse,
  variation: z.object({
    revenuePercent: z.number().nullable(),
    costPercent: z.number().nullable(),
    profitPercent: z.number().nullable(),
  }),
})

export type FinancialComparisonResponse = z.infer<typeof financialComparisonResponse>
