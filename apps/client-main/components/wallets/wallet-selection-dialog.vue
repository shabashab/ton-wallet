<script setup lang="ts">
import WalletsList from './wallet-selection-dialog/wallets-list.vue'
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletSelectionStore = useWalletSelectionStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog
    v-model:open="walletSelectionStore.displayWalletSelectionDialog"
    title="Select wallet"
    description="Select existing wallet or create a new one"
    content-class="h-[80vh]"
  >
    <WalletsList class="py-4" />
  </UiBottomDialog>
</template>

<style scoped></style>
