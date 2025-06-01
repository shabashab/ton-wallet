<script setup lang="ts">
import UiBottomDialog from '../ui/ui-bottom-dialog.vue'
import UiButton from '../ui/ui-button.vue'

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */
const emit = defineEmits(['confirm'])

/* Composables */
const confirmPassword = usePasswordConfirmation()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onCancelButtonClick = () => {
  open.value = false
}

const onDeleteButtonClick = async () => {
  const password = await confirmPassword()

  if (!password) {
    return
  }

  emit('confirm')
}

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog
    v-model:open="open"
    title="Confirm deleting data"
    description="This action cannot be undone"
  >
    <div class="flex flex-col items-center gap-8 pt-8 pb-4">
      <span class="text-red-600 text-center"
        >After clicking delete, all your wallets will be deleted</span
      >
      <div class="grid grid-cols-2 gap-4 w-full">
        <UiButton button-style="neutral" @click="onCancelButtonClick"
          >Cancel</UiButton
        >
        <UiButton button-style="danger" @click="onDeleteButtonClick"
          >Delete</UiButton
        >
      </div>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
