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

  TESTNET_TON_RPC_URL: z.string().url(),
  TESTNET_TON_RPC_API_KEY: z.string(),
  TESTNET_TONCENTER_INDEXER_API_URL: z.string().url(),
  TESTNET_TONCENTER_API_TOKEN: z.string(),

  TON_RPC_URL: z.string().url(),
  TON_RPC_API_KEY: z.string(),
  TONCENTER_INDEXER_API_URL: z.string().url(),
  TONCENTER_API_TOKEN: z.string(),
})

export const Config = defineProvider(() => {
  const environment = process.env

  const config = ConfigSchema.parse(environment)

  return config
})
