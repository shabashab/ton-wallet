import type { AccountEvent } from '@ton-api/client'
import { useTonApi } from '~/api/ton-api'

const TRANSACTIONS_PER_PAGE = 20

export const useTransactionsStore = defineStore('transactions', () => {
  const tonApi = useTonApi()
  const activeWalletStore = useActiveWalletStore()

  const transactions = ref<AccountEvent[]>()
  const nextTransactionsBeforeLt = ref<bigint>()

  const loadNextTransactions = async () => {
    if (nextTransactionsBeforeLt.value === 0n) {
      return
    }

    const nextTransactions = await fetchCurrentActiveWalletTransactions(
      nextTransactionsBeforeLt.value
    )

    nextTransactionsBeforeLt.value = BigInt(nextTransactions.nextFrom)
    transactions.value = [
      ...(transactions.value ?? []),
      ...nextTransactions.events,
    ]
  }

  const fetchCurrentActiveWalletTransactions = async (beforeLt?: bigint) => {
    if (!activeWalletStore.activeWalletAddress) {
      throw new Error(
        'Cannot fetch current active wallet transactions. No active wallet address available'
      )
    }

    const transactions = await tonApi.value.accounts.getAccountEvents(
      activeWalletStore.activeWalletAddress,
      {
        limit: TRANSACTIONS_PER_PAGE,
        before_lt: beforeLt,
      }
    )

    return transactions
  }

  const resetTransactions = () => {
    transactions.value = undefined
    nextTransactionsBeforeLt.value = undefined
  }

  const canLoadMore = computed(() => {
    return nextTransactionsBeforeLt.value
      ? nextTransactionsBeforeLt.value > 0
      : true
  })

  return {
    transactions,
    canLoadMore,

    loadNextTransactions,
    resetTransactions,
  }
})
