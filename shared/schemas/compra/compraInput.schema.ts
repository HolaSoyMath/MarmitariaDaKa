import { z } from 'zod'
import { compraBase } from './compraBase.schema'

const compraItemInput = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
  valorTotal: z.number().positive(),
  local: z.string().optional(),
})

export const compraInput = compraBase
  .pick({ semanaId: true })
  .extend({ itens: z.array(compraItemInput).min(1) })

export type CompraInput = z.infer<typeof compraInput>
