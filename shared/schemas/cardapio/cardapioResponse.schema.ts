import { z } from 'zod'
import { menuItemBase } from './cardapioBase.schema'
import { recipeResponse } from '../receita/receitaResponse.schema'

export const menuItemResponse = menuItemBase
  .pick({ id: true, semanaId: true, receitaId: true })
  .extend({ receita: recipeResponse })

export type MenuItemResponse = z.infer<typeof menuItemResponse>
