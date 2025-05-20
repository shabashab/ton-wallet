<script setup lang="ts">
import type { JettonTransferAction } from '@ton-api/client'
import ActionGenericTransfer from './action-generic-transfer.vue'
import Decimal from 'decimal.js'

/* Models */

/* Props and Emits */
const props = defineProps<{
  action: JettonTransferAction
  failed?: boolean
}>()

/* Composables */
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const amount = computed(() => {
  return new Decimal(props.action.amount.toString())
    .div(new Decimal(10).pow(props.action.jetton.decimals))
    .toNumber()
})

const direction = computed<'receive' | 'send'>(() => {
  if (!activeWalletStore.activeWalletAddress) {
    return 'receive'
  }

  return props.action.recipient?.address.equals(
    activeWalletStore.activeWalletAddress
  )
    ? 'receive'
    : 'send'
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <ActionGenericTransfer
    :amount
    :currency="props.action.jetton.symbol"
    :direction
    :failed="props.failed"
  />
</template>

<style scoped></style>
