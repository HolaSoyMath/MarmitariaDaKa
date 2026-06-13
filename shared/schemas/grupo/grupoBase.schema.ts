import { z } from 'zod'

export const groupBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  deletedAt: z.date().nullable(),
})

export type GroupBase = z.infer<typeof groupBase>
