import { Elysia } from 'elysia'
import { WeeksRepository } from '../repositories/weeks.repository'
import { WeeksService } from '../services/weeks.service'
import { WeeksController } from '../controllers/weeks.controller'
import { weekInput } from '@marmitaria/schemas/week/weekInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new WeeksRepository()
const service = new WeeksService(repository)
const controller = new WeeksController(service)

export const weeksRoutes = new Elysia({ prefix: '/weeks' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
  })
  .post('/', ({ body }) => controller.open(weekInput.parse(body)))
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
