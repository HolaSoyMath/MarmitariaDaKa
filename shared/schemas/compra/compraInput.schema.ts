import { z } from 'zod'
import { purchaseBase } from './compraBase.schema'

const purchaseItemInput = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
  valorTotal: z.number().positive(),
  local: z.string().optional(),
})

export const purchaseInput = purchaseBase
  .pick({ semanaId: true })
  .extend({ itens: z.array(purchaseItemInput).min(1) })

export type PurchaseInput = z.infer<typeof purchaseInput>
