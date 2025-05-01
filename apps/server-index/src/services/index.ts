import { createModule } from '@mikrokit/di'

import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { TelegramService } from './telegram.service'
import { WalletsService } from './wallets.service'
import { FungibleAssetsService } from './fungible-assets.service'
import { FungibleAssetsPricesService } from './fungible-assets-prices.service'
import { StonApiService } from './ston-api.service'
import { TonClientService } from './ton-client.service'
import { BlockchainIndexerService } from './blockchain-indexer.service'

export const servicesModule = createModule()
  .provide(UsersService)
  .provide(AuthService)
  .provide(TelegramService)
  .provide(WalletsService)
  .provide(FungibleAssetsService)
  .provide(FungibleAssetsPricesService)
  .provide(StonApiService)
  .provide(TonClientService)
  .provide(BlockchainIndexerService)
