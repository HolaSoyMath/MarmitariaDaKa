import type { Ingredient } from '@prisma/client'
import type { IngredientInput } from '@marmitaria/schemas/ingrediente/ingredienteInput.schema'

export interface IIngredientsRepository {
  findAll(): Promise<Ingredient[]>
  findById(id: string): Promise<Ingredient | null>
  create(data: IngredientInput): Promise<Ingredient>
  update(id: string, data: IngredientInput): Promise<Ingredient>
  softDelete(id: string): Promise<void>
}
