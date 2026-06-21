import type { OrderStatus } from '@marmitaria/schemas/enums'

export type { OrderStatus }

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  produced: 'Produzido',
  paid: 'Pago',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  produced: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
}
