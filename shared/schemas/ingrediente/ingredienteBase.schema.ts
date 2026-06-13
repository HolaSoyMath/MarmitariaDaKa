import { z } from 'zod'
import { UnidadeIngredienteEnum } from '../enums'

export const ingredienteBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  unidade: UnidadeIngredienteEnum,
  deletedAt: z.date().nullable(),
})

export type IngredienteBase = z.infer<typeof ingredienteBase>
