import { z } from 'zod'

const dishBySize = z.object({
  tamanho: z.string(),
  quantidade: z.number().int(),
  faturamento: z.number(),
})

const dishReport = z.object({
  nome: z.string(),
  quantidade: z.number().int(),
  faturamento: z.number(),
  porTamanho: z.array(dishBySize),
})

const paymentMethodReport = z.object({
  quantidade: z.number().int(),
  valor: z.number(),
})

export const financialReportResponse = z.object({
  faturamento: z.number(),
  custo: z.number(),
  lucro: z.number(),
  margemPercentual: z.number(),
  aReceber: z.number(),
  porMetodo: z.object({
    Pix: paymentMethodReport,
    Swile: paymentMethodReport,
  }),
  pratos: z.array(dishReport),
})

export type FinancialReportResponse = z.infer<typeof financialReportResponse>
