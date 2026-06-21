import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

export interface DishSummary {
  menuItemId: string
  recipeName: string
  totalQty: number
  sizes: { size: string; qty: number }[]
}

export function orderPixTotal(order: OrderResponse): number {
  return order.items.reduce((sum, item) => sum + item.snapshotPixPrice * item.quantity, 0)
}

export function orderSwileTotal(order: OrderResponse): number {
  return order.items.reduce((sum, item) => sum + item.snapshotSwilePrice * item.quantity, 0)
}

export function shortAmount(cents: number): string {
  if (cents % 100 === 0) return String(cents / 100)
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
