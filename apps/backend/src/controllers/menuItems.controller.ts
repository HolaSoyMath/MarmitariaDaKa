import { MenuItemsService } from '../services/menuItems.service'
import type { MenuItemWithRecipe } from '../interfaces/menuItems.interface'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingredient/ingredientResponse.schema'

export class MenuItemsController {
  constructor(private service: MenuItemsService) {}

  private format(item: MenuItemWithRecipe): MenuItemResponse {
    const lastWeek = item.recipe.menuItems[0]?.week
    return {
      id: item.id,
      weekId: item.weekId,
      recipeId: item.recipeId,
      recipe: {
        id: item.recipe.id,
        name: item.recipe.name,
        active: item.recipe.active,
        priceTypes: item.recipe.priceTypes.map(rpt => ({
          id: rpt.priceType.id,
          type: rpt.priceType.type,
          size: rpt.priceType.size,
          pixPrice: rpt.priceType.pixPrice,
          swilePrice: rpt.priceType.swilePrice,
          ingredients: rpt.ingredients.map(ri => ({
            ingredientId: ri.ingredientId,
            quantity: ri.quantity,
            ingredient: {
              id: ri.ingredient.id,
              name: ri.ingredient.name,
              unit: ri.ingredient.unit as IngredientResponse['unit'],
            },
          })),
        })),
        lastOnMenu: lastWeek
          ? `Semana ${lastWeek.weekNumber}/${lastWeek.year}`
          : null,
      },
      priceTypes: item.priceTypes.map(mpt => ({
        id: mpt.priceType.id,
        type: mpt.priceType.type,
        size: mpt.priceType.size,
        pixPrice: mpt.priceType.pixPrice,
        swilePrice: mpt.priceType.swilePrice,
      })),
    }
  }

  async listByWeek(weekId: string): Promise<MenuItemResponse[]> {
    const items = await this.service.listByWeek(weekId)
    return items.map(i => this.format(i))
  }

  async add(data: MenuItemInput): Promise<MenuItemResponse> {
    return this.format(await this.service.add(data))
  }

  async updatePriceTypes(id: string, priceTypeIds: string[]): Promise<MenuItemResponse> {
    return this.format(await this.service.updatePriceTypes(id, priceTypeIds))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
