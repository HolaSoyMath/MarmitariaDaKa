import { configBase } from './configBase.schema'

export const configResponse = configBase.pick({ id: true, gasPercentage: true })

export type ConfigResponse = typeof configResponse._type
