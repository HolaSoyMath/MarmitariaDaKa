import { Elysia } from 'elysia'
import { MenuItemsRepository } from '../repositories/menuItems.repository'
import { MenuItemsService } from '../services/menuItems.service'
import { MenuItemsController } from '../controllers/menuItems.controller'
import { menuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new MenuItemsRepository()
const service = new MenuItemsService(repository)
const controller = new MenuItemsController(service)

export const menuItemsRoutes = new Elysia({ prefix: '/menu-items' })
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
