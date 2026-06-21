import { prisma } from '../lib/prisma'
import type { Ingredient } from '@prisma/client'
import type { IIngredientsRepository } from '../interfaces/ingredients.interface'
import type { IngredientInput } from '@marmitaria/schemas/ingredient/ingredientInput.schema'

export class IngredientsRepository implements IIngredientsRepository {
  async findAll(): Promise<Ingredient[]> {
    return prisma.ingredient.findMany({ where: { deletedAt: null } })
  }

  async findById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findFirst({ where: { id, deletedAt: null } })
  }

  async findByName(name: string): Promise<Ingredient | null> {
    return prisma.ingredient.findFirst({ where: { name, deletedAt: null } })
  }

  async create(data: IngredientInput): Promise<Ingredient> {
    return prisma.ingredient.create({ data: { name: data.name, unit: data.unit } })
  }

  async update(id: string, data: IngredientInput): Promise<Ingredient> {
    return prisma.ingredient.update({ where: { id }, data: { name: data.name, unit: data.unit } })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.ingredient.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
