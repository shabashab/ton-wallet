<script setup lang="ts">
/* Models */

/* Props and Emits */
const props = defineProps<{
  value: boolean
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="size-5 rounded-full grid place-items-center transition-colors duration-200"
    :class="{
      'bg-blue-700': props.value,
      'border border-slate-500/60 group-hover:bg-slate-500/20': !props.value,
    }"
  >
    <Icon v-if="props.value" name="ion:ios-checkmark" />
  </div>
</template>

<style scoped></style>
