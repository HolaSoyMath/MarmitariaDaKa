import { z } from 'zod'
import { menuItemBase } from './menuItemBase.schema'

export const menuItemInput = menuItemBase
  .pick({ weekId: true, recipeId: true })
  .extend({ priceTypeIds: z.array(z.string().uuid()).min(1) })
export type MenuItemInput = z.infer<typeof menuItemInput>
