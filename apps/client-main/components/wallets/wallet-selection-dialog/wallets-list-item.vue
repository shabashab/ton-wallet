<script setup lang="ts">
import UiCheckmark from '~/components/ui/ui-checkmark.vue'
import type { LoadedWallet } from '~/models/loaded-wallet.model'

/* Models */

/* Props and Emits */
const props = defineProps<{
  wallet: LoadedWallet
  active: boolean
}>()

/* Composables */
const activeWalletStore = useActiveWalletStore()
const walletSelectionStore = useWalletSelectionStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const addressString = computed(() => {
  return calculateWalletAddress(props.wallet.publicKey).toString()
})

const truncatedAddressString = computed(() => {
  return (
    addressString.value.slice(0, 5) + '...' + addressString.value.slice(-6, -1)
  )
})

/* Methods */
const onListItemClick = async () => {
  await activeWalletStore.setActiveWallet(props.wallet)
  walletSelectionStore.displayWalletSelectionDialog = false
}

/* Lifecycle Hooks */
</script>

<template>
  <button
    class="p-4 bg-slate-900/50 rounded-lg flex items-center gap-2"
    @click="onListItemClick"
  >
    <UiCheckmark :value="props.active" />
    <div class="text-sm" :class="props.active ? 'text-white' : 'text-white/70'">
      Wallet {{ props.wallet.index }}: {{ truncatedAddressString }}
    </div>
  </button>
</template>

<style scoped></style>
