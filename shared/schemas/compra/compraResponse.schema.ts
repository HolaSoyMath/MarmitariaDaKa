import { z } from 'zod'
import { compraBase } from './compraBase.schema'
import { ingredienteResponse } from '../ingrediente/ingredienteResponse.schema'

const compraItemResponse = z.object({
  id: z.string().uuid(),
  ingredienteId: z.string().uuid(),
  quantidade: z.number(),
  valorTotal: z.number(),
  valorUnitario: z.number(),
  local: z.string().nullable(),
  createdAt: z.date(),
  ingrediente: ingredienteResponse,
})

export const compraResponse = compraBase
  .pick({ id: true, semanaId: true })
  .extend({ itens: z.array(compraItemResponse) })

export type CompraResponse = z.infer<typeof compraResponse>
