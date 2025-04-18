import { createModule } from '@mikrokit/di'
import { Logger } from './logger'

export const coreModule = createModule().provide(Logger)
