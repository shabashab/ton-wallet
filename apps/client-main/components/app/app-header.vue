<script setup lang="ts">
import CurrentWallet from './app-header/current-wallet.vue'
import WalletSelectionButton from './app-header/wallet-selection-button.vue'

/* Models */

/* Props and Emits */

/* Composables */
const activeWalletStore = useActiveWalletStore()
const walletSelectionStore = useWalletSelectionStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="text-white flex justify-between p-2 gap-4">
    <CurrentWallet
      v-if="activeWalletStore.activeWalletAddress"
      :name="`Wallet ${activeWalletStore.activeWallet?.index}`"
      :address="activeWalletStore.activeWalletAddress.toString()"
    />
    <div class="flex-1"></div>
    <WalletSelectionButton
      @click="walletSelectionStore.displayWalletSelectionDialog = true"
    />
  </div>
</template>

<style scoped></style>
