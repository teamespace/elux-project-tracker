<script setup lang="ts">
const props = defineProps<{
  value: number
  color?: string
  height?: number
}>()

const H = computed(() => props.height ?? 48)
const strokeWidth = 4
const radius = computed(() => (H.value - strokeWidth) / 2 - 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const fill = computed(() => Math.max(0, Math.min(100, props.value)))
const dashOffset = computed(() => circumference.value * (1 - fill.value / 100))
const color = computed(() => props.color ?? '#22C55E')
</script>

<template>
  <svg
    :width="H"
    :height="H"
    :viewBox="`0 0 ${H} ${H}`"
    class="overflow-visible"
  >
    <!-- track -->
    <circle
      :cx="H / 2"
      :cy="H / 2"
      :r="radius"
      fill="none"
      stroke="#E5E7EB"
      :stroke-width="strokeWidth"
    />
    <!-- progress -->
    <circle
      :cx="H / 2"
      :cy="H / 2"
      :r="radius"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      stroke-linecap="round"
      transform="rotate(-90)"
      :transform-origin="`${H / 2} ${H / 2}`"
    />
    <!-- center pct label -->
    <text
      :x="H / 2"
      :y="H / 2 + 1"
      text-anchor="middle"
      dominant-baseline="middle"
      :fill="color"
      font-size="10"
      font-weight="600"
      font-family="Geist, ui-sans-serif, system-ui, sans-serif"
    >{{ fill }}%</text>
  </svg>
</template>
