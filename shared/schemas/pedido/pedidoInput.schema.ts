import { z } from 'zod'
import { pedidoBase } from './pedidoBase.schema'

const pedidoItemInput = z.object({
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
})

export const pedidoInput = pedidoBase
  .pick({ semanaId: true, clienteId: true })
  .extend({ itens: z.array(pedidoItemInput).min(1) })

export type PedidoInput = z.infer<typeof pedidoInput>
