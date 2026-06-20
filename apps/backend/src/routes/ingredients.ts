import { Elysia } from 'elysia'
import { IngredientsRepository } from '../repositories/ingredients.repository'
import { IngredientsService } from '../services/ingredients.service'
import { IngredientsController } from '../controllers/ingredients.controller'
import { ingredientInput } from '@marmitaria/schemas/ingredient/ingredientInput.schema'
import { NotFoundError } from '../lib/errors'

const repository = new IngredientsRepository()
const service = new IngredientsService(repository)
const controller = new IngredientsController(service)

export const ingredientsRoutes = new Elysia({ prefix: '/ingredients' })
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
