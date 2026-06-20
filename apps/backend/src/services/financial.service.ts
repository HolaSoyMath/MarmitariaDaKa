import { prisma } from '../lib/prisma'
import type { FinancialPeriod } from '@marmitaria/schemas/financial/financialPeriod.schema'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

function getIsoWeekRange(weekNumber: number, year: number): { start: Date; end: Date } {
  // Segunda-feira da ISO week: encontra o primeiro dia do ano e ajusta
  const jan4 = new Date(year, 0, 4) // 4 de jan sempre está na semana 1
  const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay()
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - (dayOfWeek - 1) + (weekNumber - 1) * 7)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
}

async function resolveWeekIds(period: FinancialPeriod): Promise<string[]> {
  if (period.type === 'week') return [period.weekId]

  const allWeeks = await prisma.week.findMany({
    where: { deletedAt: null },
    select: { id: true, weekNumber: true, year: true },
  })

  if (period.type === 'month') {
    const monthStart = new Date(period.year, period.month - 1, 1)
    const monthEnd = new Date(period.year, period.month, 0, 23, 59, 59, 999)
    return allWeeks
      .filter(w => {
        const { start, end } = getIsoWeekRange(w.weekNumber, w.year)
        return start <= monthEnd && end >= monthStart
      })
      .map(w => w.id)
  }

  // period.type === 'period'
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)
  end.setHours(23, 59, 59, 999)
  return allWeeks
    .filter(w => {
      const range = getIsoWeekRange(w.weekNumber, w.year)
      return range.start <= end && range.end >= start
    })
    .map(w => w.id)
}

export class FinancialService {
  async getReport(period: FinancialPeriod): Promise<FinancialReportResponse> {
    const weekIds = await resolveWeekIds(period)

    const [paidOrders, producedOrders, purchaseItems, generalCosts] = await Promise.all([
      prisma.order.findMany({
        where: { weekId: { in: weekIds }, status: 'paid', deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null },
            include: { menuItem: { include: { recipe: true } }, priceType: true },
          },
        },
      }),
      prisma.order.findMany({
        where: { weekId: { in: weekIds }, status: 'produced', deletedAt: null },
        include: { items: { where: { deletedAt: null } } },
      }),
      prisma.purchaseItem.findMany({
        where: {
          purchase: { weekId: { in: weekIds }, deletedAt: null },
          deletedAt: null,
        },
      }),
      prisma.generalCost.findMany({
        where: { weekId: { in: weekIds }, deletedAt: null },
      }),
    ])

    // Revenue: soma dos itens de pedidos pagos pelo método de pagamento do pedido
    let revenue = 0
    for (const order of paidOrders) {
      for (const item of order.items) {
        const price =
          order.paymentMethod === 'Swile' ? item.snapshotSwilePrice : item.snapshotPixPrice
        revenue += price * item.quantity
      }
    }

    // toReceive: pedidos produzidos (não pagos) com preço Pix (referência)
    let toReceive = 0
    for (const order of producedOrders) {
      for (const item of order.items) {
        toReceive += item.snapshotPixPrice * item.quantity
      }
    }

    // Cost: ingredientes + custos gerais (inclui gás)
    const ingredientCost = purchaseItems.reduce((acc, i) => acc + i.totalValue, 0)
    const generalCostTotal = generalCosts.reduce((acc, c) => acc + c.value, 0)
    const cost = ingredientCost + generalCostTotal

    const profit = revenue - cost
    const profitMarginPercent = revenue > 0 ? (profit / revenue) * 100 : 0

    // byMethod: agrupar pedidos pagos por método de pagamento
    const byMethod = {
      Pix: { quantity: 0, value: 0 },
      Swile: { quantity: 0, value: 0 },
    }
    for (const order of paidOrders) {
      const method = (order.paymentMethod ?? 'Pix') as 'Pix' | 'Swile'
      const orderValue = order.items.reduce((acc, item) => {
        const price = method === 'Swile' ? item.snapshotSwilePrice : item.snapshotPixPrice
        return acc + price * item.quantity
      }, 0)
      byMethod[method].quantity += 1
      byMethod[method].value += orderValue
    }

    // Dishes: agrupar por receita + tamanho do priceType
    const dishMap = new Map<
      string,
      { name: string; quantity: number; revenue: number; bySize: Map<string, { quantity: number; revenue: number }> }
    >()

    for (const order of paidOrders) {
      for (const item of order.items) {
        const recipeName = item.menuItem.recipe.name
        const size = item.priceType.size
        const price =
          order.paymentMethod === 'Swile' ? item.snapshotSwilePrice : item.snapshotPixPrice
        const itemRevenue = price * item.quantity

        if (!dishMap.has(recipeName)) {
          dishMap.set(recipeName, { name: recipeName, quantity: 0, revenue: 0, bySize: new Map() })
        }
        const dish = dishMap.get(recipeName)!
        dish.quantity += item.quantity
        dish.revenue += itemRevenue

        if (!dish.bySize.has(size)) dish.bySize.set(size, { quantity: 0, revenue: 0 })
        const sizeEntry = dish.bySize.get(size)!
        sizeEntry.quantity += item.quantity
        sizeEntry.revenue += itemRevenue
      }
    }

    const dishes = Array.from(dishMap.values()).map(d => ({
      name: d.name,
      quantity: d.quantity,
      revenue: d.revenue,
      bySize: Array.from(d.bySize.entries()).map(([size, s]) => ({
        size,
        quantity: s.quantity,
        revenue: s.revenue,
      })),
    }))

    return { revenue, cost, profit, profitMarginPercent, toReceive, byMethod, dishes }
  }
}
