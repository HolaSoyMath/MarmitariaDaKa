import { z } from 'zod'
import { menuItemBase } from './cardapioBase.schema'

export const menuItemInput = menuItemBase.pick({ semanaId: true, receitaId: true })
export type MenuItemInput = z.infer<typeof menuItemInput>
