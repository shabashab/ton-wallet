<script
  setup
  lang="ts"
  generic="
    TValue extends string | number,
    TSelectOption extends UiSelectOption<TValue>
  "
>
import UiBottomDialog from '../ui-bottom-dialog.vue'
import type { UiSelectOption } from './types'

/* Models */
const open = defineModel<boolean>('open', { required: true })
const modelValue = defineModel<TValue>()

/* Props and Emits */
const props = defineProps<{
  title?: string

  options: TSelectOption[]
}>()

defineSlots<{
  option(props: { option: TSelectOption; selected: boolean }): unknown
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onOptionClick = (option: TSelectOption) => {
  modelValue.value = option.value
  open.value = false
}

/* Lifecycle Hooks */
</script>

<template>
  <UiBottomDialog v-model:open="open" :title="props.title">
    <div class="pt-8 pb-2 flex flex-col items-stretch gap-4">
      <button
        v-for="option of props.options"
        :key="option.value"
        @click="onOptionClick(option)"
      >
        <slot name="option" :option :selected="modelValue === option.value">
          <div class="flex flex-row items-center gap-1">
            {{ option.value }}
          </div>
        </slot>
      </button>
    </div>
  </UiBottomDialog>
</template>

<style scoped></style>
