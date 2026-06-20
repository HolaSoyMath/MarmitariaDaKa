import { z } from 'zod'

export const menuItemBase = z.object({
  id: z.string().uuid(),
  weekId: z.string().uuid(),
  recipeId: z.string().uuid(),
})

export type MenuItemBase = z.infer<typeof menuItemBase>
