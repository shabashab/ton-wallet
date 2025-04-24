import { createModule } from '@mikrokit/di'

import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { TelegramService } from './telegram.service'

export const servicesModule = createModule()
  .provide(UsersService)
  .provide(AuthService)
  .provide(TelegramService)
