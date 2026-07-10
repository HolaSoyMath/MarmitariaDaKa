import { prisma } from '../lib/prisma'
import type { IPurchasesRepository, PurchaseWithItems, PurchaseItemWithWeek } from '../interfaces/purchases.interface'
import type { PurchaseInput } from '@marmitaria/schemas/purchase/purchaseInput.schema'
import type { PurchaseItem } from '@prisma/client'

const includeItems = {
  items: {
    where: { deletedAt: null as null },
    include: { ingredient: true },
  },
}

export class PurchasesRepository implements IPurchasesRepository {
  async findByWeek(weekId: string): Promise<PurchaseWithItems | null> {
    return prisma.purchase.findFirst({
      where: { weekId, deletedAt: null },
      include: includeItems,
    })
  }

  async findRecentItemsByIngredientIds(ingredientIds: string[]): Promise<PurchaseItemWithWeek[]> {
    return prisma.purchaseItem.findMany({
      where: { ingredientId: { in: ingredientIds }, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { purchase: { select: { week: { select: { year: true, weekNumber: true } } } } },
    })
  }

  async findLatestByIngredientIds(ingredientIds: string[]): Promise<PurchaseItem[]> {
    if (ingredientIds.length === 0) return []
    return prisma.purchaseItem.findMany({
      where: { ingredientId: { in: ingredientIds }, deletedAt: null },
      orderBy: [{ ingredientId: 'asc' }, { createdAt: 'desc' }],
      distinct: ['ingredientId'],
    })
  }

  async upsert(data: PurchaseInput, gasValue: number): Promise<PurchaseWithItems> {
    return prisma.$transaction(async tx => {
      let purchase = await tx.purchase.findFirst({
        where: { weekId: data.weekId, deletedAt: null },
      })

      if (!purchase) {
        purchase = await tx.purchase.create({ data: { weekId: data.weekId } })
      }

      await tx.purchaseItem.updateMany({
        where: { purchaseId: purchase.id, deletedAt: null },
        data: { deletedAt: new Date() },
      })

      await tx.purchaseItem.createMany({
        data: data.items.map(item => ({
          purchaseId: purchase!.id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          totalValue: item.totalValue,
          unitValue: item.totalValue / item.quantity,
          location: item.location ?? null,
        })),
      })

      const existingGas = await tx.generalCost.findFirst({
        where: { weekId: data.weekId, type: 'gas_percentage', deletedAt: null },
      })

      if (existingGas) {
        await tx.generalCost.update({ where: { id: existingGas.id }, data: { value: gasValue } })
      } else {
        await tx.generalCost.create({
          data: {
            weekId: data.weekId,
            description: 'Gás (calculado automaticamente)',
            value: gasValue,
            type: 'gas_percentage',
          },
        })
      }

      return tx.purchase.findFirst({
        where: { id: purchase.id },
        include: includeItems,
      }) as Promise<PurchaseWithItems>
    })
  }
}
