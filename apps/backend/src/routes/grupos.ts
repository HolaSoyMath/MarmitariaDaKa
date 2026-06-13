import { Elysia } from 'elysia'
import { GroupsRepository } from '../repositories/grupos.repository'
import { GroupsService } from '../services/grupos.service'
import { GroupsController } from '../controllers/grupos.controller'
import { groupInput } from '@marmitaria/schemas/grupo/grupoInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new GroupsRepository()
const service = new GroupsService(repository)
const controller = new GroupsController(service)

export const gruposRoutes = new Elysia({ prefix: '/grupos' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
  })
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
  .post('/', ({ body }) => controller.create(groupInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, groupInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
