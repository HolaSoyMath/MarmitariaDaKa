import { Elysia } from 'elysia'
import { IngredientsRepository } from '../repositories/ingredientes.repository'
import { IngredientsService } from '../services/ingredientes.service'
import { IngredientsController } from '../controllers/ingredientes.controller'
import { ingredientInput } from '@marmitaria/schemas/ingrediente/ingredienteInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new IngredientsRepository()
const service = new IngredientsService(repository)
const controller = new IngredientsController(service)

export const ingredientesRoutes = new Elysia({ prefix: '/ingredientes' })
  .onError(({ error, set }) => {
    if (error instanceof NotFoundError) {
      set.status = 404
      return { message: error.message }
    }
  })
  .get('/', () => controller.listAll())
  .get('/:id', ({ params: { id } }) => controller.getById(id))
  .post('/', ({ body }) => controller.create(ingredientInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, ingredientInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
