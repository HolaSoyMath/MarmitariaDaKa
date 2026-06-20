import { z } from 'zod'
import { menuItemBase } from './menuItemBase.schema'
import { recipeResponse } from '../recipe/recipeResponse.schema'

export const menuItemResponse = menuItemBase
  .pick({ id: true, weekId: true, recipeId: true })
  .extend({ recipe: recipeResponse })

export type MenuItemResponse = z.infer<typeof menuItemResponse>
