import type { IngredientUnit } from '@marmitaria/schemas/enums'

export type { IngredientUnit }

export const UNIT_LABELS: Record<IngredientUnit, string> = {
  g: 'gramas',
  kg: 'quilos',
  ml: 'mililitros',
  L: 'litros',
  un: 'unidade',
}

export const UNIT_DECIMALS: Record<IngredientUnit, number> = {
  g: 3,
  ml: 3,
  kg: 2,
  L: 2,
  un: 2,
}
