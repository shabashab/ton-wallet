export interface IndexerWalletJettonsResponse {
  jetton_wallets: IndexerJettonWallet[]
  address_book: IndexerJettonWalletsAddressBook
  metadata: IndexerJettonWalletsMetadata
}

export interface IndexerJettonWallet {
  address: string
  balance: string
  owner: string
  jetton: string
  last_transaction_lt: string
  code_hash: string
  data_hash: string
}

export type IndexerJettonWalletsAddressBook = Record<
  string,
  {
    user_friendly: string
    domain: unknown
  }
>

export type IndexerJettonWalletsMetadata = Record<
  string,
  IndexerJettonWalletsMetadataItem
>

export interface IndexerJettonWalletsMetadataItem {
  is_indexed: boolean
  token_info: IndexerJettonWalletsMetadataItemTokenInfo[]
}

export interface IndexerJettonWalletsMetadataItemTokenInfo {
  type: string
  name: string
  symbol: string
  description: string
  image?: string
  extra: IndexerJettonWalletsMetadataItemTokenInfoExtra
}

export interface IndexerJettonWalletsMetadataItemTokenInfoExtra {
  decimals: string
}
