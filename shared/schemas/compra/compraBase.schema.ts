import { z } from 'zod'

export const compraItemBase = z.object({
  id: z.string().uuid(),
  compraId: z.string().uuid(),
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
  valorTotal: z.number().positive(),
  valorUnitario: z.number().positive(),
  local: z.string().nullable(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const compraBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
})

export type CompraBase = z.infer<typeof compraBase>
export type CompraItemBase = z.infer<typeof compraItemBase>
