import { Elysia } from 'elysia'
import { RecipesRepository } from '../repositories/receitas.repository'
import { RecipesService } from '../services/receitas.service'
import { RecipesController } from '../controllers/receitas.controller'
import { recipeInput } from '@marmitaria/schemas/receita/receitaInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new RecipesRepository()
const service = new RecipesService(repository)
const controller = new RecipesController(service)

export const receitasRoutes = new Elysia({ prefix: '/receitas' })
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
