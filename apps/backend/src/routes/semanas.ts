import { Elysia } from 'elysia'
import { WeeksRepository } from '../repositories/semanas.repository'
import { WeeksService } from '../services/semanas.service'
import { WeeksController } from '../controllers/semanas.controller'
import { weekInput } from '@marmitaria/schemas/semana/semanaInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new WeeksRepository()
const service = new WeeksService(repository)
const controller = new WeeksController(service)

export const semanasRoutes = new Elysia({ prefix: '/semanas' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
  })
  .post('/', ({ body }) => controller.open(weekInput.parse(body)))
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
