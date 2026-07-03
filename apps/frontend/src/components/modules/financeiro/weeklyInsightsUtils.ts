import { formatCurrency } from '@/formatters/currency'
import type { FinancialComparisonResponse } from '@marmitaria/schemas/financial/financialComparisonResponse.schema'
import type { FinancialDishLastSoldResponse } from '@marmitaria/schemas/financial/financialDishLastSoldResponse.schema'

export interface Insight {
  type: 'warning' | 'info'
  text: string
}

const STALE_DISH_THRESHOLD_WEEKS = 4
const PROFIT_DROP_THRESHOLD_PERCENT = 10

interface BuildInsightsArgs {
  comparison?: FinancialComparisonResponse
  toReceive: number
  dishLastSold: FinancialDishLastSoldResponse
}

export function buildWeeklyInsights({ comparison, toReceive, dishLastSold }: BuildInsightsArgs): Insight[] {
  const insights: Insight[] = []

  const profitPercent = comparison?.variation.profitPercent
  if (profitPercent != null && profitPercent < -PROFIT_DROP_THRESHOLD_PERCENT) {
    insights.push({
      type: 'warning',
      text: `Lucro ${Math.abs(profitPercent).toFixed(0)}% abaixo do período anterior.`,
    })
  } else if (profitPercent != null && profitPercent > PROFIT_DROP_THRESHOLD_PERCENT) {
    insights.push({
      type: 'info',
      text: `Lucro ${profitPercent.toFixed(0)}% acima do período anterior.`,
    })
  }

  if (toReceive > 0) {
    insights.push({
      type: 'info',
      text: `${formatCurrency(toReceive)} ainda a receber de pedidos já produzidos.`,
    })
  }

  const staleDish = dishLastSold.find(
    (d) => d.weeksSinceLastSold == null || d.weeksSinceLastSold > STALE_DISH_THRESHOLD_WEEKS,
  )
  if (staleDish) {
    insights.push({
      type: 'warning',
      text: staleDish.weeksSinceLastSold == null
        ? `${staleDish.recipeName} nunca foi vendida.`
        : `${staleDish.recipeName} não é vendida há ${staleDish.weeksSinceLastSold} semanas.`,
    })
  }

  return insights
}
