<script setup lang="ts">
/* Models */

/* Props and Emits */
const props = defineProps<{
  index: number
  value: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="grid grid-cols-[30px_1fr] gap-x-2 items-center text-sm bg-slate-700 rounded-lg overflow-hidden"
  >
    <div
      class="bg-slate-800 justify-self-stretch text-center py-2 font-semibold text-white/50 border-r border-slate-950/30"
    >
      {{ props.index }}
    </div>
    <div>{{ props.value }}</div>
  </div>
</template>

<style scoped></style>
