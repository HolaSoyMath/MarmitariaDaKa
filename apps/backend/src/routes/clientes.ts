import { Elysia } from 'elysia'
import { ClientsRepository } from '../repositories/clientes.repository'
import { ClientsService } from '../services/clientes.service'
import { ClientsController } from '../controllers/clientes.controller'
import { clientInput } from '@marmitaria/schemas/cliente/clienteInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new ClientsRepository()
const service = new ClientsService(repository)
const controller = new ClientsController(service)

export const clientesRoutes = new Elysia({ prefix: '/clientes' })
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
