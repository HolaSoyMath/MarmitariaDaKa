import { z } from 'zod'
import { clientBase } from './clientBase.schema'

export const clientInput = clientBase.pick({ name: true, groupId: true })
export type ClientInput = z.infer<typeof clientInput>
