<script setup lang="ts">
import type { TonTransferAction } from '@ton-api/client'
import { fromNano } from '@ton/core'
import Decimal from 'decimal.js'
import ActionGenericTransfer from './action-generic-transfer.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  action: TonTransferAction
  failed?: boolean
}>()

/* Composables */
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const amount = computed(() => {
  return new Decimal(fromNano(props.action.amount)).toNumber()
})

const direction = computed<'receive' | 'send'>(() => {
  if (!activeWalletStore.activeWalletAddress) {
    return 'receive'
  }

  return props.action.recipient.address.equals(
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
    :failed="props.failed"
    :amount
    currency="TON"
    :direction
  />
  <!-- <div>
    {{ { amount, direction } }}
  </div> -->
</template>

<style scoped></style>
