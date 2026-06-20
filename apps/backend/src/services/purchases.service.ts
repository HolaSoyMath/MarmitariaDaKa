import type { IPurchasesRepository, PurchaseWithItems } from '../interfaces/purchases.interface'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import { ConfigRepository } from '../repositories/config.repository'

const configRepository = new ConfigRepository()

export class PurchasesService {
  constructor(private repository: IPurchasesRepository) {}

  async getByWeek(weekId: string): Promise<PurchaseWithItems | null> {
    return this.repository.findByWeek(weekId)
  }

  async upsert(data: PurchaseInput): Promise<PurchaseWithItems> {
    const config = await configRepository.getConfig()
    const totalIngredients = data.items.reduce((acc, i) => acc + i.totalValue, 0)
    const gasValue = Math.round(totalIngredients * config.gasPercentage)
    return this.repository.upsert(data, gasValue)
  }
}
