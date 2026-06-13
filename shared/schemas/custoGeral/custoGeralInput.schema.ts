import { z } from 'zod'
import { generalCostBase } from './custoGeralBase.schema'

export const generalCostInput = generalCostBase.pick({ semanaId: true, descricao: true, valor: true })
export type GeneralCostInput = z.infer<typeof generalCostInput>
