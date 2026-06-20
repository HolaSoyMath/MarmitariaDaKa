import { z } from 'zod'

export const purchaseItemBase = z.object({
  id: z.string().uuid(),
  purchaseId: z.string().uuid(),
  ingredientId: z.string().uuid(),
  quantity: z.number().positive(),
  totalValue: z.number().int().positive(),
  unitValue: z.number().int().positive(),
  location: z.string().nullable(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const purchaseBase = z.object({
  id: z.string().uuid(),
  weekId: z.string().uuid(),
})

export type PurchaseBase = z.infer<typeof purchaseBase>
export type PurchaseItemBase = z.infer<typeof purchaseItemBase>
