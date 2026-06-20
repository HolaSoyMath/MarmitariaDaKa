import type { Purchase, PurchaseItem, Ingredient } from '@prisma/client'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'

export type PurchaseWithItems = Purchase & {
  items: (PurchaseItem & { ingredient: Ingredient })[]
}

export interface IPurchasesRepository {
  findByWeek(weekId: string): Promise<PurchaseWithItems | null>
  upsert(data: PurchaseInput, gasValue: number): Promise<PurchaseWithItems>
}
