<script setup lang="ts">
import AppNavigation from '~/components/app/app-navigation.vue'
import AppHeader from '~/components/app/app-header.vue'
import WalletSelectionDialog from '~/components/wallets/wallet-selection-dialog.vue'
import PasswordConfirmationDialog from '~/components/password/password-confirmation-dialog.vue'
import TransactionSendDialog from '~/components/transactions/transaction-send-dialog.vue'
import TonConnectDialog from '~/components/ton-connect/ton-connect-dialog.vue'
import { useIntervalFn } from '@vueuse/core'

/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()
const activeWalletStore = useActiveWalletStore()
const indexAuthStore = useIndexAuthStore()
const tonConnectStore = useTonConnectStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await indexAuthStore.tryAuthenticate()

if (walletsStore.loadedWallets.length === 0) {
  await navigateTo('/setup')
}

if (!activeWalletStore.activeWallet && walletsStore.loadedWallets.length > 0) {
  await activeWalletStore.setActiveWallet(walletsStore.loadedWallets[0])

  useIntervalFn(() => {
    tonConnectStore.synchronizeTonConnect().catch((error: unknown) => {
      console.error(error)
    })
  }, 10_000)

  // eslint-disable-next-line unicorn/prefer-top-level-await
  tonConnectStore.synchronizeTonConnect().catch((error: unknown) => {
    console.error(error)
  })
}
</script>

<template>
  <div class="container font-main bg-slate-900 min-h-screen text-white">
    <!-- Dialogs and other non-visible elements -->
    <WalletSelectionDialog />
    <TonConnectDialog />

    <AppHeader />

    <div class="px-4 pb-18">
      <slot />
    </div>

    <PasswordConfirmationDialog />
    <TransactionSendDialog />

    <AppNavigation />
  </div>
</template>

<style scoped></style>
