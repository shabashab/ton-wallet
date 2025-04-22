<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { ErrorObject } from '@vuelidate/core'
import type { InputHTMLAttributes } from 'vue'
import { useFormError } from '~/composables/use-form-error'

const labelSpanVariants = cva('text-sm opacity-60', {
  variants: {
    error: {
      true: 'text-red-500',
      false: undefined,
    },
  },
})

/* Models */
const modelValue = defineModel<string>()

/* Props and Emits */
const props = withDefaults(
  defineProps<{
    label: string
    name: string
    type?: InputHTMLAttributes['type']
    error?: string | ErrorObject | ErrorObject[]
  }>(),
  {
    type: 'text',
    error: undefined,
  }
)

/* Composables */
const { errorExists, errorMessage } = useFormError(computed(() => props.error))

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <label class="flex flex-col items-stretch text-left gap-1">
    <span :class="labelSpanVariants({ error: errorExists })">{{
      props.label
    }}</span>
    <input
      v-model="modelValue"
      class="bg-slate-800 p-3 rounded-lg"
      :type="props.type"
      :name="props.label"
    />
    <span v-if="errorExists" class="text-xs text-red-500">{{
      errorMessage
    }}</span>
  </label>
</template>

<style scoped></style>
