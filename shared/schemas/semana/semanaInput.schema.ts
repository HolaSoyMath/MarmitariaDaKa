import { z } from 'zod'
import { weekBase } from './semanaBase.schema'

export const weekInput = weekBase.pick({ number: true, year: true })
export type WeekInput = z.infer<typeof weekInput>
