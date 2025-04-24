import { createModule } from '@mikrokit/di'
import { HealthController } from './health/health.controller'
import { AuthController } from './auth/auth.controller'

export const controllersModule = createModule()
  .provide(HealthController)

  .provide(AuthController)
