import { MenuItemsService } from '../services/menuItems.service'
import { formatRecipeWithCosts } from '../lib/formatRecipe'
import type { MenuItemWithRecipeCost } from '../interfaces/menuItems.interface'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import type { MenuItemResponse } from '@marmitaria/schemas/menuItem/menuItemResponse.schema'

export class MenuItemsController {
  constructor(private service: MenuItemsService) {}

  private format(item: MenuItemWithRecipeCost): MenuItemResponse {
    return {
      id: item.id,
      weekId: item.weekId,
      recipeId: item.recipeId,
      recipe: formatRecipeWithCosts(item.recipe),
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
