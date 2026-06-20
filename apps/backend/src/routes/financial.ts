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

export const financialRoutes = new Elysia({ prefix: '/financial' }).get(
  '/',
  ({ query, set }) => {
    const period = parsePeriod(query as Record<string, string>)
    if (!period) {
      set.status = 400
      return { message: 'Parâmetros de período inválidos. Use type=week|month|period com os campos correspondentes.' }
    }
    return service.getReport(period)
  }
)
