import { z } from 'zod'
import { purchaseBase } from './purchaseBase.schema'

const purchaseItemInput = z.object({
  ingredientId: z.string().uuid(),
  quantity: z.number().positive(),
  totalValue: z.number().positive(),
  location: z.string().optional(),
})

export const purchaseInput = purchaseBase
  .pick({ weekId: true })
  .extend({ items: z.array(purchaseItemInput).min(1) })

export type PurchaseInput = z.infer<typeof purchaseInput>
