<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { cva } from 'class-variance-authority'

const variants = cva(
  'flex flex-col gap-2 items-center py-2 px-4 rounded-xl transition-all duration-200 hover:text-white',
  {
    variants: {
      active: {
        false: ['text-white/70'],
        true: ['bg-white/5 text-white'],
      },
    },
  }
)

/* Models */

/* Props and Emits */
const props = defineProps<{
  icon: string
  label: string
  to: RouteLocationRaw
}>()

/* Composables */
const route = useRoute()
const router = useRouter()

/* Refs and Reactive Variables */

/* Computed Properties */
const resolvedTargetRoute = computed(() => {
  return router.resolve(props.to)
})

const isActive = computed(() => {
  return route.name === resolvedTargetRoute.value.name
})

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <NuxtLink :to="props.to" :class="variants({ active: isActive })">
    <Icon :name="props.icon" />
    <span class="font-medium">
      {{ props.label }}
    </span>
  </NuxtLink>
</template>

<style scoped></style>
