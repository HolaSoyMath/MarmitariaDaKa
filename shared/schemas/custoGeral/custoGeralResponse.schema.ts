import { z } from 'zod'
import { custoGeralBase } from './custoGeralBase.schema'

export const custoGeralResponse = custoGeralBase.pick({
  id: true,
  semanaId: true,
  descricao: true,
  valor: true,
  automatico: true,
})

export type CustoGeralResponse = z.infer<typeof custoGeralResponse>
