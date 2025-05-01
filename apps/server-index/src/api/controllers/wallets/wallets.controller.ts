import { WalletsService } from '@services/wallets.service'
import { defineController } from '../_utils'
import {
  getWalletBalancesRequestParamsSchema,
  getWalletBalancesRequestQuerySchema,
  getWalletBalancesResponseDto,
} from './defs/get-wallet-balances.def'

export const WalletsController = defineController(
  '/wallets',
  async (r, injector) => {
    const walletsService = await injector.inject(WalletsService)

    r.public.get(
      '/:walletAddress/fungible-assets',
      {
        docs: {
          tags: ['wallets'],
          summary:
            "Get wallet's fungible assets (includes TON and Jettons) and total balance",
          description:
            "This endpoint returns the wallet's fungible assets, including TON and Jettons, along with the total balance in USD. This information is lightly cached and it shouldn't be used directly for contract calls. Before contract calls, all information should be fetched directly from blockchain",
        },
        request: {
          params: getWalletBalancesRequestParamsSchema,
          query: getWalletBalancesRequestQuerySchema,
        },
        response: getWalletBalancesResponseDto.schema,
      },
      async ({ params, query }) => {
        const fungibleAssets =
          await walletsService.getWalletFungibleAssetsByAddressString(
            params.walletAddress,
            query.network
          )

        return getWalletBalancesResponseDto(fungibleAssets)
      }
    )
  }
)
