import { createModule } from '@mikrokit/di'
import { StartTelegramHandler } from './start.telegram-handler'

export const handlersModule = createModule().provide(StartTelegramHandler)
