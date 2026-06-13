import { z } from 'zod'
import { generalCostBase } from './custoGeralBase.schema'

export const generalCostResponse = generalCostBase.pick({
  id: true,
  semanaId: true,
  descricao: true,
  valor: true,
  automatico: true,
})

export type GeneralCostResponse = z.infer<typeof generalCostResponse>
