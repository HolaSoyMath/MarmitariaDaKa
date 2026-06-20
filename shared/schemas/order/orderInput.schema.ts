import { z } from 'zod'
import { orderBase, orderItemBase } from './orderBase.schema'

const orderItemInput = orderItemBase.pick({ menuItemId: true, priceTypeId: true, quantity: true })

export const orderInput = orderBase
  .pick({ weekId: true, clientId: true })
  .extend({ items: z.array(orderItemInput).min(1) })

export type OrderInput = z.infer<typeof orderInput>
