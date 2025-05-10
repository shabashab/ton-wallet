<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import ListItem from './transactions-list/list-item.vue'
import TransactionDetailsDialog from './transaction-details-dialog.vue'
import type { AccountEvent } from '@ton-api/client'

/* Models */

/* Props and Emits */

/* Composables */
const transactionsStore = useTransactionsStore()

const listContainerElement = useTemplateRef('listContainer')

useInfiniteScroll(
  listContainerElement,
  async () => {
    await transactionsStore.loadNextTransactions()
  },
  {
    distance: 50,
    interval: 500,
    canLoadMore: () => transactionsStore.canLoadMore,
  }
)

/* Refs and Reactive Variables */
const transactionDetailsDialogOpen = ref(false)
const transactionDetailsDialogTransaction = ref<AccountEvent>()

/* Computed Properties */

/* Methods */
const onTransactionItemClick = (item: AccountEvent) => {
  transactionDetailsDialogOpen.value = true
  transactionDetailsDialogTransaction.value = item
}

/* Lifecycle Hooks */
</script>

<template>
  <div ref="listContainer" class="space-y-4 py-8">
    <ListItem
      v-for="transaction of transactionsStore.transactions"
      :key="transaction.eventId"
      :transaction
      @click="onTransactionItemClick(transaction)"
    />
  </div>
  <TransactionDetailsDialog
    v-if="transactionDetailsDialogTransaction"
    v-model:open="transactionDetailsDialogOpen"
    :transaction="transactionDetailsDialogTransaction"
  />
</template>

<style scoped></style>
