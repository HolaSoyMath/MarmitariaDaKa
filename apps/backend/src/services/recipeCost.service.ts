import type { IPurchasesRepository } from '../interfaces/purchases.interface'
import type { RecipeWithIngredients, RecipeWithCosts } from '../interfaces/recipes.interface'
import { compareWeeks, isWeekAtOrBefore, type WeekRef } from '../lib/weekOrder'

const RECENT_PURCHASES_LIMIT = 5

export class RecipeCostService {
  constructor(private purchasesRepository: IPurchasesRepository) {}

  async attachCosts(recipes: RecipeWithIngredients[], asOfWeek?: WeekRef): Promise<RecipeWithCosts[]> {
    const ingredientIds = [
      ...new Set(recipes.flatMap(r => r.priceTypes.flatMap(pt => pt.ingredients.map(i => i.ingredientId)))),
    ]
    const items = ingredientIds.length
      ? await this.purchasesRepository.findRecentItemsByIngredientIds(ingredientIds)
      : []

    // Without a reference week, keep today's "live" behavior: most recently recorded first.
    // With a reference week, only purchases up to (and including) that week count, ordered
    // by the week they belong to — not by when the row was created — so a retroactive edit
    // or a future week's purchase never contaminates a past week's cost.
    const eligibleItems = asOfWeek
      ? items.filter(item => isWeekAtOrBefore(item.purchase.week, asOfWeek))
      : items

    const sortedItems = asOfWeek
      ? [...eligibleItems].sort((a, b) => compareWeeks(b.purchase.week, a.purchase.week))
      : eligibleItems

    const itemsByIngredient = new Map<string, number[]>()
    for (const item of sortedItems) {
      const values = itemsByIngredient.get(item.ingredientId) ?? []
      if (values.length < RECENT_PURCHASES_LIMIT) values.push(item.unitValue)
      itemsByIngredient.set(item.ingredientId, values)
    }

    const averageByIngredient = new Map<string, number>()
    for (const [ingredientId, values] of itemsByIngredient) {
      averageByIngredient.set(ingredientId, Math.round(values.reduce((sum, v) => sum + v, 0) / values.length))
    }

    return recipes.map(recipe => ({
      ...recipe,
      priceTypes: recipe.priceTypes.map(pt => ({
        ...pt,
        ingredients: pt.ingredients.map(ri => ({
          ...ri,
          averageUnitCost: averageByIngredient.get(ri.ingredientId) ?? null,
        })),
      })),
    }))
  }

  async attachCost(recipe: RecipeWithIngredients, asOfWeek?: WeekRef): Promise<RecipeWithCosts> {
    const withCosts = await this.attachCosts([recipe], asOfWeek)
    return withCosts[0]!
  }
}
