import { z } from 'zod'

export const menuItemBase = z.object({
  id: z.string().uuid(),
  semanaId: z.string().uuid(),
  receitaId: z.string().uuid(),
})

export type MenuItemBase = z.infer<typeof menuItemBase>
