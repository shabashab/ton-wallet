<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'
import WalletsListItem from './wallets-list-item.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletsStore = useWalletsStore()
const activeWalletStore = useActiveWalletStore()
const confirmPassword = usePasswordConfirmation()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onCreateNewWalletButtonClick = async () => {
  const password = await confirmPassword()

  if (!password) {
    return
  }

  await walletsStore.generateNextWalletWithMnemonics(password)
}

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
    <UiButton @click="onCreateNewWalletButtonClick">Create new wallet</UiButton>
  </div>
</template>

<style scoped></style>
