import { z } from 'zod'
import { menuItemBase } from './cardapioBase.schema'
import { recipeResponse } from '../receita/receitaResponse.schema'

export const menuItemResponse = menuItemBase
  .pick({ id: true, weekId: true, recipeId: true })
  .extend({ recipe: recipeResponse })

export type MenuItemResponse = z.infer<typeof menuItemResponse>
