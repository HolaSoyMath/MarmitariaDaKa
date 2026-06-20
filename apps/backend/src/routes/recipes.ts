import { Elysia } from 'elysia'
import { RecipesRepository } from '../repositories/recipes.repository'
import { RecipesService } from '../services/recipes.service'
import { RecipesController } from '../controllers/recipes.controller'
import { recipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new RecipesRepository()
const service = new RecipesService(repository)
const controller = new RecipesController(service)

export const recipesRoutes = new Elysia({ prefix: '/recipes' })
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
  .post('/', ({ body }) => controller.create(recipeInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, recipeInput.parse(body)))
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
