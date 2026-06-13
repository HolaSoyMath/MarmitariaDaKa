import { z } from 'zod'
import { weekBase } from './semanaBase.schema'

export const weekResponse = weekBase.pick({ id: true, numero: true, ano: true })
export type WeekResponse = z.infer<typeof weekResponse>
