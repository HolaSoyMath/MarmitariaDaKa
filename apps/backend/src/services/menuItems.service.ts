import type { IMenuItemsRepository, MenuItemWithRecipe } from '../interfaces/menuItems.interface'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class MenuItemsService {
  constructor(private repository: IMenuItemsRepository) {}

  async listByWeek(weekId: string): Promise<MenuItemWithRecipe[]> {
    return this.repository.findByWeek(weekId)
  }

  async getById(id: string): Promise<MenuItemWithRecipe> {
    const item = await this.repository.findById(id)
    if (!item) throw new NotFoundError('Item do cardápio não encontrado')
    return item
  }

  async add(data: MenuItemInput): Promise<MenuItemWithRecipe> {
    if (!(await this.repository.recipeExists(data.recipeId))) {
      throw new NotFoundError('Receita não encontrada')
    }
    const existing = await this.repository.findByWeekAndRecipe(data.weekId, data.recipeId)
    if (existing) throw new ConflictError('Receita já está no cardápio desta semana')
    await this.assertValidPriceTypeIds(data.recipeId, data.priceTypeIds)
    return this.repository.create(data)
  }

  async updatePriceTypes(id: string, priceTypeIds: string[]): Promise<MenuItemWithRecipe> {
    const item = await this.getById(id)
    await this.assertValidPriceTypeIds(item.recipeId, priceTypeIds)
    return this.repository.updatePriceTypes(id, priceTypeIds)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Prato possui pedidos pendentes e não pode ser removido do cardápio')
    }
    await this.repository.softDelete(id)
  }

  private async assertValidPriceTypeIds(recipeId: string, priceTypeIds: string[]): Promise<void> {
    const validIds = await this.repository.getRecipePriceTypeIds(recipeId)
    const invalid = priceTypeIds.some(id => !validIds.includes(id))
    if (invalid) {
      throw new ConflictError('Tamanho selecionado não está cadastrado nessa receita')
    }
  }
}
