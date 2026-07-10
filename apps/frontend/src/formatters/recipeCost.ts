import { formatCurrency } from './currency'

interface CostBearingSize {
  totalAverageCost?: number | null
  isPartialAverageCost?: boolean
}

export interface CostRange {
  label: string | null
  hasPartialCost: boolean
}

export function getCostRange(sizes: CostBearingSize[]): CostRange {
  const costs = sizes
    .map((size) => size.totalAverageCost)
    .filter((c): c is number => c != null)

  if (costs.length === 0) return { label: null, hasPartialCost: false }

  const minCost = Math.min(...costs)
  const maxCost = Math.max(...costs)
  const label =
    minCost === maxCost
      ? formatCurrency(minCost)
      : `${formatCurrency(minCost)} – ${formatCurrency(maxCost)}`

  return { label, hasPartialCost: sizes.some((size) => size.isPartialAverageCost) }
}
