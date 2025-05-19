<script setup lang="ts">
import type { AccountEvent } from '@ton-api/client'
import TransactionActions from '../transaction-actions.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  transaction: AccountEvent
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */
const formattedTimestamp = computed(() => {
  const date = new Date(props.transaction.timestamp * 1000)
  return date.toLocaleDateString('uk', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  })
})

const truncatedTransactionId = computed(() => {
  return (
    props.transaction.eventId.slice(0, 8) +
    '...' +
    props.transaction.eventId.slice(-9, -1)
  )
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="flex flex-col items-stretch gap-2 px-4 py-3 bg-white/10 rounded-xl"
  >
    <TransactionActions :actions="props.transaction.actions" />
    <div class="h-[1px] bg-slate-400/50 w-full"></div>
    <div class="flex flex-row justify-between items-center">
      <div class="text-xs opacity-50">
        {{ formattedTimestamp }}
      </div>
      <div class="text-xs opacity-50">
        {{ truncatedTransactionId }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
