import { z } from 'zod'
import { purchaseBase, purchaseItemBase } from './purchaseBase.schema'

const purchaseItemInput = purchaseItemBase
  .pick({ ingredientId: true, quantity: true, totalValue: true })
  .extend({ location: z.string().optional() })

export const purchaseInput = purchaseBase
  .pick({ weekId: true })
  .extend({ items: z.array(purchaseItemInput).min(1) })

export type PurchaseInput = z.infer<typeof purchaseInput>
