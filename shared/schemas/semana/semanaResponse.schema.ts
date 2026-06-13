import { z } from 'zod'
import { semanaBase } from './semanaBase.schema'

export const semanaResponse = semanaBase.pick({ id: true, numero: true, ano: true })
export type SemanaResponse = z.infer<typeof semanaResponse>
