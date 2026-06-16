import { z } from 'zod'
import { groupBase } from './grupoBase.schema'

export const groupResponse = groupBase.pick({ id: true, name: true })
export type GroupResponse = z.infer<typeof groupResponse>
