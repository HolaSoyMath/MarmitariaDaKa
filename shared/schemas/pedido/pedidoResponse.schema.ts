import { z } from 'zod'
import { pedidoBase } from './pedidoBase.schema'
import { clienteResponse } from '../cliente/clienteResponse.schema'
import { tipoPrecoResponse } from '../tipoPreco/tipoPrecoResponse.schema'

const pedidoItemResponse = z.object({
  id: z.string().uuid(),
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
  snapshotValorPix: z.number(),
  snapshotValorSwile: z.number(),
  tipoPreco: tipoPrecoResponse,
})

export const pedidoResponse = pedidoBase
  .pick({ id: true, semanaId: true, clienteId: true, status: true, metodoPagamento: true })
  .extend({
    cliente: clienteResponse,
    itens: z.array(pedidoItemResponse),
  })

export type PedidoResponse = z.infer<typeof pedidoResponse>
