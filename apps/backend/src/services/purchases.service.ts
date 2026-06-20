import type { IPurchasesRepository, PurchaseWithItems } from '../interfaces/purchases.interface'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'

const GAS_PERCENTAGE = 0.05

export class PurchasesService {
  constructor(private repository: IPurchasesRepository) {}

  async getByWeek(weekId: string): Promise<PurchaseWithItems | null> {
    return this.repository.findByWeek(weekId)
  }

  async upsert(data: PurchaseInput): Promise<PurchaseWithItems> {
    const totalIngredients = data.items.reduce((acc, i) => acc + i.totalValue, 0)
    const gasValue = totalIngredients * GAS_PERCENTAGE
    return this.repository.upsert(data, gasValue)
  }
}
