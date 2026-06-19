<script setup lang="ts">
const props = defineProps<{
  value: number
  color?: string
  height?: number
}>()

const height = computed(() => props.height ?? 48)
const strokeWidth = 7
const radius = computed(() => (height.value - strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const fill = computed(() => Math.max(0, Math.min(100, props.value)))
const dashOffset = computed(() => circumference.value * (1 - fill.value / 100))

const color = computed(() => props.color ?? '#22C55E')
</script>

<template>
  <svg
    :width="height"
    :height="height"
    :viewBox="`0 0 ${height} ${height}`"
    class="overflow-visible"
  >
    <circle
      :cx="height / 2"
      :cy="height / 2"
      :r="radius"
      fill="none"
      stroke="#E5E7EB"
      :stroke-width="strokeWidth"
    />
    <circle
      :cx="height / 2"
      :cy="height / 2"
      :r="radius"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      stroke-linecap="round"
      transform="rotate(-90)"
      :transform-origin="`${height / 2} ${height / 2}`"
    />
  </svg>
</template>
