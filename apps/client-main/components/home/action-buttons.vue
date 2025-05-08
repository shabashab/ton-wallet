<script setup lang="ts">
import ActionButton from './action-buttons/action-button.vue'
/* Models */

/* Props and Emits */

/* Composables */
const confirmPassword = usePasswordConfirmation()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onSendButtonClick = () => {
  confirmPassword()
    .then((value) => {
      console.log('confirmPassword', value)
    })
    .catch((error: unknown) => {
      console.error(error)
    })
}

/* Lifecycle Hooks */
</script>

<template>
  <div class="grid auto-cols-fr grid-flow-col gap-x-4">
    <ActionButton
      label="Send"
      icon="material-symbols:arrow-upward-alt-rounded"
      @click="onSendButtonClick"
    />
    <ActionButton
      label="Receive"
      icon="material-symbols:arrow-downward-alt-rounded"
    />
  </div>
</template>

<style scoped></style>
