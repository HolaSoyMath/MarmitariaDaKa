import { z } from 'zod'

export const clientBase = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  groupId: z.string().uuid(),
  deletedAt: z.date().nullable(),
})

export type ClientBase = z.infer<typeof clientBase>
