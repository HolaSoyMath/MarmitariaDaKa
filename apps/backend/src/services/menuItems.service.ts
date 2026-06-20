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
    return this.repository.create(data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    if (await this.repository.hasActiveOrders(id)) {
      throw new ConflictError('Prato possui pedidos ativos e não pode ser removido do cardápio')
    }
    await this.repository.softDelete(id)
  }
}
