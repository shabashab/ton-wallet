import { defineProvider } from '@mikrokit/di'
import { z } from 'zod'
import { configDotenv } from 'dotenv'

if (process.env['NODE_ENV'] !== 'production') {
  configDotenv()
}

const ConfigSchema = z.object({
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),

  TELEGRAM_BOT_TOKEN: z.string(),

  DATABASE_URL: z.string(),

  REDIS_URL: z.string(),
  REDIS_IP_FAMILY: z.coerce.number().default(4),

  ENABLE_SWAGGER: z.preprocess(
    (value) => value === 'true',
    z.boolean().default(false)
  ),
})

export const Config = defineProvider(() => {
  const environment = process.env

  const config = ConfigSchema.parse(environment)

  return config
})
