import { z } from 'zod'
import { orderBase } from './pedidoBase.schema'
import { clientResponse } from '../cliente/clienteResponse.schema'
import { priceTypeResponse } from '../tipoPreco/tipoPrecoResponse.schema'

const orderItemResponse = z.object({
  id: z.string().uuid(),
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  snapshotValorPix: z.number(),
  snapshotValorSwile: z.number(),
  tipoPreco: priceTypeResponse,
})

export const orderResponse = orderBase
  .pick({ id: true, semanaId: true, clienteId: true, status: true, metodoPagamento: true })
  .extend({
    cliente: clientResponse,
    itens: z.array(orderItemResponse),
  })

export type OrderResponse = z.infer<typeof orderResponse>
