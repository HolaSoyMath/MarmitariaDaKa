import type { MenuItem, MenuItemPriceType, PriceType, Week } from '@prisma/client'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import type { RecipeWithIngredients, RecipeWithCosts } from './recipes.interface'

export type MenuItemWithRecipe = MenuItem & {
  week: Week
  recipe: RecipeWithIngredients
  priceTypes: (MenuItemPriceType & { priceType: PriceType })[]
}

export type MenuItemWithRecipeCost = Omit<MenuItemWithRecipe, 'recipe'> & {
  recipe: RecipeWithCosts
}

export interface IMenuItemsRepository {
  findByWeek(weekId: string): Promise<MenuItemWithRecipe[]>
  findById(id: string): Promise<MenuItemWithRecipe | null>
  findByWeekAndRecipe(weekId: string, recipeId: string): Promise<MenuItemWithRecipe | null>
  create(data: MenuItemInput): Promise<MenuItemWithRecipe>
  updatePriceTypes(id: string, priceTypeIds: string[]): Promise<MenuItemWithRecipe>
  softDelete(id: string): Promise<void>
  recipeExists(recipeId: string): Promise<boolean>
  getRecipePriceTypeIds(recipeId: string): Promise<string[]>
  hasPendingOrders(menuItemId: string): Promise<boolean>
}
