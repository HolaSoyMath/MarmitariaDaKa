import { prisma } from '../lib/prisma'
import type { IOrdersRepository, OrderWithItems } from '../interfaces/orders.interface'
import type { OrderInput } from '@marmitaria/schemas/order/orderInput.schema'

const includeAll = {
  client: { include: { group: true } },
  items: {
    where: { deletedAt: null as null },
    include: {
      priceType: true,
      menuItem: { include: { recipe: true } },
    },
  },
}

export class OrdersRepository implements IOrdersRepository {
  async findByWeek(weekId: string): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      where: { weekId, deletedAt: null },
      include: includeAll,
      orderBy: { createdAt: 'desc' },
    }) as Promise<OrderWithItems[]>
  }

  async findById(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: includeAll,
    }) as Promise<OrderWithItems | null>
  }

  async findStatusById(id: string): Promise<{ id: string; status: string } | null> {
    return prisma.order.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true },
    })
  }

  async create(data: OrderInput): Promise<OrderWithItems> {
    const order = await prisma.$transaction(async tx => {
      const order = await tx.order.create({
        data: { weekId: data.weekId, clientId: data.clientId },
      })

      const itemsToCreate = data.items.filter(i => i.quantity > 0)

      if (itemsToCreate.length > 0) {
        const priceTypes = await tx.priceType.findMany({
          where: { id: { in: itemsToCreate.map(i => i.priceTypeId) }, deletedAt: null },
        })

        const priceMap = new Map(priceTypes.map(pt => [pt.id, pt]))

        await tx.orderItem.createMany({
          data: itemsToCreate.map(i => {
            const pt = priceMap.get(i.priceTypeId)!
            return {
              orderId: order.id,
              menuItemId: i.menuItemId,
              priceTypeId: i.priceTypeId,
              quantity: i.quantity,
              snapshotPixPrice: pt.pixPrice,
              snapshotSwilePrice: pt.swilePrice,
            }
          }),
        })
      }

      return order
    })

    return (await this.findById(order.id)) as OrderWithItems
  }

  async update(id: string, data: OrderInput): Promise<OrderWithItems> {
    await prisma.$transaction(async tx => {
      await tx.orderItem.updateMany({
        where: { orderId: id, deletedAt: null },
        data: { deletedAt: new Date() },
      })

      const itemsToCreate = data.items.filter(i => i.quantity > 0)

      if (itemsToCreate.length > 0) {
        const priceTypes = await tx.priceType.findMany({
          where: { id: { in: itemsToCreate.map(i => i.priceTypeId) }, deletedAt: null },
        })

        const priceMap = new Map(priceTypes.map(pt => [pt.id, pt]))

        await tx.orderItem.createMany({
          data: itemsToCreate.map(i => {
            const pt = priceMap.get(i.priceTypeId)!
            return {
              orderId: id,
              menuItemId: i.menuItemId,
              priceTypeId: i.priceTypeId,
              quantity: i.quantity,
              snapshotPixPrice: pt.pixPrice,
              snapshotSwilePrice: pt.swilePrice,
            }
          }),
        })
      }
    })

    return (await this.findById(id)) as OrderWithItems
  }

  async softDelete(id: string): Promise<void> {
    await prisma.order.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async updateStatus(id: string, status: string, paymentMethod?: string | null): Promise<OrderWithItems> {
    await prisma.order.update({
      where: { id },
      data: { status, ...(paymentMethod !== undefined && { paymentMethod }) },
    })

    return (await this.findById(id)) as OrderWithItems
  }
}
