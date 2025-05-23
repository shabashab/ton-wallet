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

  const fetchNewestTransactions = async () => {
    if (!activeWalletStore.activeWalletAddress) {
      throw new Error(
        'Cannot fetch current active wallet newest transactions. No active wallet address available'
      )
    }

    const newestTransactionTimestamp = transactions.value?.[0].timestamp

    const latestEvents = await tonApi.value.accounts.getAccountEvents(
      activeWalletStore.activeWalletAddress,
      {
        limit: TRANSACTIONS_PER_PAGE,
        start_date: newestTransactionTimestamp,
      }
    )

    if (latestEvents.events.length === 0) {
      return
    }

    if (!transactions.value) {
      transactions.value = latestEvents.events
      nextTransactionsBeforeLt.value = BigInt(latestEvents.nextFrom)
      return
    }

    const dedupedEvents = latestEvents.events.filter(
      (x) => !transactions.value?.some((y) => x.eventId === y.eventId)
    )

    for (const dedupedEvent of dedupedEvents.reverse()) {
      transactions.value.unshift(dedupedEvent)
    }
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
    fetchNewestTransactions,

    loadNextTransactions,
    resetTransactions,
  }
})
