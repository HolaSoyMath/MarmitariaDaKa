import { z } from 'zod'
import { grupoBase } from './grupoBase.schema'

export const grupoResponse = grupoBase.pick({ id: true, nome: true })
export type GrupoResponse = z.infer<typeof grupoResponse>
