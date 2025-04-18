import { defineProvider } from '@mikrokit/di'
import { z } from 'zod'
import { configDotenv } from 'dotenv'

if (process.env['NODE_ENV'] !== 'production') {
  configDotenv()
}

const ConfigSchema = z.object({
  TELEGRAM_ENVIRONMENT: z
    .enum(['production', 'development'])
    .default('production'),
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_MINI_APP_URL: z.string(),
})

export const Config = defineProvider(() => {
  const environment = process.env

  const config = ConfigSchema.parse(environment)

  return config
})
