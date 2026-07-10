import { Elysia } from 'elysia'
import { PurchasesRepository } from '../repositories/purchases.repository'
import { PurchasesService } from '../services/purchases.service'
import { PurchasesController } from '../controllers/purchases.controller'
import { purchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const repository = new PurchasesRepository()
const service = new PurchasesService(repository)
const controller = new PurchasesController(service)

export const purchasesRoutes = new Elysia({ prefix: '/purchases' })
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
  .get('/last-prices', ({ query }) => {
    const ingredientIds = query.ingredientIds ? query.ingredientIds.split(',').filter(Boolean) : []
    return controller.getLastPrices(ingredientIds)
  })
  .post('/', ({ body }) => controller.upsert(purchaseInput.parse(body)))
