import type {
  IRecipesRepository,
  RecipeWithCosts,
} from '../interfaces/recipes.interface'
import type { IWeeksRepository } from '../interfaces/weeks.interface'
import type { RecipeCostService } from './recipeCost.service'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import type { WeekRef } from '../lib/weekOrder'
import { NotFoundError, ConflictError } from '../lib/errors'

export class RecipesService {
  constructor(
    private repository: IRecipesRepository,
    private recipeCostService: RecipeCostService,
    private weeksRepository: IWeeksRepository,
  ) {}

  private async resolveWeek(weekId?: string): Promise<WeekRef | undefined> {
    if (!weekId) return undefined
    const week = await this.weeksRepository.findById(weekId)
    return week ? { year: week.year, weekNumber: week.weekNumber } : undefined
  }

  async listAll(weekId?: string): Promise<RecipeWithCosts[]> {
    const asOfWeek = await this.resolveWeek(weekId)
    return this.recipeCostService.attachCosts(await this.repository.findAll(), asOfWeek)
  }

  async getById(id: string, weekId?: string): Promise<RecipeWithCosts> {
    const asOfWeek = await this.resolveWeek(weekId)
    const recipe = await this.repository.findById(id)
    if (!recipe) throw new NotFoundError('Receita não encontrada')
    return this.recipeCostService.attachCost(recipe, asOfWeek)
  }

  async create(data: RecipeInput): Promise<RecipeWithCosts> {
    const existing = await this.repository.findByName(data.name)
    if (existing) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.recipeCostService.attachCost(await this.repository.create(data))
  }

  async update(id: string, data: RecipeInput): Promise<RecipeWithCosts> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Receita possui pedidos pendentes e não pode ser editada')
    }
    const existing = await this.repository.findByName(data.name)
    if (existing && existing.id !== id) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.recipeCostService.attachCost(await this.repository.update(id, data))
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Receita possui pedidos pendentes e não pode ser excluída')
    }
    await this.repository.softDelete(id)
  }

  async setActive(id: string, active: boolean): Promise<RecipeWithCosts> {
    await this.getById(id)
    return this.recipeCostService.attachCost(await this.repository.setActive(id, active))
  }
}
