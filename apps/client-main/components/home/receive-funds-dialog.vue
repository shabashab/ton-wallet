<script setup lang="ts">
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'
import WalletQrCode from './receive-dialog/wallet-qr-code.vue'
import copy from 'copy-to-clipboard'

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()
const { toast } = useToast()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onCopyAddressButtonClick = () => {
  if (!activeWalletStore.activeWalletAddressString) {
    return
  }

  copy(activeWalletStore.activeWalletAddressString)
  toast({
    title: 'Copied successfully',
    description: 'Wallet address has been copied to clipboard',
  })
}

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
        <UiButton @click="onCopyAddressButtonClick">Copy Address</UiButton>
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
