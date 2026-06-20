import { z } from 'zod'
import { priceTypeBase } from './priceTypeBase.schema'

export const priceTypeInput = priceTypeBase.pick({
  type: true,
  size: true,
  pixPrice: true,
  swilePrice: true,
})

export type PriceTypeInput = z.infer<typeof priceTypeInput>
