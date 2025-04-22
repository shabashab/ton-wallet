<script setup lang="ts">
import UiButton from '../ui/ui-button.vue'
/* Models */

/* Props and Emits */

/* Composables */
const router = useRouter()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onButtonClick = () => {
  router.back()
}

/* Lifecycle Hooks */
</script>

<template>
  <UiButton class="w-full mt-4" button-style="secondary" @click="onButtonClick"
    >Go back</UiButton
  >
</template>

<style scoped></style>
