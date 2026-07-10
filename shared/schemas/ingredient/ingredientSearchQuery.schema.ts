import { z } from 'zod'

export const ingredientSearchQuery = z.object({ q: z.string().min(1) })
export type IngredientSearchQuery = z.infer<typeof ingredientSearchQuery>
