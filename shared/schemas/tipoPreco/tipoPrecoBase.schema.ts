import { z } from 'zod'

export const priceTypeBase = z.object({
  id: z.string().uuid(),
  tipo: z.string().min(1),
  tamanho: z.string().min(1),
  valorPix: z.number().nonnegative(),
  valorSwile: z.number().nonnegative(),
  deletedAt: z.date().nullable(),
})

export type PriceTypeBase = z.infer<typeof priceTypeBase>
