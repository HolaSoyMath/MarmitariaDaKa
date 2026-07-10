import type { Purchase, PurchaseItem, Ingredient } from '@prisma/client'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import type { WeekRef } from '../lib/weekOrder'

export type PurchaseWithItems = Purchase & {
  items: (PurchaseItem & { ingredient: Ingredient })[]
}

export type PurchaseItemWithWeek = PurchaseItem & {
  purchase: { week: WeekRef }
}

export interface IPurchasesRepository {
  findByWeek(weekId: string): Promise<PurchaseWithItems | null>
  upsert(data: PurchaseInput, gasValue: number): Promise<PurchaseWithItems>
  findRecentItemsByIngredientIds(ingredientIds: string[]): Promise<PurchaseItemWithWeek[]>
  findLatestByIngredientIds(ingredientIds: string[]): Promise<PurchaseItem[]>
}
