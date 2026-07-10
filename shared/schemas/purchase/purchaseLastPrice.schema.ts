import { z } from 'zod'
import { purchaseItemBase } from './purchaseBase.schema'

export const purchaseLastPriceResponse = purchaseItemBase.pick({
  ingredientId: true,
  quantity: true,
  totalValue: true,
  location: true,
})

export type PurchaseLastPriceResponse = z.infer<typeof purchaseLastPriceResponse>
