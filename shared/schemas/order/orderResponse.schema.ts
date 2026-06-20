import { z } from 'zod'
import { orderBase, orderItemBase } from './orderBase.schema'
import { clientResponse } from '../client/clientResponse.schema'
import { priceTypeResponse } from '../priceType/priceTypeResponse.schema'

const orderItemResponse = orderItemBase
  .pick({ id: true, menuItemId: true, priceTypeId: true, quantity: true, snapshotPixPrice: true, snapshotSwilePrice: true })
  .extend({ priceType: priceTypeResponse })

export const orderResponse = orderBase
  .pick({ id: true, weekId: true, clientId: true, status: true, paymentMethod: true })
  .extend({
    client: clientResponse,
    items: z.array(orderItemResponse),
  })

export type OrderResponse = z.infer<typeof orderResponse>
