import type { PurchasesService } from '../services/purchases.service'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import type { PurchaseResponse } from '@marmitaria/schemas/purchase/purchaseResponse.schema'
import type { PurchaseWithItems } from '../interfaces/purchases.interface'
import type { IngredientUnit } from '@marmitaria/schemas/enums'

export class PurchasesController {
  constructor(private service: PurchasesService) {}

  private format(purchase: PurchaseWithItems): PurchaseResponse {
    return {
      id: purchase.id,
      weekId: purchase.weekId,
      items: purchase.items.map(item => ({
        id: item.id,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        totalValue: item.totalValue,
        unitValue: item.unitValue,
        location: item.location,
        createdAt: item.createdAt,
        ingredient: {
          id: item.ingredient.id,
          name: item.ingredient.name,
          unit: item.ingredient.unit as IngredientUnit,
        },
      })),
    }
  }

  async getByWeek(weekId: string): Promise<PurchaseResponse | null> {
    const purchase = await this.service.getByWeek(weekId)
    if (!purchase) return null
    return this.format(purchase)
  }

  async upsert(data: PurchaseInput): Promise<PurchaseResponse> {
    const purchase = await this.service.upsert(data)
    return this.format(purchase)
  }
}
