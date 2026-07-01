import { z } from 'zod'
import { recipeBase } from './recipeBase.schema'

export const recipeActiveInput = recipeBase.pick({ active: true })

export type RecipeActiveInput = z.infer<typeof recipeActiveInput>
