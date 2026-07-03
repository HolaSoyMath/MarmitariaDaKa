import { prisma } from '../lib/prisma'
import type { FinancialPeriod } from '@marmitaria/schemas/financial/financialPeriod.schema'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'
import type { FinancialComparisonResponse } from '@marmitaria/schemas/financial/financialComparisonResponse.schema'
import type { FinancialRecordWeekResponse } from '@marmitaria/schemas/financial/financialRecordWeekResponse.schema'
import type {
  FinancialIngredientRankingResponse,
  FinancialIngredientSeriesResponse,
} from '@marmitaria/schemas/financial/financialIngredientCostResponse.schema'
import type { FinancialDishLastSoldResponse } from '@marmitaria/schemas/financial/financialDishLastSoldResponse.schema'
import type { FinancialRankingResponse } from '@marmitaria/schemas/financial/financialRankingResponse.schema'
import type { FinancialSeasonalityResponse } from '@marmitaria/schemas/financial/financialSeasonalityResponse.schema'

export type SeasonalityGranularity = 'week' | 'month' | 'year'

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

type WeekRef = { id: string; weekNumber: number; year: number }
type WeeklyTotals = { revenue: number; cost: number; byMethod: { Pix: { quantity: number; value: number }; Swile: { quantity: number; value: number } } }

async function resolveWeeks(period: FinancialPeriod): Promise<WeekRef[]> {
  if (period.type === 'week') {
    const week = await prisma.week.findUnique({
      where: { id: period.weekId },
      select: { id: true, weekNumber: true, year: true },
    })
    return week ? [week] : []
  }

  const allWeeks = await prisma.week.findMany({
    where: { deletedAt: null },
    select: { id: true, weekNumber: true, year: true },
  })

  if (period.type === 'month') {
    const monthStart = new Date(period.year, period.month - 1, 1)
    const monthEnd = new Date(period.year, period.month, 0, 23, 59, 59, 999)
    return allWeeks.filter(w => {
      const { start, end } = getIsoWeekRange(w.weekNumber, w.year)
      return start <= monthEnd && end >= monthStart
    })
  }

  // period.type === 'period'
  const start = new Date(period.startDate)
  const end = new Date(period.endDate)
  end.setHours(23, 59, 59, 999)
  return allWeeks.filter(w => {
    const range = getIsoWeekRange(w.weekNumber, w.year)
    return range.start <= end && range.end >= start
  })
}

async function resolveWeekIds(period: FinancialPeriod): Promise<string[]> {
  const weeks = await resolveWeeks(period)
  return weeks.map(w => w.id)
}

function computeItemRevenue(paymentMethod: string | null, item: { snapshotPixPrice: number; snapshotSwilePrice: number; quantity: number }): number {
  const price = paymentMethod === 'Swile' ? item.snapshotSwilePrice : item.snapshotPixPrice
  return price * item.quantity
}

