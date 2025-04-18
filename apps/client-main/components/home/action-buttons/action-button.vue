<script setup lang="ts">
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
  <button
    class="bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-300 flex items-center gap-2 justify-center py-2 hover:cursor-pointer transition-colors duration-200"
  >
    <span>{{ props.label }}</span>
    <Icon class="text-3xl" :name="props.icon" />
  </button>
</template>

<style scoped></style>
