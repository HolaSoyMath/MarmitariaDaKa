import { z } from 'zod'

export const cardapioBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
  receitaId: z.string().uuid(),
})

export type CardapioBase = z.infer<typeof cardapioBase>
