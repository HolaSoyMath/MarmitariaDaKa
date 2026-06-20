import { configBase } from './configBase.schema'

export const configInput = configBase.pick({ gasPercentage: true })

export type ConfigInput = typeof configInput._type
