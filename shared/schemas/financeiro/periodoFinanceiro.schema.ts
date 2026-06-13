import { z } from 'zod'

export const periodoFinanceiro = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('semana'),
    semanaId: z.string().uuid(),
  }),
  z.object({
    tipo: z.literal('mes'),
    mes: z.number().int().min(1).max(12),
    ano: z.number().int(),
  }),
  z.object({
    tipo: z.literal('periodo'),
    dataInicio: z.string(),
    dataFim: z.string(),
  }),
])

export type PeriodoFinanceiro = z.infer<typeof periodoFinanceiro>
