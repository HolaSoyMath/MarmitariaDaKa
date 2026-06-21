import type { Ingredient } from '@prisma/client'
import type { IIngredientsRepository } from '../interfaces/ingredients.interface'
import type { IngredientInput } from '@marmitaria/schemas/ingredient/ingredientInput.schema'
import { NotFoundError, ConflictError } from '../lib/errors'

export class IngredientsService {
  constructor(private repository: IIngredientsRepository) {}

  async listAll(): Promise<Ingredient[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Ingredient> {
    const ingredient = await this.repository.findById(id)
    if (!ingredient) throw new NotFoundError('Ingredient not found')
    return ingredient
  }

  async create(data: IngredientInput): Promise<Ingredient> {
    const existing = await this.repository.findByName(data.name)
    if (existing) throw new ConflictError(`Já existe um ingrediente com o nome "${data.name}".`)
    return this.repository.create(data)
  }

  async update(id: string, data: IngredientInput): Promise<Ingredient> {
    await this.getById(id)
    const existing = await this.repository.findByName(data.name)
    if (existing && existing.id !== id) throw new ConflictError(`Já existe um ingrediente com o nome "${data.name}".`)
    return this.repository.update(id, data)
  }

  async remove(id: string): Promise<void> {
    await this.getById(id)
    return this.repository.softDelete(id)
  }
}
