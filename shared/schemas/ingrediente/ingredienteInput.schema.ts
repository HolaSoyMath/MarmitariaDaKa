import { z } from 'zod'
import { ingredienteBase } from './ingredienteBase.schema'

export const ingredienteInput = ingredienteBase.pick({ nome: true, unidade: true })
export type IngredienteInput = z.infer<typeof ingredienteInput>
