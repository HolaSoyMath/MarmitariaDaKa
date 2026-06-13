import { z } from 'zod'
import { priceTypeBase } from './tipoPrecoBase.schema'

export const priceTypeInput = priceTypeBase.pick({
  tipo: true,
  tamanho: true,
  valorPix: true,
  valorSwile: true,
})

export type PriceTypeInput = z.infer<typeof priceTypeInput>
