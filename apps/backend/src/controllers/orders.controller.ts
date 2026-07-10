import { OrdersService } from '../services/orders.service'
import type { OrderWithItems } from '../interfaces/orders.interface'
import type { OrderInput } from '@marmitaria/schemas/order/orderInput.schema'
import type { MarkPaidInput } from '@marmitaria/schemas/order/markPaidInput.schema'
import type { OrderResponse } from '@marmitaria/schemas/order/orderResponse.schema'

export class OrdersController {
  constructor(private service: OrdersService) {}

  private format(order: OrderWithItems): OrderResponse {
    return {
      id: order.id,
      weekId: order.weekId,
      clientId: order.clientId,
      status: order.status as OrderResponse['status'],
      paymentMethod: order.paymentMethod as OrderResponse['paymentMethod'],
      client: {
        id: order.client.id,
        name: order.client.name,
        groupId: order.client.groupId,
        group: { id: order.client.group.id, name: order.client.group.name },
      },
      items: order.items.map(item => ({
        id: item.id,
        menuItemId: item.menuItemId,
        priceTypeId: item.priceTypeId,
        quantity: item.quantity,
        snapshotPixPrice: item.snapshotPixPrice,
        snapshotSwilePrice: item.snapshotSwilePrice,
        priceType: {
          id: item.priceType.id,
          type: item.priceType.type,
          size: item.priceType.size,
          pixPrice: item.priceType.pixPrice,
          swilePrice: item.priceType.swilePrice,
          additionalCost: item.priceType.additionalCost,
        },
      })),
    }
  }

  async listByWeek(weekId: string): Promise<OrderResponse[]> {
    const orders = await this.service.listByWeek(weekId)
    return orders.map(o => this.format(o))
  }

  async getById(id: string): Promise<OrderResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: OrderInput): Promise<OrderResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: OrderInput): Promise<OrderResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }

  async markProduced(id: string): Promise<OrderResponse> {
    return this.format(await this.service.markProduced(id))
  }

  async markPaid(id: string, data: MarkPaidInput): Promise<OrderResponse> {
    return this.format(await this.service.markPaid(id, data))
  }

  async revertToPending(id: string): Promise<OrderResponse> {
    return this.format(await this.service.revertToPending(id))
  }

  async revertToProduced(id: string): Promise<OrderResponse> {
    return this.format(await this.service.revertToProduced(id))
  }
}
