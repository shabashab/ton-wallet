<script setup lang="ts">
/* Models */
const modelValue = defineModel<string>()

/* Props and Emits */
const props = defineProps<{
  index: number
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <label
    class="grid grid-cols-[30px_1fr] gap-x-2 items-center text-sm bg-slate-700 rounded-lg overflow-hidden"
  >
    <div
      class="bg-slate-800 justify-self-stretch text-center py-2 font-semibold text-white/50 border-r border-slate-950/30 h-full grid place-items-center"
    >
      {{ props.index }}
    </div>
    <input v-model="modelValue" class="py-3" type="text" />
  </label>
</template>

<style scoped></style>
