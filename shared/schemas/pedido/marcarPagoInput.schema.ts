import { z } from 'zod'
import { MetodoPagamentoEnum } from '../enums'

export const marcarPagoInput = z.object({
  metodoPagamento: MetodoPagamentoEnum,
})

export type MarcarPagoInput = z.infer<typeof marcarPagoInput>
