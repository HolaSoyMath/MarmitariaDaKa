import { z } from 'zod'

export const priceTypeBase = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  size: z.string().min(1),
  pixPrice: z.number().nonnegative(),
  swilePrice: z.number().nonnegative(),
  deletedAt: z.date().nullable(),
})

export type PriceTypeBase = z.infer<typeof priceTypeBase>
