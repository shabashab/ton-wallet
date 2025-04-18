<script setup lang="ts">
import CurrentWallet from './app-header/current-wallet.vue'
import WalletSelectionButton from './app-header/wallet-selection-button.vue'

/* Models */

/* Props and Emits */

/* Composables */

/* Refs and Reactive Variables */
const currentAddress = ref('EQA2yYfSNKGjgRiR2qW4abxE7SdwclFy_4wBOpSUr9ifXbkc')

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="text-white flex justify-between p-2 gap-4">
    <CurrentWallet name="Wallet Name" :address="currentAddress" />
    <div class="flex-1"></div>
    <WalletSelectionButton />
  </div>
</template>

<style scoped></style>
