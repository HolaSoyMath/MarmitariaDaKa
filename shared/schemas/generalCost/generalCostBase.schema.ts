import { z } from 'zod'

export const generalCostBase = z.object({
  id: z.string().uuid(),
  weekId: z.string().uuid(),
  description: z.string().min(1),
  value: z.number().nonnegative(),
  automatic: z.boolean(),
  deletedAt: z.date().nullable(),
})

export type GeneralCostBase = z.infer<typeof generalCostBase>
