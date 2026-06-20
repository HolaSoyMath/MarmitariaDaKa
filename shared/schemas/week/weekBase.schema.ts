import { z } from 'zod'

export const weekBase = z.object({
  id: z.string().uuid(),
  number: z.number().int().min(1).max(53),
  year: z.number().int().min(2020),
})

export type WeekBase = z.infer<typeof weekBase>
