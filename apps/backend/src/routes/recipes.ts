import { Elysia } from 'elysia'
import { RecipesRepository } from '../repositories/recipes.repository'
import { PurchasesRepository } from '../repositories/purchases.repository'
import { WeeksRepository } from '../repositories/weeks.repository'
import { RecipeCostService } from '../services/recipeCost.service'
import { RecipesService } from '../services/recipes.service'
import { RecipesController } from '../controllers/recipes.controller'
import { recipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import { recipeActiveInput } from '@marmitaria/schemas/recipe/recipeActiveInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new RecipesRepository()
const purchasesRepository = new PurchasesRepository()
const weeksRepository = new WeeksRepository()
const recipeCostService = new RecipeCostService(purchasesRepository)
const service = new RecipesService(repository, recipeCostService, weeksRepository)
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
  .get('/', ({ query }) => controller.listAll(query.weekId as string | undefined))
  .get('/:id', ({ params: { id }, query }) => controller.getById(id, query.weekId as string | undefined))
  .post('/', ({ body }) => controller.create(recipeInput.parse(body)))
  .patch('/:id', ({ params: { id }, body }) => controller.update(id, recipeInput.parse(body)))
  .patch('/:id/active', ({ params: { id }, body }) =>
    controller.setActive(id, recipeActiveInput.parse(body).active),
  )
  .delete('/:id', async ({ params: { id }, set }) => {
    await controller.remove(id)
    set.status = 204
  })
