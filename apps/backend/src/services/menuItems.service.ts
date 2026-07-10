import type { IMenuItemsRepository, MenuItemWithRecipe, MenuItemWithRecipeCost } from '../interfaces/menuItems.interface'
import type { RecipeCostService } from './recipeCost.service'
import type { MenuItemInput } from '@marmitaria/schemas/menuItem/menuItemInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class MenuItemsService {
  constructor(
    private repository: IMenuItemsRepository,
    private recipeCostService: RecipeCostService,
  ) {}

  private async attachRecipeCost(item: MenuItemWithRecipe): Promise<MenuItemWithRecipeCost> {
    const recipe = await this.recipeCostService.attachCost(item.recipe, {
      year: item.week.year,
      weekNumber: item.week.weekNumber,
    })
    return { ...item, recipe }
  }

  async listByWeek(weekId: string): Promise<MenuItemWithRecipeCost[]> {
    const items = await this.repository.findByWeek(weekId)
    return Promise.all(items.map(item => this.attachRecipeCost(item)))
  }

  async getById(id: string): Promise<MenuItemWithRecipeCost> {
    const item = await this.repository.findById(id)
    if (!item) throw new NotFoundError('Item do cardápio não encontrado')
    return this.attachRecipeCost(item)
  }

  async add(data: MenuItemInput): Promise<MenuItemWithRecipeCost> {
    if (!(await this.repository.recipeExists(data.recipeId))) {
      throw new NotFoundError('Receita não encontrada')
    }
    const existing = await this.repository.findByWeekAndRecipe(data.weekId, data.recipeId)
    if (existing) throw new ConflictError('Receita já está no cardápio desta semana')
    await this.assertValidPriceTypeIds(data.recipeId, data.priceTypeIds)
    return this.attachRecipeCost(await this.repository.create(data))
  }

  async updatePriceTypes(id: string, priceTypeIds: string[]): Promise<MenuItemWithRecipeCost> {
    const item = await this.getById(id)
    await this.assertValidPriceTypeIds(item.recipeId, priceTypeIds)
    return this.attachRecipeCost(await this.repository.updatePriceTypes(id, priceTypeIds))
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
