import { z } from 'zod'
import { receitaBase } from './receitaBase.schema'
import { ingredienteResponse } from '../ingrediente/ingredienteResponse.schema'

const receitaIngredienteResponse = z.object({
  ingredienteId: z.string().uuid(),
  quantidade: z.number(),
  ingrediente: ingredienteResponse,
})

export const receitaResponse = receitaBase
  .pick({ id: true, nome: true })
  .extend({
    ingredientes: z.array(receitaIngredienteResponse),
    ultimaVezNoCardapio: z.string().nullable(),
  })

export type ReceitaResponse = z.infer<typeof receitaResponse>
