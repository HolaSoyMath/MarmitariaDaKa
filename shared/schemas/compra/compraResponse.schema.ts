import { z } from 'zod'
import { purchaseBase } from './compraBase.schema'
import { ingredientResponse } from '../ingrediente/ingredienteResponse.schema'

const purchaseItemResponse = z.object({
  id: z.string().uuid(),
  ingredienteId: z.string().uuid(),
  quantidade: z.number(),
  valorTotal: z.number(),
  valorUnitario: z.number(),
  local: z.string().nullable(),
  createdAt: z.date(),
  ingrediente: ingredientResponse,
})

export const purchaseResponse = purchaseBase
  .pick({ id: true, semanaId: true })
  .extend({ itens: z.array(purchaseItemResponse) })

export type PurchaseResponse = z.infer<typeof purchaseResponse>
