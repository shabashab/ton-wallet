<script setup lang="ts">
import UiButton from '~/components/ui/ui-button.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  label: string
  icon: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <UiButton>
    <div class="flex flex-col items-center gap-1">
      <Icon class="text-3xl" :name="props.icon" />
      <span class="text-sm">
        {{ label }}
      </span>
    </div>
  </UiButton>
</template>

<style scoped></style>
