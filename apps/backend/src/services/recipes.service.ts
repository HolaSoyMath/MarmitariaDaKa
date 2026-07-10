import type {
  IRecipesRepository,
  RecipeWithIngredients,
  RecipeWithCosts,
} from '../interfaces/recipes.interface'
import type { IPurchasesRepository } from '../interfaces/purchases.interface'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

const RECENT_PURCHASES_LIMIT = 5

export class RecipesService {
  constructor(
    private repository: IRecipesRepository,
    private purchasesRepository: IPurchasesRepository,
  ) {}

  private async attachCosts(recipes: RecipeWithIngredients[]): Promise<RecipeWithCosts[]> {
    const ingredientIds = [
      ...new Set(recipes.flatMap(r => r.priceTypes.flatMap(pt => pt.ingredients.map(i => i.ingredientId)))),
    ]
    const items = ingredientIds.length
      ? await this.purchasesRepository.findRecentItemsByIngredientIds(ingredientIds)
      : []

    const itemsByIngredient = new Map<string, number[]>()
    for (const item of items) {
      const values = itemsByIngredient.get(item.ingredientId) ?? []
      if (values.length < RECENT_PURCHASES_LIMIT) values.push(item.unitValue)
      itemsByIngredient.set(item.ingredientId, values)
    }

    const averageByIngredient = new Map<string, number>()
    for (const [ingredientId, values] of itemsByIngredient) {
      averageByIngredient.set(ingredientId, Math.round(values.reduce((sum, v) => sum + v, 0) / values.length))
    }

    return recipes.map(recipe => ({
      ...recipe,
      priceTypes: recipe.priceTypes.map(pt => ({
        ...pt,
        ingredients: pt.ingredients.map(ri => ({
          ...ri,
          averageUnitCost: averageByIngredient.get(ri.ingredientId) ?? null,
        })),
      })),
    }))
  }

  private async attachCost(recipe: RecipeWithIngredients): Promise<RecipeWithCosts> {
    const withCosts = await this.attachCosts([recipe])
    return withCosts[0]!
  }

  async listAll(): Promise<RecipeWithCosts[]> {
    return this.attachCosts(await this.repository.findAll())
  }

  async getById(id: string): Promise<RecipeWithCosts> {
    const recipe = await this.repository.findById(id)
    if (!recipe) throw new NotFoundError('Receita não encontrada')
    return this.attachCost(recipe)
  }

  async create(data: RecipeInput): Promise<RecipeWithCosts> {
    const existing = await this.repository.findByName(data.name)
    if (existing) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.attachCost(await this.repository.create(data))
  }

  async update(id: string, data: RecipeInput): Promise<RecipeWithCosts> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Receita possui pedidos pendentes e não pode ser editada')
    }
    const existing = await this.repository.findByName(data.name)
    if (existing && existing.id !== id) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.attachCost(await this.repository.update(id, data))
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
    return this.attachCost(await this.repository.setActive(id, active))
  }
}
