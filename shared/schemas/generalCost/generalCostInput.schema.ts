import { z } from 'zod'
import { generalCostBase } from './generalCostBase.schema'

export const generalCostInput = generalCostBase.pick({ weekId: true, description: true, value: true })
export type GeneralCostInput = z.infer<typeof generalCostInput>
