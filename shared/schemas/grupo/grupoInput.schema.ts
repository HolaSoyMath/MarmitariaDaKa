import { z } from 'zod'
import { groupBase } from './grupoBase.schema'

export const groupInput = groupBase.pick({ name: true })
export type GroupInput = z.infer<typeof groupInput>
