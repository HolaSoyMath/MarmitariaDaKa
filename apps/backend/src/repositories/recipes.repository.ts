import { prisma } from '../lib/prisma'
import type { IRecipesRepository, RecipeWithIngredients } from '../interfaces/recipes.interface'
import type { RecipeInput } from '@marmitaria/schemas/recipe/recipeInput.schema'

const includePriceTypes = {
  include: {
    priceType: true,
    ingredients: { include: { ingredient: true } },
  },
}

const includeMenuItems = {
  where: { deletedAt: null as null },
  include: { week: true },
  orderBy: { createdAt: 'desc' as const },
  take: 1,
}

const includeAll = {
  priceTypes: includePriceTypes,
  menuItems: includeMenuItems,
}

function buildSizesCreate(sizes: RecipeInput['sizes']) {
  return sizes.map(size => ({
    priceTypeId: size.priceTypeId,
    ingredients: {
      create: size.ingredients.map(i => ({
        ingredientId: i.ingredientId,
        quantity: i.quantity,
      })),
    },
  }))
}

export class RecipesRepository implements IRecipesRepository {
  async findAll(): Promise<RecipeWithIngredients[]> {
    return prisma.recipe.findMany({
      where: { deletedAt: null },
      include: includeAll,
    })
  }

  async findById(id: string): Promise<RecipeWithIngredients | null> {
    return prisma.recipe.findFirst({
      where: { id, deletedAt: null },
      include: includeAll,
    })
  }

  async findByName(name: string): Promise<RecipeWithIngredients | null> {
    return prisma.recipe.findFirst({
      where: { name, deletedAt: null },
      include: includeAll,
    })
  }

  async create(data: RecipeInput): Promise<RecipeWithIngredients> {
    return prisma.recipe.create({
      data: {
        name: data.name,
        priceTypes: {
          create: buildSizesCreate(data.sizes),
        },
      },
      include: includeAll,
    })
  }

  async update(id: string, data: RecipeInput): Promise<RecipeWithIngredients> {
    return prisma.$transaction(async tx => {
      await tx.recipePriceType.deleteMany({ where: { recipeId: id } })
      return tx.recipe.update({
        where: { id },
        data: {
          name: data.name,
          priceTypes: {
            create: buildSizesCreate(data.sizes),
          },
        },
        include: includeAll,
      })
    })
  }

  async softDelete(id: string): Promise<void> {
    await prisma.recipe.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async setActive(id: string, active: boolean): Promise<RecipeWithIngredients> {
    return prisma.recipe.update({
      where: { id },
      data: { active },
      include: includeAll,
    })
  }

  async hasPendingOrders(id: string): Promise<boolean> {
    const count = await prisma.orderItem.count({
      where: {
        menuItem: { recipeId: id },
        order: { status: 'pending', deletedAt: null },
        deletedAt: null,
      },
    })
    return count > 0
  }
}
