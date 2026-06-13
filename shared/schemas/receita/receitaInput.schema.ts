import { z } from 'zod'
import { receitaBase } from './receitaBase.schema'

const receitaIngredienteInput = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
})

export const receitaInput = receitaBase
  .pick({ nome: true })
  .extend({ ingredientes: z.array(receitaIngredienteInput) })

export type ReceitaInput = z.infer<typeof receitaInput>
