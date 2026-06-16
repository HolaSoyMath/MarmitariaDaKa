import type { MenuItem, Recipe, RecipeIngredient, Ingredient, Week } from '@prisma/client'
import type { MenuItemInput } from '@marmitaria/schemas/cardapio/cardapioInput.schema'

export type MenuItemWithRecipe = MenuItem & {
  recipe: Recipe & {
    ingredients: (RecipeIngredient & { ingredient: Ingredient })[]
    menuItems: (MenuItem & { week: Week })[]
  }
}

export interface IMenuItemsRepository {
  findByWeek(semanaId: string): Promise<MenuItemWithRecipe[]>
  findById(id: string): Promise<MenuItemWithRecipe | null>
  create(data: MenuItemInput): Promise<MenuItemWithRecipe>
  softDelete(id: string): Promise<void>
  recipeExists(receitaId: string): Promise<boolean>
  hasActiveOrders(menuItemId: string): Promise<boolean>
}
