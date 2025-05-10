<script setup lang="ts">
import type { AccountEvent } from '@ton-api/client'
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */
const props = defineProps<{
  transaction: AccountEvent
}>()

/* Composables */
const twa = useTwa()
const networkStore = useNetworkStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const truncatedTransactionId = computed(() => {
  return (
    props.transaction.eventId.slice(0, 10) +
    '...' +
    props.transaction.eventId.slice(-11, -1)
  )
})

/* Methods */
const onViewInExplorerButtonClick = () => {
  const baseUrl =
    networkStore.currentNetwork === 'mainnet'
      ? 'https://tonscan.org'
      : 'https://testnet.tonscan.org'

  twa.openLink(`${baseUrl}/tx/${props.transaction.eventId}`)
}

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog v-model:open="open" title="Transaction details">
    <div class="pt-8 pb-2 space-y-2">
      <div class="flex flex-row justify-between items-center">
        <span class="opacity-50">Transaction</span>
        <span>{{ truncatedTransactionId }}</span>
      </div>
      <div class="flex flex-row justify-between items-center">
        <span class="opacity-50">LT</span>
        <span>{{ props.transaction.lt }}</span>
      </div>
      <UiButton class="w-full mt-6" @click="onViewInExplorerButtonClick"
        >View in explorer</UiButton
      >
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
