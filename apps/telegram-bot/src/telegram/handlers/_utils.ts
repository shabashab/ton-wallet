import {
  createGroupProviderToken,
  defineProvider,
  Injector,
} from '@mikrokit/di'
import { Bot } from 'grammy'

export type TelegramHandlerConfigurator = (bot: Bot) => Promise<void> | void

export const telegramHandlerConfiguratorToken =
  createGroupProviderToken<TelegramHandlerConfigurator>('TelegramHandler')

export const defineTelegramHandler = (
  provider: (injector: Injector) => Promise<TelegramHandlerConfigurator>
) => {
  return defineProvider(provider, telegramHandlerConfiguratorToken)
}
