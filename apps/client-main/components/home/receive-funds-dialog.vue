<script setup lang="ts">
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'
import WalletQrCode from './receive-dialog/wallet-qr-code.vue'

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog v-model:open="open" title="Receive funds">
    <div
      v-if="activeWalletStore.activeWalletAddressString"
      class="flex flex-col items-center gap-2 pt-12"
    >
      <WalletQrCode
        :wallet-address="activeWalletStore.activeWalletAddressString"
      />
      <div class="p-4 flex flex-col items-center gap-3 max-w-full">
        <span
          class="wrap-break-word text-center font-semibold text-white/90 max-w-full"
        >
          {{ activeWalletStore.activeWalletAddressString }}
        </span>
        <UiButton>Copy Address</UiButton>
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
