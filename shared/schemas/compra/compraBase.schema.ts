import { z } from 'zod'

export const purchaseItemBase = z.object({
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

export const purchaseBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
})

export type PurchaseBase = z.infer<typeof purchaseBase>
export type PurchaseItemBase = z.infer<typeof purchaseItemBase>
