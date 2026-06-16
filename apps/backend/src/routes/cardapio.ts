import { Elysia } from 'elysia'
import { MenuItemsRepository } from '../repositories/cardapio.repository'
import { MenuItemsService } from '../services/cardapio.service'
import { MenuItemsController } from '../controllers/cardapio.controller'
import { menuItemInput } from '@marmitaria/schemas/cardapio/cardapioInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new MenuItemsRepository()
const service = new MenuItemsService(repository)
const controller = new MenuItemsController(service)

export const menuItemRoutes = new Elysia({ prefix: '/cardapio' })
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
  .get('/', ({ query }) => controller.listByWeek(query.weekId as string))
  .post('/', ({ body }) => controller.add(menuItemInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
