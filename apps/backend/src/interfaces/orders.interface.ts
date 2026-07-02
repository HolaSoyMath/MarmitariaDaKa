import type { Order, OrderItem, Client, Group, PriceType, MenuItem, Recipe } from '@prisma/client'
import type { OrderInput } from '@marmitaria/schemas/order/orderInput.schema'

export type OrderWithItems = Order & {
  client: Client & { group: Group }
  items: (OrderItem & {
    priceType: PriceType
    menuItem: MenuItem & { recipe: Recipe }
  })[]
}

export interface IOrdersRepository {
  findByWeek(weekId: string): Promise<OrderWithItems[]>
  findById(id: string): Promise<OrderWithItems | null>
  create(data: OrderInput): Promise<OrderWithItems>
  update(id: string, data: OrderInput): Promise<OrderWithItems>
  softDelete(id: string): Promise<void>
  updateStatus(id: string, status: string, paymentMethod?: string | null): Promise<OrderWithItems>
}
