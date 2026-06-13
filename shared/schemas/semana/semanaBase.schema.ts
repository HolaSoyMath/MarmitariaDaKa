import { z } from 'zod'

export const semanaBase = z.object({
  id: z.string().uuid(),
  numero: z.number().int().min(1).max(53),
  ano: z.number().int().min(2020),
})

export type SemanaBase = z.infer<typeof semanaBase>
