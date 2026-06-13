import { z } from 'zod'
import { orderBase } from './pedidoBase.schema'

const orderItemInput = z.object({
  tipoPrecoId: z.string().uuid(),
  quantidade: z.number().int().positive(),
})

export const orderInput = orderBase
  .pick({ semanaId: true, clienteId: true })
  .extend({ itens: z.array(orderItemInput).min(1) })

export type OrderInput = z.infer<typeof orderInput>
