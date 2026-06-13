import { z } from 'zod'

export const clientBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  grupoId: z.string().uuid(),
  deletedAt: z.date().nullable(),
})

export type ClientBase = z.infer<typeof clientBase>
