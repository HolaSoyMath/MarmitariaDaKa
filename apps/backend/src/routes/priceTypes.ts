import { Elysia } from 'elysia'
import { PriceTypesRepository } from '../repositories/priceTypes.repository'
import { PriceTypesService } from '../services/priceTypes.service'
import { PriceTypesController } from '../controllers/priceTypes.controller'
import { priceTypeInput } from '@marmitaria/schemas/priceType/priceTypeInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new PriceTypesRepository()
const service = new PriceTypesService(repository)
const controller = new PriceTypesController(service)

export const priceTypesRoutes = new Elysia({ prefix: '/price-types' })
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
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
  .post('/', ({ body }) => controller.create(priceTypeInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, priceTypeInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
