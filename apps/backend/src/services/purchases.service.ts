import type { IPurchasesRepository, PurchaseWithItems } from '../interfaces/purchases.interface'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import type { PurchaseItem } from '@prisma/client'
import { ConfigRepository } from '../repositories/config.repository'

const configRepository = new ConfigRepository()

export class PurchasesService {
  constructor(private repository: IPurchasesRepository) {}

  async getByWeek(weekId: string): Promise<PurchaseWithItems | null> {
    return this.repository.findByWeek(weekId)
  }

  async getLastPrices(ingredientIds: string[]): Promise<PurchaseItem[]> {
    if (ingredientIds.length === 0) return []
    return this.repository.findLatestByIngredientIds(ingredientIds)
  }

  async upsert(data: PurchaseInput): Promise<PurchaseWithItems> {
    const config = await configRepository.getConfig()
    const totalIngredients = data.items.reduce((acc, i) => acc + i.totalValue, 0)
    const gasValue = Math.round(totalIngredients * config.gasPercentage)
    return this.repository.upsert(data, gasValue)
  }
}
