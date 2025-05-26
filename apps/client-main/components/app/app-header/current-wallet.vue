<script setup lang="ts">
import TestnetBadge from './testnet-badge.vue'
import { AnimatePresence, motion } from 'motion-v'

/* Models */

/* Props and Emits */
const props = defineProps<{
  name: string
  address: string
}>()

/* Composables */
const networkStore = useNetworkStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const addressShort = computed(() => {
  return props.address.slice(0, 4) + '...' + props.address.slice(-4)
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="flex flex-col items-left hover:bg-white/5 hover:cursor-pointer rounded-xl py-2 pl-2 pr-4 group"
  >
    <span class="font-medium">
      {{ name }}
      <AnimatePresence>
        <motion.div
          v-if="networkStore.currentNetwork === 'testnet'"
          :initial="{ opacity: 0, scale: 0.8 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.8 }"
          class="inline-block"
        >
          <TestnetBadge class="ml-2" />
        </motion.div>
      </AnimatePresence>
    </span>
    <div
      class="flex flx-row items-center gap-2 opacity-40 group-hover:opacity-80 transition-opacity duration-200"
    >
      <span class="text-xs"> {{ addressShort }} </span>
      <Icon name="material-symbols:content-copy-outline" />
    </div>
  </div>
</template>

<style scoped></style>
