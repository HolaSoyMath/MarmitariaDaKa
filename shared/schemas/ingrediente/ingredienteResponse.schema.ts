import { z } from 'zod'
import { ingredienteBase } from './ingredienteBase.schema'

export const ingredienteResponse = ingredienteBase.pick({ id: true, nome: true, unidade: true })
export type IngredienteResponse = z.infer<typeof ingredienteResponse>
