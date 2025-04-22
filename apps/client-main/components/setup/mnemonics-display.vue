<script setup lang="ts">
import MnemonicsWord from './mnemonics-display/mnemonics-word.vue'

/* Models */

/* Props and Emits */
const props = defineProps<{
  mnemonics: string[]
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <MnemonicsWord
      v-for="(mnemonicsWord, index) of props.mnemonics"
      :key="mnemonicsWord"
      :value="mnemonicsWord"
      :index="index + 1"
    />
  </div>
</template>

<style scoped></style>
