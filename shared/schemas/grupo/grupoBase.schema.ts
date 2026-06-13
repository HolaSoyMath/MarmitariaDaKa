import { z } from 'zod'

export const grupoBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  deletedAt: z.date().nullable(),
})

export type GrupoBase = z.infer<typeof grupoBase>
