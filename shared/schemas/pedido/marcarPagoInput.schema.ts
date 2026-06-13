import { z } from 'zod'
import { PaymentMethodEnum } from '../enums'

export const markPaidInput = z.object({
  metodoPagamento: PaymentMethodEnum,
})

export type MarkPaidInput = z.infer<typeof markPaidInput>
