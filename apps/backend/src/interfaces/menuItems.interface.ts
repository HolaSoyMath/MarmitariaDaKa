import type { MenuItem, Recipe, RecipeIngredient, Ingredient, RecipePriceType, MenuItemPriceType, PriceType, Week } from '@prisma/client'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'

export type MenuItemWithRecipe = MenuItem & {
  recipe: Recipe & {
    ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
    priceTypes: (RecipePriceType & { priceType: PriceType })[]
    menuItems: (MenuItem & { week: Week })[]
  }
  priceTypes: (MenuItemPriceType & { priceType: PriceType })[]
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
