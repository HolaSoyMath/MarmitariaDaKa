import { z } from 'zod'
import { PaymentMethodEnum } from '../enums'

export const markPaidInput = z.object({
  paymentMethod: PaymentMethodEnum,
})

export type MarkPaidInput = z.infer<typeof markPaidInput>
