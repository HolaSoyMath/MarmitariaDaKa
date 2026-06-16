import { z } from 'zod'
import { priceTypeBase } from './tipoPrecoBase.schema'

export const priceTypeResponse = priceTypeBase.pick({
  id: true,
  type: true,
  size: true,
  pixPrice: true,
  swilePrice: true,
})

export type PriceTypeResponse = z.infer<typeof priceTypeResponse>
