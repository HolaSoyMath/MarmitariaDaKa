import { Elysia } from 'elysia'
import { GeneralCostsRepository } from '../repositories/generalCosts.repository'
import { GeneralCostsService } from '../services/generalCosts.service'
import { GeneralCostsController } from '../controllers/generalCosts.controller'
import { generalCostInput } from '@marmitaria/schemas/generalCost/generalCostInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new GeneralCostsRepository()
const service = new GeneralCostsService(repository)
const controller = new GeneralCostsController(service)

export const generalCostsRoutes = new Elysia({ prefix: '/general-costs' })
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
    return controller.getByWeek(query.weekId)
  })
  .post('/', ({ body }) => controller.create(generalCostInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) =>
    controller.update(id, generalCostInput.partial().parse(body))
  )
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
