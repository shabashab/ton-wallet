<script setup lang="ts">
import SettingsButton from '~/components/settings/settings-button.vue'
import SettingsDeleteDataConfirmationDialog from '~/components/settings/settings-delete-data-confirmation-dialog.vue'

/* Models */

/* Props and Emits */

/* Composables */
const settingsStore = useSettingsStore()
const dataDeletionStore = useDataDeletionStore()

/* Refs and Reactive Variables */
const displayDeleteDataConfirmationDialog = ref(false)

/* Computed Properties */
const currentNetworkLabel = computed(() => {
  return settingsStore.currentNetwork === 'mainnet' ? 'Mainnet' : 'Testnet'
})

/* Methods */
const onDeleteDataConfirm = async () => {
  await dataDeletionStore.deleteAllUserData()
  location.replace('/')
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="py-4">
    <SettingsDeleteDataConfirmationDialog
      v-model:open="displayDeleteDataConfirmationDialog"
      @confirm="onDeleteDataConfirm"
    />

    <div class="flex flex-col items-stretch gap-4">
      <SettingsButton
        to="/settings/network"
        label="Network"
        :current-value="currentNetworkLabel"
      />
      <SettingsButton
        label="Delete all data"
        item-style="danger"
        @click="displayDeleteDataConfirmationDialog = true"
      />
    </div>
  </div>
</template>

<style scoped></style>
