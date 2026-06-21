import type { MenuItem, Recipe, RecipeIngredient, Ingredient, Week } from '@prisma/client'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'

export type MenuItemWithRecipe = MenuItem & {
  recipe: Recipe & {
    ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
    menuItems: (MenuItem & { week: Week })[]
  }
}

export interface IMenuItemsRepository {
  findByWeek(weekId: string): Promise<MenuItemWithRecipe[]>
  findById(id: string): Promise<MenuItemWithRecipe | null>
  findByWeekAndRecipe(weekId: string, recipeId: string): Promise<MenuItemWithRecipe | null>
  create(data: MenuItemInput): Promise<MenuItemWithRecipe>
  softDelete(id: string): Promise<void>
  recipeExists(recipeId: string): Promise<boolean>
  hasActiveOrders(menuItemId: string): Promise<boolean>
}
