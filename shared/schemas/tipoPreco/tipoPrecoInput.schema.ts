import { z } from 'zod'
import { tipoPrecoBase } from './tipoPrecoBase.schema'

export const tipoPrecoInput = tipoPrecoBase.pick({
  tipo: true,
  tamanho: true,
  valorPix: true,
  valorSwile: true,
})

export type TipoPrecoInput = z.infer<typeof tipoPrecoInput>
