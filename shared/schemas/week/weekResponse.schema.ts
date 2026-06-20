import { z } from 'zod'
import { weekBase } from './weekBase.schema'

export const weekResponse = weekBase.pick({ id: true, number: true, year: true })
export type WeekResponse = z.infer<typeof weekResponse>
