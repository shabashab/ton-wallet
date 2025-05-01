import { createModule } from '@mikrokit/di'
import { UsersRepository } from './users.repository'
import { AssetsPricesRepository } from './assets-prices.repository'

export const repositoriesModule = createModule()
  .provide(UsersRepository)
  .provide(AssetsPricesRepository)
