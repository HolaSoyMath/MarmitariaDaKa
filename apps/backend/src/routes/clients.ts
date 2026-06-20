import { Elysia } from 'elysia'
import { ClientsRepository } from '../repositories/clients.repository'
import { ClientsService } from '../services/clients.service'
import { ClientsController } from '../controllers/clients.controller'
import { clientInput } from '@marmitaria/schemas/client/clientInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new ClientsRepository()
const service = new ClientsService(repository)
const controller = new ClientsController(service)

export const clientsRoutes = new Elysia({ prefix: '/clients' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
  })
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
  .post('/', ({ body }) => controller.create(clientInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, clientInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
