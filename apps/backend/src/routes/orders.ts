import { Elysia } from 'elysia'
import { OrdersRepository } from '../repositories/orders.repository'
import { OrdersService } from '../services/orders.service'
import { OrdersController } from '../controllers/orders.controller'
import { orderInput } from '@marmitaria/schemas/order/orderInput.schema'
import { markPaidInput } from '@marmitaria/schemas/order/markPaidInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new OrdersRepository()
const service = new OrdersService(repository)
const controller = new OrdersController(service)

export const ordersRoutes = new Elysia({ prefix: '/orders' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
    if (error instanceof ConflictError) {
      set.status = 409
      return { message: error.message }
    }
  })
  .get('/', ({ query, set }) => {
    if (!query.weekId) {
      set.status = 400
      return { message: 'weekId é obrigatório' }
    }
    return controller.listByWeek(query.weekId)
  })
  .get('/:id', ({ params: { id } }) => controller.getById(id))
  .post('/', ({ body }) => controller.create(orderInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, orderInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
  .patch('/:id/mark-produced', ({ params: { id } }) => controller.markProduced(id))
  .patch('/:id/mark-paid', ({ params: { id }, body }) => controller.markPaid(id, markPaidInput.parse(body)))
  .patch('/:id/revert-to-pending', ({ params: { id } }) => controller.revertToPending(id))
  .patch('/:id/revert-to-produced', ({ params: { id } }) => controller.revertToProduced(id))
