<script setup lang="ts" generic="T extends string | number">
import type { SettingsRadioGroupItem } from './settings-radio-group-item.type'
import { RadioGroupRoot, RadioGroupItem, Label } from 'reka-ui'

/* Models */
const model = defineModel<T>()

/* Props and Emits */
const props = defineProps<{
  items: SettingsRadioGroupItem<T>[]
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    as="div"
    class="flex flex-col items-stretch p-4 rounded-xl bg-white/10 gap-4"
  >
    <Label
      v-for="item of props.items"
      :key="item.value"
      class="flex flex-col items-stretch gap-2"
    >
      <div class="flex flex-row items-center justify-start gap-2 group">
        <RadioGroupItem :value="item.value">
          <div
            class="size-5 rounded-full grid place-items-center transition-colors duration-200"
            :class="{
              'bg-blue-700': item.value === model,
              'border border-slate-500/60 group-hover:bg-slate-500/20':
                item.value !== model,
            }"
          >
            <Icon v-if="item.value === model" name="ion:ios-checkmark" />
          </div>
        </RadioGroupItem>
        <div>{{ item.label }}</div>
      </div>
      <div class="text-xs opacity-50">{{ item.description }}</div>
    </Label>
  </RadioGroupRoot>
</template>

<style scoped></style>
