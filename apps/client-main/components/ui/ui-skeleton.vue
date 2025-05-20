<script setup lang="ts">
/* Models */

/* Props and Emits */
const props = defineProps<{
  loading: boolean
  skeletonClass?: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <slot v-if="!props.loading" />
  <div v-else :class="props.skeletonClass" class="skeleton-box" />
</template>

<style lang="scss" scoped>
.skeleton-box {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background-color: var(--color-slate-700);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.3) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 5s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.blog-post {
  &__headline {
    font-size: 1.25em;
    font-weight: bold;
  }

  &__meta {
    font-size: 0.85em;
    color: #6b6b6b;
  }
}
</style>
