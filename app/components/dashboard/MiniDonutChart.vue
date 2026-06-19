<script setup lang="ts">
interface Segment {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  data: Segment[]
  size?: number
}>()

const size = computed(() => props.size ?? 48)
const strokeWidth = 6
const radius = computed(() => (size.value - strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const center = computed(() => size.value / 2)

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const segments = computed(() => {
  let accumulated = 0
  return props.data.map((item) => {
    const ratio = item.value / (total.value || 1)
    const dashArray = `${circumference.value * ratio} ${circumference.value}`
    const offset = -accumulated * circumference.value
    accumulated += ratio
    return {
      ...item,
      dashArray,
      offset,
    }
  })
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="-rotate-90"
  >
    <circle
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      stroke="#E5E7EB"
      :stroke-width="strokeWidth"
    />
    <circle
      v-for="(segment, index) in segments"
      :key="index"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke="segment.color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="segment.dashArray"
      :stroke-dashoffset="segment.offset"
      stroke-linecap="round"
    />
  </svg>
</template>
