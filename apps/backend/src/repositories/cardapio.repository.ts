import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { IMenuItemsRepository, MenuItemWithRecipe } from '../interfaces/cardapio.interface'
import type { MenuItemInput } from '@marmitaria/schemas/cardapio/cardapioInput.schema'
import { ConflictError } from '../lib/errors'

const includeRecipe = {
  recipe: {
    include: {
      ingredients: { include: { ingredient: true } },
      menuItems: {
        where: { deletedAt: null as null },
        include: { week: true },
        orderBy: { createdAt: 'desc' as const },
        take: 1,
      },
    },
  },
}

export class MenuItemsRepository implements IMenuItemsRepository {
  async findByWeek(weekId: string): Promise<MenuItemWithRecipe[]> {
    return prisma.menuItem.findMany({
      where: { weekId, deletedAt: null },
      include: includeRecipe,
    })
  }

  async findById(id: string): Promise<MenuItemWithRecipe | null> {
    return prisma.menuItem.findFirst({
      where: { id, deletedAt: null },
      include: includeRecipe,
    })
  }

  async create(data: MenuItemInput): Promise<MenuItemWithRecipe> {
    try {
      return await prisma.menuItem.create({
        data: { weekId: data.weekId, recipeId: data.recipeId },
        include: includeRecipe,
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictError('Receita já está no cardápio desta semana')
      }
      throw e
    }
  }

  async softDelete(id: string): Promise<void> {
    await prisma.menuItem.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async recipeExists(recipeId: string): Promise<boolean> {
    const r = await prisma.recipe.findFirst({ where: { id: recipeId, deletedAt: null } })
    return !!r
  }

  async hasActiveOrders(menuItemId: string): Promise<boolean> {
    const count = await prisma.orderItem.count({
      where: {
        menuItemId,
        order: { status: { in: ['pendente', 'produzido'] }, deletedAt: null },
        deletedAt: null,
      },
    })
    return count > 0
  }
}
