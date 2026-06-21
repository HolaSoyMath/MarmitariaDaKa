import type { PaymentMethod } from '@marmitaria/schemas/enums'

export type { PaymentMethod }

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  Pix: 'Pix',
  Swile: 'Swile',
}
