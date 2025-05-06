<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'
import WalletsListItem from './wallets-list-item.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="flex flex-col items-stretch gap-2">
    <WalletsListItem
      v-for="wallet of walletsStore.loadedWallets"
      :key="wallet.index"
      :wallet
      :active="activeWalletStore.activeWallet?.index === wallet.index"
    />
    <UiButton>Create new wallet</UiButton>
  </div>
</template>

<style scoped></style>
