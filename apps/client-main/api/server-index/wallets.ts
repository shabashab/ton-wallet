import type { ServerIndexWalletFungibleAssets } from '~/models/server-index-wallet-fungible-assets.model'
import type { HttpApi } from '../types'
import type { NetworkType } from '~/models/network-type.model'

export const serverIndexWallets = (api: HttpApi) => ({
  getWalletFungibleAssets: api.defineJsonEndpoint<
    { walletAddress: string; networkType: NetworkType },
    ServerIndexWalletFungibleAssets
  >({
    method: 'GET',
    url: ({ walletAddress }) => `/wallets/${walletAddress}/fungible-assets`,
    query: ({ networkType }) => ({ network: networkType }),
    output: 'naive',
  }),
})
