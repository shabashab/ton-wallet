<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import { ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'

/* Models */

/* Props and Emits */

/* Composables */
const toastInjection = inject<ToastInjection>(toastInjectionSymbol)

/* Refs and Reactive Variables */
const displayToast = ref(false)

/* Computed Properties */
const displayedToast = computed(() => {
  return toastInjection?.displayedToast.value
})

/* Methods */
const handleDragUpdate = (latest: Record<string, string | number>) => {
  const latestY = latest.y

  if (typeof latestY !== 'number') {
    return
  }

  if (latestY < -50) {
    displayToast.value = false
  }
}

/* Lifecycle Hooks */
watch(
  () => toastInjection?.displayedToast.value,
  (newDisplayedToast) => {
    if (newDisplayedToast) {
      displayToast.value = true
    }
  }
)
</script>

<template>
  <ToastRoot v-slot="{ open }" v-model:open="displayToast" as-child force-mount>
    <AnimatePresence mode="wait">
      <motion.div
        v-if="open"
        class="bg-slate-800 text-white w-full rounded-xl px-4 py-3 flex flex-col items-stretch gap-2"
        :initial="{ opacity: 0, y: '-100%' }"
        :animate="{ opacity: 1, y: '0' }"
        :exit="{ opacity: 0, y: '-100%' }"
        :drag="'y'"
        :drag-elastic="0.1"
        :drag-constraints="{ bottom: 0 }"
        @update="handleDragUpdate"
      >
        <ToastTitle class="font-semibold">
          {{ displayedToast?.title }}
        </ToastTitle>
        <ToastDescription class="text-sm text-white/50">
          {{ displayedToast?.description }}
        </ToastDescription>
      </motion.div>
    </AnimatePresence>
  </ToastRoot>
</template>

<style scoped></style>
