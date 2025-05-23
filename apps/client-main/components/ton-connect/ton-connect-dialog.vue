<script setup lang="ts">
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'

/* Models */

/* Props and Emits */

/* Composables */
const tonConnectStore = useTonConnectStore()
const confirmPassword = usePasswordConfirmation()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onDialogStateChange = (newValue: boolean) => {
  if (newValue) {
    return
  }

  tonConnectStore.rejectConnection()
}

const onAcceptButtonClick = async () => {
  const password = await confirmPassword()

  if (!password) {
    return
  }

  await tonConnectStore.acceptConnection(password)
}

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog
    :open="!!tonConnectStore.currentlyConnectingApp"
    title="Connect app"
    description="Confirm connecting application via TON Connect"
    @update:open="onDialogStateChange"
  >
    <div class="flex flex-col items-center gap-2 pt-8 pb-4">
      <img
        class="w-[40px]"
        :src="tonConnectStore.currentlyConnectingApp?.manifest.iconUrl"
        alt=""
      />
      <div class="font-semibold mt-2">
        {{ tonConnectStore.currentlyConnectingApp?.manifest.name }}
      </div>
      <div class="text-sm opacity-50">
        {{ tonConnectStore.currentlyConnectingApp?.manifest.url }}
      </div>
      <div class="self-stretch grid grid-rows-1 grid-cols-2 gap-2 mt-4">
        <UiButton
          button-style="secondary"
          @click="tonConnectStore.rejectConnection()"
          >Reject</UiButton
        >
        <UiButton @click="onAcceptButtonClick">Confirm</UiButton>
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
