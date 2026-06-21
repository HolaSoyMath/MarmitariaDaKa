import { formatCurrency } from './currency'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

export function formatOrderItems(order: OrderResponse): string {
  return order.items
    .map((item) => `${item.priceType.type} ${item.priceType.size} ×${item.quantity}`)
    .join(' · ')
}

export function formatOrderValue(order: OrderResponse): string {
  const pixTotal = order.items.reduce((s, i) => s + i.snapshotPixPrice * i.quantity, 0)
  const swileTotal = order.items.reduce((s, i) => s + i.snapshotSwilePrice * i.quantity, 0)

  if (order.status === 'paid' && order.paymentMethod) {
    const total = order.paymentMethod === 'Pix' ? pixTotal : swileTotal
    return `${order.paymentMethod} ${formatCurrency(total)}`
  }
  return formatCurrency(pixTotal)
}
