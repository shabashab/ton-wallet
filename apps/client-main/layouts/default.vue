<script setup lang="ts">
import AppNavigation from '~/components/app/app-navigation.vue'
import AppHeader from '~/components/app/app-header.vue'
import WalletSelectionDialog from '~/components/wallets/wallet-selection-dialog.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()
const activeWalletStore = useActiveWalletStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
if (walletsStore.loadedWallets.length === 0) {
  await navigateTo('/setup')
}

if (!activeWalletStore.activeWallet) {
  await activeWalletStore.setActiveWallet(walletsStore.loadedWallets[0])
}
</script>

<template>
  <div class="container font-main bg-slate-900 min-h-screen text-white">
    <!-- Dialogs and other non-visible elements -->
    <WalletSelectionDialog />

    <AppHeader />

    <div class="px-4">
      <slot />
    </div>

    <AppNavigation />
  </div>
</template>

<style scoped></style>
