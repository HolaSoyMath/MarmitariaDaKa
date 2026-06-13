import { z } from 'zod'
import { weekBase } from './semanaBase.schema'

export const weekInput = weekBase.pick({ numero: true, ano: true })
export type WeekInput = z.infer<typeof weekInput>
