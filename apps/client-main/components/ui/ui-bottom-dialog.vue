<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

/* Models */
const open = defineModel<boolean>('open', { required: true })

/* Props and Emits */
const props = defineProps<{
  title?: string
  description?: string

  contentClass?: string
  overlayClass?: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <AnimatePresence>
        <DialogOverlay
          :class="props.overlayClass"
          class="bg-black/10 fixed inset-0"
          as-child
        >
          <Motion
            :initial="{ opacity: 0 }"
            :exit="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
          />
        </DialogOverlay>

        <DialogContent
          class="fixed inset-x-0 bg-slate-800 text-white font-main rounded-t-lg max-h-screen"
          :class="props.contentClass"
          as-child
        >
          <Motion
            :initial="{ opacity: 0, bottom: '-100%' }"
            :animate="{ opacity: 1, bottom: '0' }"
            :exit="{ opacity: 0, bottom: '-100%' }"
            class="p-6"
          >
            <DialogTitle
              v-if="props.title"
              as="h2"
              class="font-bold text-2xl"
              >{{ title }}</DialogTitle
            >
            <DialogClose
              as="button"
              class="absolute right-6 top-6 p-2 bg-slate-900/50 grid place-items-center rounded-lg"
            >
              <Icon
                name="material-symbols:arrow-downward-rounded"
                class="text-2xl"
              />
            </DialogClose>
            <DialogDescription
              v-if="props.description"
              as="p"
              class="text-white/50 text-sm mt-2"
            >
              {{ props.description }}
            </DialogDescription>

            <slot />
          </Motion>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped></style>
