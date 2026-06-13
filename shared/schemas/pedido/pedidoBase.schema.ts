import { z } from 'zod'
import { StatusPedidoEnum, MetodoPagamentoEnum } from '../enums'

export const pedidoItemBase = z.object({
  id: z.string().uuid(),
  pedidoId: z.string().uuid(),
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  snapshotValorPix: z.number().nonnegative(),
  snapshotValorSwile: z.number().nonnegative(),
})

export const pedidoBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
  clienteId: z.string().uuid(),
  status: StatusPedidoEnum,
  metodoPagamento: MetodoPagamentoEnum.nullable(),
  deletedAt: z.date().nullable(),
})

export type PedidoBase = z.infer<typeof pedidoBase>
export type PedidoItemBase = z.infer<typeof pedidoItemBase>
