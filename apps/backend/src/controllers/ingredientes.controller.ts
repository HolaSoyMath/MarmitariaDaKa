import { IngredientsService } from '../services/ingredientes.service'
import type { IngredientInput } from '@marmitaria/schemas/ingrediente/ingredienteInput.schema'
import type { IngredientResponse } from '@marmitaria/schemas/ingrediente/ingredienteResponse.schema'

export class IngredientsController {
  constructor(private service: IngredientsService) {}

  private format({ id, nome, unidade }: { id: string; nome: string; unidade: string }): IngredientResponse {
    return { id, nome, unidade: unidade as IngredientResponse['unidade'] }
  }

  async listAll(): Promise<IngredientResponse[]> {
    const ingredients = await this.service.listAll()
    return ingredients.map(i => this.format(i))
  }

  async getById(id: string): Promise<IngredientResponse> {
    return this.format(await this.service.getById(id))
  }

  async create(data: IngredientInput): Promise<IngredientResponse> {
    return this.format(await this.service.create(data))
  }

  async update(id: string, data: IngredientInput): Promise<IngredientResponse> {
    return this.format(await this.service.update(id, data))
  }

  async remove(id: string): Promise<void> {
    return this.service.remove(id)
  }
}
