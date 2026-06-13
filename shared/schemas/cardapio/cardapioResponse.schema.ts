import { z } from 'zod'
import { cardapioBase } from './cardapioBase.schema'
import { receitaResponse } from '../receita/receitaResponse.schema'

export const cardapioResponse = cardapioBase
  .pick({ id: true, semanaId: true, receitaId: true })
  .extend({ receita: receitaResponse })

export type CardapioResponse = z.infer<typeof cardapioResponse>