function isoWeeksInYear(year: number): number {
  const p = (y: number) => (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7
  return p(year) === 4 || p(year - 1) === 3 ? 53 : 52
}

function offsetWeek(weekNumber: number, year: number, delta: -1 | 1): { weekNumber: number; year: number } {
  let num = weekNumber + delta
  let y = year
  if (num < 1) {
    y -= 1
    num = isoWeeksInYear(y)
  } else if (num > isoWeeksInYear(y)) {
    y += 1
    num = 1
  }
  return { weekNumber: num, year: y }
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

function emptyReport(): FinancialReportResponse {
  return {
    revenue: 0,
    cost: 0,
    profit: 0,
    profitMarginPercent: 0,
    toReceive: 0,
    averageTicket: 0,
    costBreakdown: { ingredients: 0, generalCosts: 0, gas: 0 },
    breakEven: { requiredQuantity: null, soldQuantity: 0 },
    byMethod: { Pix: { quantity: 0, value: 0 }, Swile: { quantity: 0, value: 0 } },
    dishes: [],
    bySize: [],
  }
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
    let soldQuantity = 0
    for (const order of paidOrders) {
      for (const item of order.items) {
        revenue += computeItemRevenue(order.paymentMethod, item)
        soldQuantity += item.quantity
      }
    }

    // toReceive: pedidos produzidos (não pagos) com preço Pix (referência)
    let toReceive = 0
    for (const order of producedOrders) {
      for (const item of order.items) {
        toReceive += item.snapshotPixPrice * item.quantity
      }
    }

    // Cost: ingredientes + custos gerais (gás separado dos demais custos gerais)
    const ingredientCost = purchaseItems.reduce((acc, i) => acc + i.totalValue, 0)
    const gasCost = generalCosts
      .filter(c => c.type === 'gas_percentage')
      .reduce((acc, c) => acc + c.value, 0)
    const otherGeneralCost = generalCosts
      .filter(c => c.type !== 'gas_percentage')
      .reduce((acc, c) => acc + c.value, 0)
    const cost = ingredientCost + otherGeneralCost + gasCost

    const profit = revenue - cost
    const profitMarginPercent = revenue > 0 ? (profit / revenue) * 100 : 0

    const averageTicket = paidOrders.length > 0 ? revenue / paidOrders.length : 0
    const averagePricePerUnit = soldQuantity > 0 ? revenue / soldQuantity : 0
    const requiredQuantity = averagePricePerUnit > 0 ? Math.ceil(cost / averagePricePerUnit) : null

    // byMethod: agrupar pedidos pagos por método de pagamento
    const byMethod = {
      Pix: { quantity: 0, value: 0 },
      Swile: { quantity: 0, value: 0 },
    }
    for (const order of paidOrders) {
      const method = (order.paymentMethod ?? 'Pix') as 'Pix' | 'Swile'
      const orderValue = order.items.reduce((acc, item) => acc + computeItemRevenue(order.paymentMethod, item), 0)
      byMethod[method].quantity += 1
      byMethod[method].value += orderValue
    }

    // Dishes: agrupar por receita + tamanho do priceType
    const dishMap = new Map<
      string,
      { name: string; quantity: number; revenue: number; bySize: Map<string, { quantity: number; revenue: number }> }
    >()
    // bySize global: agrupar por tamanho entre todas as receitas
    const sizeMap = new Map<string, { quantity: number; revenue: number }>()

    for (const order of paidOrders) {
      for (const item of order.items) {
        const recipeName = item.menuItem.recipe.name
        const size = item.priceType.size
        const itemRevenue = computeItemRevenue(order.paymentMethod, item)

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

        if (!sizeMap.has(size)) sizeMap.set(size, { quantity: 0, revenue: 0 })
        const globalSizeEntry = sizeMap.get(size)!
        globalSizeEntry.quantity += item.quantity
        globalSizeEntry.revenue += itemRevenue
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

    const bySize = Array.from(sizeMap.entries()).map(([size, s]) => ({
      size,
      quantity: s.quantity,
      revenue: s.revenue,
    }))

    return {
      revenue,
      cost,
      profit,
      profitMarginPercent,
      toReceive,
      averageTicket,
      costBreakdown: { ingredients: ingredientCost, generalCosts: otherGeneralCost, gas: gasCost },
      breakEven: { requiredQuantity, soldQuantity },
      byMethod,
      dishes,
      bySize,
    }
  }

  private async computeWeeklyTotals(weeks: WeekRef[]): Promise<Map<string, WeeklyTotals>> {
    const byWeek = new Map<string, WeeklyTotals>()
    for (const week of weeks) {
      byWeek.set(week.id, { revenue: 0, cost: 0, byMethod: { Pix: { quantity: 0, value: 0 }, Swile: { quantity: 0, value: 0 } } })
    }

    const weekIds = weeks.map(w => w.id)
    if (weekIds.length === 0) return byWeek

    const [paidOrders, purchaseItems, generalCosts] = await Promise.all([
      prisma.order.findMany({
        where: { weekId: { in: weekIds }, status: 'paid', deletedAt: null },
        include: { items: { where: { deletedAt: null } } },
      }),
      prisma.purchaseItem.findMany({
        where: { purchase: { weekId: { in: weekIds }, deletedAt: null }, deletedAt: null },
        include: { purchase: { select: { weekId: true } } },
      }),
      prisma.generalCost.findMany({ where: { weekId: { in: weekIds }, deletedAt: null } }),
    ])

    for (const order of paidOrders) {
      const entry = byWeek.get(order.weekId)
      if (!entry) continue
      const method = (order.paymentMethod ?? 'Pix') as 'Pix' | 'Swile'
      const orderValue = order.items.reduce((acc, item) => acc + computeItemRevenue(order.paymentMethod, item), 0)
      entry.revenue += orderValue
      entry.byMethod[method].quantity += 1
      entry.byMethod[method].value += orderValue
    }

    for (const item of purchaseItems) {
      const entry = byWeek.get(item.purchase.weekId)
      if (entry) entry.cost += item.totalValue
    }
    for (const cost of generalCosts) {
      const entry = byWeek.get(cost.weekId)
      if (entry) entry.cost += cost.value
    }

    return byWeek
  }

  async getTimeseries(period: FinancialPeriod): Promise<FinancialTimeseriesResponse> {
    const weeks = await resolveWeeks(period)
    const byWeek = await this.computeWeeklyTotals(weeks)

    return [...weeks]
      .sort((a, b) => a.year - b.year || a.weekNumber - b.weekNumber)
      .map(week => {
        const entry = byWeek.get(week.id)!
        const profit = entry.revenue - entry.cost
        return {
          weekId: week.id,
          weekNumber: week.weekNumber,
          year: week.year,
          revenue: entry.revenue,
          cost: entry.cost,
          profit,
          profitMarginPercent: entry.revenue > 0 ? (profit / entry.revenue) * 100 : 0,
          byMethod: entry.byMethod,
        }
      })
  }

  async getRecordWeek(): Promise<FinancialRecordWeekResponse> {
    const weeks = await prisma.week.findMany({
      where: { deletedAt: null },
      select: { id: true, weekNumber: true, year: true },
    })
    const byWeek = await this.computeWeeklyTotals(weeks)

    let bestRevenueWeek: FinancialRecordWeekResponse['bestRevenueWeek'] = null
    let bestProfitWeek: FinancialRecordWeekResponse['bestProfitWeek'] = null

    for (const week of weeks) {
      const entry = byWeek.get(week.id)!
      const profit = entry.revenue - entry.cost
      if (!bestRevenueWeek || entry.revenue > bestRevenueWeek.revenue) {
        bestRevenueWeek = { weekId: week.id, weekNumber: week.weekNumber, year: week.year, revenue: entry.revenue }
      }
      if (!bestProfitWeek || profit > bestProfitWeek.profit) {
        bestProfitWeek = { weekId: week.id, weekNumber: week.weekNumber, year: week.year, profit }
      }
    }

    return { bestRevenueWeek, bestProfitWeek }
  }

  async getIngredientCosts(ingredientId?: string): Promise<FinancialIngredientRankingResponse | FinancialIngredientSeriesResponse> {
    if (ingredientId) return this.getIngredientPriceSeries(ingredientId)
    return this.getIngredientRanking()
  }

  private async getIngredientRanking(): Promise<FinancialIngredientRankingResponse> {
    const items = await prisma.purchaseItem.findMany({
      where: { deletedAt: null, purchase: { deletedAt: null } },
      include: { ingredient: true, purchase: { select: { week: { select: { weekNumber: true, year: true } } } } },
    })

    const map = new Map<string, { name: string; totalValue: number; points: { year: number; weekNumber: number; unitValue: number }[] }>()
    for (const item of items) {
      if (!map.has(item.ingredientId)) {
        map.set(item.ingredientId, { name: item.ingredient.name, totalValue: 0, points: [] })
      }
      const entry = map.get(item.ingredientId)!
      entry.totalValue += item.totalValue
      entry.points.push({ year: item.purchase.week.year, weekNumber: item.purchase.week.weekNumber, unitValue: item.unitValue })
    }

    return Array.from(map.entries())
      .map(([ingredientId, entry]) => {
        const sortedPoints = [...entry.points].sort((a, b) => a.year - b.year || a.weekNumber - b.weekNumber)
        const first = sortedPoints[0]!.unitValue
        const last = sortedPoints[sortedPoints.length - 1]!.unitValue
        const changePercent = first ? ((last - first) / first) * 100 : null
        return { ingredientId, name: entry.name, totalValue: entry.totalValue, changePercent }
      })
      .sort((a, b) => b.totalValue - a.totalValue)
  }

  async getDishLastSold(): Promise<FinancialDishLastSoldResponse> {
    const [recipes, orderItems] = await Promise.all([
      prisma.recipe.findMany({ where: { active: true, deletedAt: null }, select: { id: true, name: true } }),
      prisma.orderItem.findMany({
        where: {
          deletedAt: null,
          order: { status: { in: ['paid', 'produced'] }, deletedAt: null },
          menuItem: { recipe: { active: true, deletedAt: null } },
        },
        include: {
          order: { select: { week: { select: { weekNumber: true, year: true } } } },
          menuItem: { select: { recipeId: true } },
        },
      }),
    ])

    const lastByRecipe = new Map<string, { weekNumber: number; year: number }>()
    for (const item of orderItems) {
      const week = item.order.week
      const current = lastByRecipe.get(item.menuItem.recipeId)
      if (!current || week.year > current.year || (week.year === current.year && week.weekNumber > current.weekNumber)) {
        lastByRecipe.set(item.menuItem.recipeId, { weekNumber: week.weekNumber, year: week.year })
      }
    }

    const now = Date.now()
    return recipes
      .map(recipe => {
        const last = lastByRecipe.get(recipe.id)
        if (!last) {
          return { recipeId: recipe.id, recipeName: recipe.name, lastSoldWeekNumber: null, lastSoldYear: null, weeksSinceLastSold: null }
        }
        const monday = getIsoWeekRange(last.weekNumber, last.year).start
        const weeksSinceLastSold = Math.floor((now - monday.getTime()) / (7 * 24 * 60 * 60 * 1000))
        return {
          recipeId: recipe.id,
          recipeName: recipe.name,
          lastSoldWeekNumber: last.weekNumber,
          lastSoldYear: last.year,
          weeksSinceLastSold,
        }
      })
      .sort((a, b) => (b.weeksSinceLastSold ?? Infinity) - (a.weeksSinceLastSold ?? Infinity))
  }

  async getClientRanking(period?: FinancialPeriod): Promise<FinancialRankingResponse> {
    const weekIds = period ? await resolveWeekIds(period) : null

    const paidOrders = await prisma.order.findMany({
      where: { status: 'paid', deletedAt: null, ...(weekIds ? { weekId: { in: weekIds } } : {}) },
      include: {
        items: { where: { deletedAt: null } },
        client: { select: { id: true, name: true } },
      },
    })

    const map = new Map<string, { name: string; quantity: number; value: number }>()
    for (const order of paidOrders) {
      if (!map.has(order.clientId)) map.set(order.clientId, { name: order.client.name, quantity: 0, value: 0 })
      const entry = map.get(order.clientId)!
      for (const item of order.items) {
        entry.quantity += item.quantity
        entry.value += computeItemRevenue(order.paymentMethod, item)
      }
    }

    return Array.from(map.entries())
      .map(([id, entry]) => ({ id, name: entry.name, quantity: entry.quantity, value: entry.value }))
      .sort((a, b) => b.value - a.value)
  }

  async getGroupRanking(period?: FinancialPeriod): Promise<FinancialRankingResponse> {
    const weekIds = period ? await resolveWeekIds(period) : null

    const paidOrders = await prisma.order.findMany({
      where: { status: 'paid', deletedAt: null, ...(weekIds ? { weekId: { in: weekIds } } : {}) },
      include: {
        items: { where: { deletedAt: null } },
        client: { select: { groupId: true, group: { select: { name: true } } } },
      },
    })

    const map = new Map<string, { name: string; quantity: number; value: number }>()
    for (const order of paidOrders) {
      const groupId = order.client.groupId
      if (!map.has(groupId)) map.set(groupId, { name: order.client.group.name, quantity: 0, value: 0 })
      const entry = map.get(groupId)!
      for (const item of order.items) {
        entry.quantity += item.quantity
        entry.value += computeItemRevenue(order.paymentMethod, item)
      }
    }

    return Array.from(map.entries())
      .map(([id, entry]) => ({ id, name: entry.name, quantity: entry.quantity, value: entry.value }))
      .sort((a, b) => b.value - a.value)
  }

  async getSeasonality(granularity: SeasonalityGranularity, referenceNumber?: number): Promise<FinancialSeasonalityResponse> {
    const rows = await prisma.week.findMany({ where: { deletedAt: null }, select: { year: true }, distinct: ['year'] })
    const years = rows.map(r => r.year).sort((a, b) => a - b)

    const results: FinancialSeasonalityResponse = []
    for (const year of years) {
      if (granularity === 'week') {
        if (referenceNumber == null) continue
        const week = await prisma.week.findFirst({ where: { weekNumber: referenceNumber, year, deletedAt: null }, select: { id: true } })
        if (!week) {
          results.push({ year, revenue: 0, cost: 0, profit: 0 })
          continue
        }
        const report = await this.getReport({ type: 'week', weekId: week.id })
        results.push({ year, revenue: report.revenue, cost: report.cost, profit: report.profit })
      } else if (granularity === 'month') {
        if (referenceNumber == null) continue
        const report = await this.getReport({ type: 'month', month: referenceNumber, year })
        results.push({ year, revenue: report.revenue, cost: report.cost, profit: report.profit })
      } else {
        const report = await this.getReport({ type: 'period', startDate: `${year}-01-01`, endDate: `${year}-12-31` })
        results.push({ year, revenue: report.revenue, cost: report.cost, profit: report.profit })
      }
    }

    return results
  }

  private async getIngredientPriceSeries(ingredientId: string): Promise<FinancialIngredientSeriesResponse> {
    const items = await prisma.purchaseItem.findMany({
      where: { ingredientId, deletedAt: null, purchase: { deletedAt: null } },
      include: { purchase: { select: { week: { select: { weekNumber: true, year: true } } } } },
    })

    return items
      .map(item => ({
        weekNumber: item.purchase.week.weekNumber,
        year: item.purchase.week.year,
        unitValue: item.unitValue,
        quantity: item.quantity,
        totalValue: item.totalValue,
      }))
      .sort((a, b) => a.year - b.year || a.weekNumber - b.weekNumber)
  }

  async getComparison(period: FinancialPeriod): Promise<FinancialComparisonResponse> {
    const [current, previous] = await Promise.all([this.getReport(period), this.getPreviousReport(period)])
    return {
      current,
      previous,
      variation: {
        revenuePercent: percentChange(current.revenue, previous.revenue),
        costPercent: percentChange(current.cost, previous.cost),
        profitPercent: percentChange(current.profit, previous.profit),
      },
    }
  }

  private async getPreviousReport(period: FinancialPeriod): Promise<FinancialReportResponse> {
    if (period.type === 'month') {
      const prevMonth = period.month === 1 ? 12 : period.month - 1
      const prevYear = period.month === 1 ? period.year - 1 : period.year
      return this.getReport({ type: 'month', month: prevMonth, year: prevYear })
    }

    if (period.type === 'period') {
      const start = new Date(period.startDate)
      const end = new Date(period.endDate)
      const durationMs = end.getTime() - start.getTime()
      const prevEnd = new Date(start)
      prevEnd.setDate(prevEnd.getDate() - 1)
      const prevStart = new Date(prevEnd.getTime() - durationMs)
      return this.getReport({
        type: 'period',
        startDate: prevStart.toISOString().slice(0, 10),
        endDate: prevEnd.toISOString().slice(0, 10),
      })
    }

    // type === 'week'
    const currentWeek = await prisma.week.findUnique({
      where: { id: period.weekId },
      select: { weekNumber: true, year: true },
    })
    if (!currentWeek) return emptyReport()

    const { weekNumber, year } = offsetWeek(currentWeek.weekNumber, currentWeek.year, -1)
    const previousWeek = await prisma.week.findFirst({
      where: { weekNumber, year, deletedAt: null },
      select: { id: true },
    })
    if (!previousWeek) return emptyReport()

    return this.getReport({ type: 'week', weekId: previousWeek.id })
  }
}
