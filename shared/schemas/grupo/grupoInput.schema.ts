import { z } from 'zod'
import { grupoBase } from './grupoBase.schema'

export const grupoInput = grupoBase.pick({ nome: true })
export type GrupoInput = z.infer<typeof grupoInput>
