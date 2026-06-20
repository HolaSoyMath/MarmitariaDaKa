import { z } from 'zod'

export const configBase = z.object({
  id: z.string().uuid(),
  gasPercentage: z.number().min(0).max(1),
})

export type ConfigBase = z.infer<typeof configBase>
