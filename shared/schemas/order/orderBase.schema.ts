import { z } from 'zod'
import { OrderStatusEnum, PaymentMethodEnum } from '../enums'

export const orderItemBase = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  priceTypeId: z.string().uuid(),
  quantity: z.number().int().positive(),
  snapshotPixPrice: z.number().nonnegative(),
  snapshotSwilePrice: z.number().nonnegative(),
})

export const orderBase = z.object({
  id: z.string().uuid(),
  weekId: z.string().uuid(),
  clientId: z.string().uuid(),
  status: OrderStatusEnum,
  paymentMethod: PaymentMethodEnum.nullable(),
  deletedAt: z.date().nullable(),
})

export type OrderBase = z.infer<typeof orderBase>
export type OrderItemBase = z.infer<typeof orderItemBase>
