import {
  AssetPriceSelect,
  assetPriceType,
  assetsPrices,
} from '@database/schema'
import { defineRepository } from './_utils'
import {
  and,
  desc,
  eq,
  exists,
  getTableColumns,
  gte,
  inArray,
  notExists,
  sql,
} from 'drizzle-orm'
import { NetworkType } from '@interfaces/network-type.type'

export const AssetsPricesRepository = defineRepository(async (db) => {
  const findValidTonPriceByNetworkType = async (networkType: NetworkType) => {
    const price = await db.query.assetsPrices.findFirst({
      where: and(
        eq(assetsPrices.type, 'ton'),
        gte(assetsPrices.validUntil, new Date()),
        eq(assetsPrices.networkType, networkType)
      ),
      orderBy: desc(assetsPrices.createdAt),
    })

    return price
  }

  const findValidAssetsPricesByContractAddressesAndNetworkType = async (
    addresses: string[],
    networkType: NetworkType
  ): Promise<AssetPriceSelect[]> => {
    // This is required in order to guarantee that we select price with latest created_at among all valid prices
    const latestPricesSubquery = db
      .select({
        ...getTableColumns(assetsPrices),
        rowNumber:
          sql`row_number() over (partition by contract_address order by created_at desc)`.as(
            'row_number'
          ),
      })
      .from(assetsPrices)
      .where(
        and(
          inArray(assetsPrices.contractAddress, addresses),
          gte(assetsPrices.validUntil, new Date()),
          eq(assetsPrices.networkType, networkType)
        )
      )
      .as('latest_prices_sq')

    const latestPrices = await db
      .select({
        ...getTableColumns(assetsPrices),
      })
      .from(latestPricesSubquery)
      .where(eq(latestPricesSubquery.rowNumber, 1))

    return latestPrices
  }

  const createTonPrice = async (price: string, networkType: NetworkType) => {
    const [createdPrice] = await db
      .insert(assetsPrices)
      .values({
        type: 'ton',
        price,
        validUntil: new Date(Date.now() + 60 * 60 * 1000),
        networkType,
      })
      .returning()

    if (!createdPrice) {
      throw new Error('Failed to create TON price')
    }

    return createdPrice
  }

  const createJettonPrices = async (
    prices: { address: string; price: string }[],
    networkType: NetworkType
  ) => {
    const validUntil = new Date(Date.now() + 60 * 60 * 1000)

    const createdPrices = await db
      .insert(assetsPrices)
      .values(
        prices.map((price) => ({
          type: 'jetton' as const,
          contractAddress: price.address,
          price: price.price,
          validUntil,
          networkType,
        }))
      )
      .returning()

    return createdPrices
  }

  return {
    findValidTonPriceByNetworkType,
    findValidAssetsPricesByContractAddressesAndNetworkType,
    createTonPrice,
    createJettonPrices,
  }
}, 'AssetsPricesRepository')
