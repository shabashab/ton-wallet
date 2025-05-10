<script setup lang="ts">
import SettingsBackButton from '~/components/settings/settings-back-button.vue'
import SettingsRadioGroup from '~/components/settings/settings-radio-group.vue'
import UiButton from '~/components/ui/ui-button.vue'
import type { NetworkType } from '~/models/network-type.model'
import type { SettingsRadioGroupItem } from '~/components/settings/settings-radio-group-item.type'

/* Models */

/* Props and Emits */

/* Composables */
const router = useRouter()
const settingsStore = useSettingsStore()

/* Refs and Reactive Variables */
const temporarySelectedNetwork = ref<NetworkType>(settingsStore.currentNetwork)
const radioGroupItems = ref<SettingsRadioGroupItem<NetworkType>[]>([
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Testnet',
    value: 'testnet',
    description:
      'Warning: funds in testnet are not real! It should only be used for testing purposes',
  },
])

/* Computed Properties */

/* Methods */
const onSaveButtonClick = async () => {
  await settingsStore.updateCurrentNetwork(temporarySelectedNetwork.value)
  await router.push('/settings')
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="py-4 flex flex-col justify-between gap-8">
    <SettingsBackButton class="self-start" />
    <SettingsRadioGroup
      v-model="temporarySelectedNetwork"
      :items="radioGroupItems"
    />
    <UiButton
      v-if="settingsStore.currentNetwork !== temporarySelectedNetwork"
      class="w-full"
      @click="onSaveButtonClick"
    >
      Save
    </UiButton>
  </div>
</template>

<style scoped></style>
