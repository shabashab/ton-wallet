<script setup lang="ts">
/* Models */

/* Props and Emits */
const emit = defineEmits(['click'])

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <button
    class="grid place-items-center size-12 self-center rounded-xl transition-colors duration-200 hover:cursor-pointer hover:bg-white/5"
    @click="emit('click')"
  >
    <Icon
      class="text-2xl"
      name="material-symbols:format-list-bulleted-rounded"
    />
  </button>
</template>

<style scoped></style>
