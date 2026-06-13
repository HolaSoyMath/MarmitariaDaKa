import { z } from 'zod'
import { custoGeralBase } from './custoGeralBase.schema'

export const custoGeralInput = custoGeralBase.pick({ semanaId: true, descricao: true, valor: true })
export type CustoGeralInput = z.infer<typeof custoGeralInput>
