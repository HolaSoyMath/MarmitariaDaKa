import { z } from 'zod'
import { OrderStatusEnum, PaymentMethodEnum } from '../enums'

export const orderItemBase = z.object({
  id: z.string().uuid(),
  pedidoId: z.string().uuid(),
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  snapshotValorPix: z.number().nonnegative(),
  snapshotValorSwile: z.number().nonnegative(),
})

export const orderBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
  clienteId: z.string().uuid(),
  status: OrderStatusEnum,
  metodoPagamento: PaymentMethodEnum.nullable(),
  deletedAt: z.date().nullable(),
})

export type OrderBase = z.infer<typeof orderBase>
export type OrderItemBase = z.infer<typeof orderItemBase>
