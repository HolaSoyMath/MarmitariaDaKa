import { z } from 'zod'

export const clienteBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  grupoId: z.string().uuid(),
  deletedAt: z.date().nullable(),
})

export type ClienteBase = z.infer<typeof clienteBase>
