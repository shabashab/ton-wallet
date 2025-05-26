<script setup lang="ts">
import ActionButton from '~/components/home/action-buttons/action-button.vue'
import ReceiveFundsDialog from '~/components/home/receive-funds-dialog.vue'
import TokenBalancesList from '~/components/home/token-balances-list.vue'
import SendFundsDialog from '~/components/home/send-funds-dialog.vue'
import { useIntervalFn } from '@vueuse/core'
import { useTonConnectStore } from '~/stores/ton-connect.store'

/* Models */

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()
const networkStore = useNetworkStore()
const tonConnectStore = useTonConnectStore()
const twa = useTwa()

/* Refs and Reactive Variables */
const displayReceiveDialog = ref(false)
const displaySendDialog = ref(false)

/* Computed Properties */

/* Methods */
const onReceiveButtonClick = () => {
  displayReceiveDialog.value = true
}

const onSendButtonClick = () => {
  displaySendDialog.value = true
}

const onScanButtonClick = async () => {
  twa.showScanQrPopup({}, (text: string) => {
    if (tonConnectStore.verifyQrCodeUrl(text)) {
      tonConnectStore.handleQrCodeUrl(text).catch((error: unknown) => {
        console.error('Failed to connect via TON Connect', error)
      })
      return true
    }
  })
}

const tryReloadWalletData = () => {
  activeWalletStore.reloadWalletData().catch((error: unknown) => {
    console.error('Error happened while trying to reload wallet data', error)
  })
}

/* Lifecycle Hooks */
useIntervalFn(() => {
  tryReloadWalletData()
}, 5000)

onMounted(() => {
  tryReloadWalletData()
})
</script>

<template>
  <div class="flex flex-col items-stretch gap-4">
    <ReceiveFundsDialog v-model:open="displayReceiveDialog" />
    <SendFundsDialog v-model:open="displaySendDialog" />

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
        @click="onSendButtonClick"
      />
      <ActionButton
        label="Receive"
        icon="material-symbols:arrow-downward-alt-rounded"
        @click="onReceiveButtonClick"
      />
      <ActionButton
        label="Scan"
        icon="material-symbols:qr-code-rounded"
        @click="onScanButtonClick"
      />
    </div>

    <!-- Balances -->
    <TokenBalancesList />
  </div>
</template>

<style scoped></style>
