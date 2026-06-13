import { z } from 'zod'

export const generalCostBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
  descricao: z.string().min(1),
  valor: z.number().nonnegative(),
  automatico: z.boolean(),
  deletedAt: z.date().nullable(),
})

export type GeneralCostBase = z.infer<typeof generalCostBase>
