import { createModule } from '@mikrokit/di'
import { HealthController } from './health/health.controller'
import { AuthController } from './auth/auth.controller'
import { WalletsController } from './wallets/wallets.controller'

export const controllersModule = createModule()
  .provide(HealthController)
  .provide(AuthController)
  .provide(WalletsController)
