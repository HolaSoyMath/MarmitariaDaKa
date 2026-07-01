import type { IRecipesRepository, RecipeWithIngredients } from '../interfaces/recipes.interface'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class RecipesService {
  constructor(private repository: IRecipesRepository) {}

  async listAll(): Promise<RecipeWithIngredients[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<RecipeWithIngredients> {
    const recipe = await this.repository.findById(id)
    if (!recipe) throw new NotFoundError('Receita não encontrada')
    return recipe
  }

  async create(data: RecipeInput): Promise<RecipeWithIngredients> {
    const existing = await this.repository.findByName(data.name)
    if (existing) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.repository.create(data)
  }

  async update(id: string, data: RecipeInput): Promise<RecipeWithIngredients> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Receita possui pedidos pendentes e não pode ser editada')
    }
    const existing = await this.repository.findByName(data.name)
    if (existing && existing.id !== id) throw new ConflictError(`Já existe uma receita com o nome "${data.name}".`)
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    if (await this.repository.hasPendingOrders(id)) {
      throw new ConflictError('Receita possui pedidos pendentes e não pode ser excluída')
    }
    await this.repository.softDelete(id)
  }
}
