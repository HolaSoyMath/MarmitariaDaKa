import { z } from 'zod'

export const OrderStatusEnum = z.enum(['pending', 'produced', 'paid'])
export type OrderStatus = z.infer<typeof OrderStatusEnum>

export const PaymentMethodEnum = z.enum(['Pix', 'Swile'])
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>

export const IngredientUnitEnum = z.enum(['g', 'kg', 'ml', 'L', 'un'])
export type IngredientUnit = z.infer<typeof IngredientUnitEnum>
