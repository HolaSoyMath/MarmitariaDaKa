import { z } from 'zod'
import { orderBase } from './orderBase.schema'

const orderItemInput = z.object({
  menuItemId: z.string().uuid(),
  priceTypeId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const orderInput = orderBase
  .pick({ weekId: true, clientId: true })
  .extend({ items: z.array(orderItemInput).min(1) })

export type OrderInput = z.infer<typeof orderInput>
