<script
  setup
  lang="ts"
  generic="
    TValue extends string | number,
    TSelectOption extends UiSelectOption<TValue>
  "
>
import { cva } from 'class-variance-authority'
import type { ErrorObject } from '@vuelidate/core'
import { useFormError } from '~/composables/use-form-error'
import type { UiSelectOption } from './ui-select/types'
import UiSelectOptionsDialog from './ui-select/ui-select-options-dialog.vue'

const labelSpanVariants = cva('text-sm opacity-60', {
  variants: {
    error: {
      true: 'text-red-500',
      false: undefined,
    },
  },
})

/* Models */
const modelValue = defineModel<TValue>()

/* Props and Emits */
const props = withDefaults(
  defineProps<{
    label: string

    options: TSelectOption[]

    error?: string | ErrorObject | ErrorObject[]
  }>(),
  {
    type: 'text',
    error: undefined,
  }
)

const slots = defineSlots<{
  option(props: { option: TSelectOption; selected: boolean }): unknown
  selectedOption(props: { option: TSelectOption }): unknown
  empty(): unknown
}>()

/* Composables */
const { errorExists, errorMessage } = useFormError(computed(() => props.error))

/* Refs and Reactive Variables */
const displaySelectOptionsDialog = ref(false)

/* Computed Properties */
const selectedOption = computed(() => {
  if (!modelValue.value) {
    return
  }

  return props.options.find((option) => option.value === modelValue.value)
})

/* Methods */
const onSelectedItemClick = () => {
  displaySelectOptionsDialog.value = true
}

/* Lifecycle Hooks */
</script>

<template>
  <label class="flex flex-col items-stretch text-left gap-1">
    <span :class="labelSpanVariants({ error: errorExists })">{{
      props.label
    }}</span>
    <div
      class="bg-slate-800 border border-slate-500/50 p-3 rounded-lg"
      @click="onSelectedItemClick"
    >
      <slot
        v-if="selectedOption"
        name="selectedOption"
        :option="selectedOption"
      >
        <span>
          {{ selectedOption.value }}
        </span>
      </slot>
      <slot v-else name="empty">
        <span class="opacity-70">No option selected</span>
      </slot>
    </div>
    <span v-if="errorExists" class="text-xs text-red-500">{{
      errorMessage
    }}</span>
    <UiSelectOptionsDialog
      v-model:open="displaySelectOptionsDialog"
      v-model="modelValue"
      :options="props.options"
      :title="props.label"
    >
      <template v-if="slots.option" #option="{ option, selected }">
        <slot name="option" :option :selected />
      </template>
    </UiSelectOptionsDialog>
  </label>
</template>

<style scoped></style>
