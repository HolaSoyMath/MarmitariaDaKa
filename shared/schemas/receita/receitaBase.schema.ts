import { z } from 'zod'

export const receitaIngredienteBase = z.object({
  receitaId: z.string().uuid(),
  ingredienteId: z.string().uuid(),
  quantidade: z.number().positive(),
})

export const receitaBase = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  deletedAt: z.date().nullable(),
})

export type ReceitaBase = z.infer<typeof receitaBase>
export type ReceitaIngredienteBase = z.infer<typeof receitaIngredienteBase>
