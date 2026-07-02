import { UNIT_DECIMALS, type IngredientUnit } from '@/constants/units'

export function formatUnit(quantity: number, unit: IngredientUnit): string {
  const decimals = UNIT_DECIMALS[unit]
  return `${quantity.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${unit}`
}
