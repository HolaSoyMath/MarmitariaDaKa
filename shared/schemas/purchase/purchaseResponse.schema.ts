import { z } from 'zod'
import { purchaseBase } from './purchaseBase.schema'
import { ingredientResponse } from '../ingredient/ingredientResponse.schema'

const purchaseItemResponse = z.object({
  id: z.string().uuid(),
  ingredientId: z.string().uuid(),
  quantity: z.number(),
  totalValue: z.number(),
  unitValue: z.number(),
  location: z.string().nullable(),
  createdAt: z.date(),
  ingredient: ingredientResponse,
})

export const purchaseResponse = purchaseBase
  .pick({ id: true, weekId: true })
  .extend({ items: z.array(purchaseItemResponse) })

export type PurchaseResponse = z.infer<typeof purchaseResponse>
