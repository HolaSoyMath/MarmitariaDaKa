import { z } from 'zod'
import { orderBase } from './orderBase.schema'
import { clientResponse } from '../client/clientResponse.schema'
import { priceTypeResponse } from '../priceType/priceTypeResponse.schema'

const orderItemResponse = z.object({
  id: z.string().uuid(),
  menuItemId: z.string().uuid(),
  priceTypeId: z.string().uuid(),
  quantity: z.number().int().positive(),
  snapshotPixPrice: z.number(),
  snapshotSwilePrice: z.number(),
  priceType: priceTypeResponse,
})

export const orderResponse = orderBase
  .pick({ id: true, weekId: true, clientId: true, status: true, paymentMethod: true })
  .extend({
    client: clientResponse,
    items: z.array(orderItemResponse),
  })

export type OrderResponse = z.infer<typeof orderResponse>
