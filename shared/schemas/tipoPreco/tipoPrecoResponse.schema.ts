import { z } from 'zod'
import { tipoPrecoBase } from './tipoPrecoBase.schema'

export const tipoPrecoResponse = tipoPrecoBase.pick({
  id: true,
  tipo: true,
  tamanho: true,
  valorPix: true,
  valorSwile: true,
})

export type TipoPrecoResponse = z.infer<typeof tipoPrecoResponse>
