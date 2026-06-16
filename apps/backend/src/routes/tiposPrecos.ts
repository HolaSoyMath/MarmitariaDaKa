import { Elysia } from 'elysia'
import { PriceTypesRepository } from '../repositories/tiposPrecos.repository'
import { PriceTypesService } from '../services/tiposPrecos.service'
import { PriceTypesController } from '../controllers/tiposPrecos.controller'
import { priceTypeInput } from '@marmitaria/schemas/tipoPreco/tipoPrecoInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new PriceTypesRepository()
const service = new PriceTypesService(repository)
const controller = new PriceTypesController(service)

export const tiposPrecoRoutes = new Elysia({ prefix: '/tipos-precos' })
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
