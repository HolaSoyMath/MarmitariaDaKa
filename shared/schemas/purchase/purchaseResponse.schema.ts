import { z } from 'zod'
import { purchaseBase, purchaseItemBase } from './purchaseBase.schema'
import { ingredientResponse } from '../ingredient/ingredientResponse.schema'

const purchaseItemResponse = purchaseItemBase
  .pick({ id: true, ingredientId: true, quantity: true, totalValue: true, unitValue: true, location: true, createdAt: true })
  .extend({ ingredient: ingredientResponse })

export const purchaseResponse = purchaseBase
  .pick({ id: true, weekId: true })
  .extend({ items: z.array(purchaseItemResponse) })

export type PurchaseResponse = z.infer<typeof purchaseResponse>
