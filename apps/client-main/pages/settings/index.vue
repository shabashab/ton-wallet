<script setup lang="ts">
import SettingsButton from '~/components/settings/settings-button.vue'

/* Models */

/* Props and Emits */

/* Composables */
const settingsStore = useSettingsStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const currentNetworkLabel = computed(() => {
  return settingsStore.currentNetwork === 'mainnet' ? 'Mainnet' : 'Testnet'
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="py-4">
    <div class="flex flex-col items-stretch gap-4">
      <SettingsButton
        to="/settings/network"
        label="Network"
        :current-value="currentNetworkLabel"
      />
      <SettingsButton label="Delete all data" item-style="danger" />
    </div>
  </div>
</template>

<style scoped></style>
