<script setup lang="ts">
import ActionButton from '~/components/home/action-buttons/action-button.vue'
import ReceiveFundsDialog from '~/components/home/receive-funds-dialog.vue'
import TokenBalancesList from '~/components/home/token-balances-list.vue'
import { useIntervalFn } from '@vueuse/core'

/* Models */

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()
const networkStore = useNetworkStore()

useIntervalFn(() => {
  activeWalletStore.reloadWalletData().catch((error: unknown) => {
    console.error('Error happened while trying to reload wallet data', error)
  })
}, 5000)

/* Refs and Reactive Variables */
const displayReceiveDialog = ref(false)

/* Computed Properties */

/* Methods */
const onReceiveButtonClick = () => {
  displayReceiveDialog.value = true
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex flex-col items-stretch gap-4">
    <ReceiveFundsDialog v-model:open="displayReceiveDialog" />

    <!-- Balance -->
    <div class="flex flex-col items-center gap-2 py-8">
      <div
        v-if="activeWalletStore.activeWalletFungibleAssets"
        class="flex flex-row items-end gap-1"
      >
        <span class="text-white font-bold text-5xl">{{
          (networkStore.currentNetwork === 'mainnet'
            ? activeWalletStore.activeWalletFungibleAssets.statistics.totalUsd
            : activeWalletStore.activeWalletTonBalance
          )?.toFixed(2)
        }}</span>
        <span class="text-white font-medium opacity-50 text-3xl">
          {{ networkStore.currentNetwork === 'mainnet' ? '$' : 'TON' }}
        </span>
      </div>
      <div class="text-white/70">Your balance</div>
    </div>

    <!-- Action buttons -->
    <div class="grid auto-cols-fr grid-flow-col gap-x-4">
      <ActionButton
        label="Send"
        icon="material-symbols:arrow-upward-alt-rounded"
      />
      <ActionButton
        label="Receive"
        icon="material-symbols:arrow-downward-alt-rounded"
        @click="onReceiveButtonClick"
      />
    </div>

    <!-- Balances -->
    <TokenBalancesList />
  </div>
</template>

<style scoped></style>
