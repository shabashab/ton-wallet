<script setup lang="ts">
/* Models */

/* Props and Emits */
const props = defineProps<{
  tokenName: string
  tokenSymbol: string
  tokenAmount: number

  usdAmount?: number

  imageUrl?: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="grid grid-cols-[40px_auto_1fr] gap-x-3 auto-rows-auto grid-flow-col items-center"
  >
    <img :src="props.imageUrl" class="aspect-square rounded-full" />
    <div class="flex flex-col items-start">
      <span class="font-medium">{{ props.tokenSymbol }}</span>
      <span class="text-xs opacity-50">{{ props.tokenName }}</span>
    </div>
    <div class="flex flex-col items-end">
      <div class="flex flex-row items-end gap-1">
        <span class="text-lg font-semibold leading-[1]">{{
          props.tokenAmount.toFixed(2)
        }}</span>
        <span class="text-xs opacity-50">{{ props.tokenSymbol }}</span>
      </div>
      <div v-if="typeof props.usdAmount === 'number'">
        <span class="text-sm opacity-50 leading-[1]"
          >{{ props.usdAmount.toFixed(2) }} $</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
