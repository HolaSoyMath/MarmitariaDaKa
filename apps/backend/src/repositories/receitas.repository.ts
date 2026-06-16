import { prisma } from '../lib/prisma'
import type { IRecipesRepository, RecipeWithIngredients } from '../interfaces/receitas.interface'
import type { RecipeInput } from '@marmitaria/schemas/receita/receitaInput.schema'

const includeIngredients = { include: { ingredient: true } }

const includeMenuItems = {
  where: { deletedAt: null as null },
  include: { week: true },
  orderBy: { createdAt: 'desc' as const },
  take: 1,
}

export class RecipesRepository implements IRecipesRepository {
  async findAll(): Promise<RecipeWithIngredients[]> {
    return prisma.recipe.findMany({
      where: { deletedAt: null },
      include: { ingredients: includeIngredients, menuItems: includeMenuItems },
    })
  }

  async findById(id: string): Promise<RecipeWithIngredients | null> {
    return prisma.recipe.findFirst({
      where: { id, deletedAt: null },
      include: { ingredients: includeIngredients, menuItems: includeMenuItems },
    })
  }

  async create(data: RecipeInput): Promise<RecipeWithIngredients> {
    return prisma.recipe.create({
      data: {
        nome: data.nome,
        ingredients: {
          create: data.ingredientes.map(i => ({
            ingredienteId: i.ingredienteId,
            quantidade: i.quantidade,
          })),
        },
      },
      include: { ingredients: includeIngredients, menuItems: includeMenuItems },
    })
  }

  async update(id: string, data: RecipeInput): Promise<RecipeWithIngredients> {
    return prisma.$transaction(async tx => {
      await tx.recipeIngredient.deleteMany({ where: { receitaId: id } })
      return tx.recipe.update({
        where: { id },
        data: {
          nome: data.nome,
          ingredients: {
            create: data.ingredientes.map(i => ({
              ingredienteId: i.ingredienteId,
              quantidade: i.quantidade,
            })),
          },
        },
        include: { ingredients: includeIngredients, menuItems: includeMenuItems },
      })
    })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.recipe.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async hasActiveOrders(id: string): Promise<boolean> {
    const count = await prisma.orderItem.count({
      where: {
        menuItem: { receitaId: id },
        order: { status: { in: ['pendente', 'produzido'] }, deletedAt: null },
        deletedAt: null,
      },
    })
    return count > 0
  }
}
