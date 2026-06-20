import { z } from 'zod'
import { menuItemBase } from './menuItemBase.schema'

export const menuItemInput = menuItemBase.pick({ weekId: true, recipeId: true })
export type MenuItemInput = z.infer<typeof menuItemInput>
