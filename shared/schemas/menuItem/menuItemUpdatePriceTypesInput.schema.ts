import { z } from 'zod'

export const menuItemUpdatePriceTypesInput = z.object({
  priceTypeIds: z.array(z.string().uuid()).min(1),
})

export type MenuItemUpdatePriceTypesInput = z.infer<typeof menuItemUpdatePriceTypesInput>
