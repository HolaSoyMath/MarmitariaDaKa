import type { IOrdersRepository, OrderWithItems } from '../interfaces/orders.interface'
import type { OrderInput } from '@marmitaria/schemas/order/orderInput.schema'
import type { MarkPaidInput } from '@marmitaria/schemas/order/markPaidInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class OrdersService {
  constructor(private repository: IOrdersRepository) {}

  async listByWeek(weekId: string): Promise<OrderWithItems[]> {
    return this.repository.findByWeek(weekId)
  }

  async getById(id: string): Promise<OrderWithItems> {
    const order = await this.repository.findById(id)
    if (!order) throw new NotFoundError('Pedido não encontrado')
    return order
  }

  async create(data: OrderInput): Promise<OrderWithItems> {
    return this.repository.create(data)
  }

  async update(id: string, data: OrderInput): Promise<OrderWithItems> {
    const order = await this.getById(id)
    if (order.status !== 'pending') {
      throw new ConflictError('Pedido não pode ser editado pois não está pendente')
    }
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    const order = await this.getById(id)
    if (order.status !== 'pending') {
      throw new ConflictError('Pedido não pode ser excluído pois não está pendente')
    }
    await this.repository.softDelete(id)
  }

  async markProduced(id: string): Promise<OrderWithItems> {
    const order = await this.getById(id)
    if (order.status !== 'pending') {
      throw new ConflictError('Pedido precisa estar pendente para ser marcado como produzido')
    }
    return this.repository.updateStatus(id, 'produced')
  }

  async markPaid(id: string, data: MarkPaidInput): Promise<OrderWithItems> {
    const order = await this.getById(id)
    if (order.status !== 'produced') {
      throw new ConflictError('Pedido precisa estar produzido para ser marcado como pago')
    }
    return this.repository.updateStatus(id, 'paid', data.paymentMethod)
  }

  async revertToPending(id: string): Promise<OrderWithItems> {
    const order = await this.getById(id)
    if (order.status === 'pending') {
      throw new ConflictError('Pedido já está pendente')
    }
    return this.repository.updateStatus(id, 'pending', null)
  }
}
