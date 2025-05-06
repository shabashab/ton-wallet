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

/* Lifecycle Hooks */
</script>

<template>
  <div class="p-4 bg-slate-900/50 rounded-lg flex items-center gap-2">
    <UiCheckmark :value="props.active" />
    <div class="text-sm" :class="props.active ? 'text-white' : 'text-white/70'">
      {{ truncatedAddressString }}
    </div>
    <div class="text-right flex-1">1.00 $</div>
  </div>
</template>

<style scoped></style>
