import { z } from 'zod'
import { cardapioBase } from './cardapioBase.schema'

export const cardapioInput = cardapioBase.pick({ semanaId: true, receitaId: true })
export type CardapioInput = z.infer<typeof cardapioInput>
