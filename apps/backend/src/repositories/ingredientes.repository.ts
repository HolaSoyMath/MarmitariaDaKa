import { prisma } from '../lib/prisma'
import type { Ingredient } from '@prisma/client'
import type { IIngredientsRepository } from '../interfaces/ingredientes.interface'
import type { IngredientInput } from '@marmitaria/schemas/ingrediente/ingredienteInput.schema'

export class IngredientsRepository implements IIngredientsRepository {
  async findAll(): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({ where: { deletedAt: null } })
  }

  async findById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findFirst({ where: { id, deletedAt: null } })
  }

  async create(data: IngredientInput): Promise<Ingredient> {
    return prisma.ingredient.create({ data })
  }

  async update(id: string, data: IngredientInput): Promise<Ingredient> {
    return prisma.ingredient.update({ where: { id }, data })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.ingredient.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
