import { z } from 'zod'
import { semanaBase } from './semanaBase.schema'

export const semanaInput = semanaBase.pick({ numero: true, ano: true })
export type SemanaInput = z.infer<typeof semanaInput>
