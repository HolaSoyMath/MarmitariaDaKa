import { Elysia } from 'elysia'
import { FinancialService } from '../services/financial.service'
import { financialPeriod } from '@marmitaria/schemas/financial/financialPeriod.schema'
import type { FinancialPeriod } from '@marmitaria/schemas/financial/financialPeriod.schema'

const service = new FinancialService()

// Query params chegam como strings — montar objeto com coerção antes de validar
function parsePeriod(query: Record<string, string>): FinancialPeriod | null {
  const { type, weekId, month, year, startDate, endDate } = query

  let raw: unknown
  if (type === 'week') {
    raw = { type, weekId }
  } else if (type === 'month') {
    raw = { type, month: Number(month), year: Number(year) }
  } else if (type === 'period') {
    raw = { type, startDate, endDate }
  } else {
    return null
  }

  const result = financialPeriod.safeParse(raw)
  return result.success ? result.data : null
}

// Alguns endpoints (rankings) aceitam período opcional — sem 'type' na query, consideram todo o histórico
function parseOptionalPeriod(query: Record<string, string>): { period?: FinancialPeriod; invalid: boolean } {
  if (!query.type) return { invalid: false }
  const period = parsePeriod(query)
  return period ? { period, invalid: false } : { invalid: true }
}

const INVALID_PERIOD_MESSAGE = { message: 'Parâmetros de período inválidos. Use type=week|month|period com os campos correspondentes.' }

export const financialRoutes = new Elysia({ prefix: '/financial' })
  .get('/', ({ query, set }) => {
    const period = parsePeriod(query as Record<string, string>)
    if (!period) {
      set.status = 400
      return INVALID_PERIOD_MESSAGE
    }
    return service.getReport(period)
  })
  .get('/timeseries', ({ query, set }) => {
    const period = parsePeriod(query as Record<string, string>)
    if (!period) {
      set.status = 400
      return INVALID_PERIOD_MESSAGE
    }
    return service.getTimeseries(period)
  })
  .get('/comparison', ({ query, set }) => {
    const period = parsePeriod(query as Record<string, string>)
    if (!period) {
      set.status = 400
      return INVALID_PERIOD_MESSAGE
    }
    return service.getComparison(period)
  })
  .get('/record-week', () => service.getRecordWeek())
  .get('/ingredient-costs', ({ query }) => service.getIngredientCosts(query.ingredientId as string | undefined))
  .get('/dish-last-sold', () => service.getDishLastSold())
  .get('/client-ranking', ({ query, set }) => {
    const { period, invalid } = parseOptionalPeriod(query as Record<string, string>)
    if (invalid) {
      set.status = 400
      return INVALID_PERIOD_MESSAGE
    }
    return service.getClientRanking(period)
  })
  .get('/group-ranking', ({ query, set }) => {
    const { period, invalid } = parseOptionalPeriod(query as Record<string, string>)
    if (invalid) {
      set.status = 400
      return INVALID_PERIOD_MESSAGE
    }
    return service.getGroupRanking(period)
  })
  .get('/seasonality', ({ query, set }) => {
    const granularity = query.granularity as string
    if (granularity !== 'week' && granularity !== 'month' && granularity !== 'year') {
      set.status = 400
      return { message: 'Parâmetro granularity inválido. Use week|month|year.' }
    }
    const referenceNumber = query.number ? Number(query.number) : undefined
    return service.getSeasonality(granularity, referenceNumber)
  })
