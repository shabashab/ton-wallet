import { z } from 'zod'
import { zTonAddress } from '@utils'
import { walletFungibleAssetsDto } from '@dtos/wallet-fungible-assets.dto'

export const getWalletBalancesRequestParamsSchema = z.object({
  walletAddress: zTonAddress,
})

export const getWalletBalancesRequestQuerySchema = z.object({
  network: z.enum(['mainnet', 'testnet']),
})

export const getWalletBalancesResponseDto = walletFungibleAssetsDto
