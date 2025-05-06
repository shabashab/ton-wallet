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
import WalletsList from './wallet-selection-dialog/wallets-list.vue'

/* Models */

/* Props and Emits */

/* Composables */
const walletSelectionStore = useWalletSelectionStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <DialogRoot v-model:open="walletSelectionStore.displayWalletSelectionDialog">
    <DialogPortal>
      <AnimatePresence multiple>
        <DialogOverlay class="bg-black/10 fixed inset-0" as-child>
          <Motion
            :initial="{ opacity: 0 }"
            :exit="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
          />
        </DialogOverlay>

        <DialogContent
          class="fixed inset-x-0 bg-slate-800 h-[80vh] text-white font-main rounded-t-lg"
          as-child
        >
          <Motion
            :initial="{ opacity: 0, bottom: '-100%' }"
            :animate="{ opacity: 1, bottom: '0' }"
            :exit="{ opacity: 0, bottom: '-100%' }"
            class="p-6"
          >
            <DialogTitle as="h2" class="font-bold text-2xl"
              >Select wallet</DialogTitle
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
            <DialogDescription as="p" class="text-white/50 text-sm mt-2">
              Select existing wallet or create a new one
            </DialogDescription>
            <WalletsList class="py-4" />
          </Motion>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped></style>
