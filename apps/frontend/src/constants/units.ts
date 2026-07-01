import type { IngredientUnit } from '@marmitaria/schemas/enums'

export type { IngredientUnit }

export const UNIT_LABELS: Record<IngredientUnit, string> = {
  g: 'Gramas',
  Kg: 'Quilos',
  Ml: 'Mililitros',
  L: 'Litros',
  Un: 'Unidade',
}

export const UNIT_DECIMALS: Record<IngredientUnit, number> = {
  g: 3,
  Ml: 3,
  Kg: 2,
  L: 2,
  Un: 2,
}
