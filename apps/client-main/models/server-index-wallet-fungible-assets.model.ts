export interface ServerIndexWalletFungibleAssets {
  statistics: {
    totalUsd: number
  }
  assets: (
    | {
        type: 'ton'
        balance: number
        balanceRaw: string
        meta: {
          symbol: string
          displayName: string
          decimals: number
          imageUrl?: string | undefined
        }
        balanceUsd?: number | undefined
        priceUsd?: number | undefined
      }
    | {
        type: 'jetton'
        contractAddress: string
        balance: number
        balanceRaw: string
        meta: {
          symbol: string
          displayName: string
          decimals: number
          imageUrl?: string | undefined
        }
        balanceUsd?: number | undefined
        priceUsd?: number | undefined
      }
  )[]
}
