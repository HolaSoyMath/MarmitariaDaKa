import { z } from 'zod'
import { priceTypeBase } from './tipoPrecoBase.schema'

export const priceTypeResponse = priceTypeBase.pick({
  id: true,
  tipo: true,
  tamanho: true,
  valorPix: true,
  valorSwile: true,
})

export type PriceTypeResponse = z.infer<typeof priceTypeResponse>
