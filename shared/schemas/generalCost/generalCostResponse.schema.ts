import { z } from 'zod'
import { generalCostBase } from './generalCostBase.schema'

export const generalCostResponse = generalCostBase.pick({
  id: true,
  weekId: true,
  description: true,
  value: true,
  automatic: true,
})

export type GeneralCostResponse = z.infer<typeof generalCostResponse>
