import { z } from 'zod'

const pratoPorTamanho = z.object({
  tamanho: z.string(),
  quantidade: z.number().int(),
  faturamento: z.number(),
})

const pratoRelatorio = z.object({
  nome: z.string(),
  quantidade: z.number().int(),
  faturamento: z.number(),
  porTamanho: z.array(pratoPorTamanho),
})

const metodoRelatorio = z.object({
  quantidade: z.number().int(),
  valor: z.number(),
})

export const relatorioFinanceiroResponse = z.object({
  faturamento: z.number(),
  custo: z.number(),
  lucro: z.number(),
  margemPercentual: z.number(),
  aReceber: z.number(),
  porMetodo: z.object({
    Pix: metodoRelatorio,
    Swile: metodoRelatorio,
  }),
  pratos: z.array(pratoRelatorio),
})

export type RelatorioFinanceiroResponse = z.infer<typeof relatorioFinanceiroResponse>
