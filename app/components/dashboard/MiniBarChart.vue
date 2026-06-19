<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  height?: number
}>()

const height = computed(() => props.height ?? 48)
const width = 120
const padding = 4

const bars = computed(() => {
  const max = Math.max(...props.data, 1)
  const usableHeight = height.value - padding * 2
  const usableWidth = width - padding * 2
  const barWidth = usableWidth / props.data.length * 0.6
  const gap = usableWidth / props.data.length * 0.4

  return props.data.map((value, index) => {
    const barHeight = (value / max) * usableHeight
    const x = padding + index * (barWidth + gap) + gap / 2
    const y = padding + usableHeight - barHeight
    return { x, y, width: barWidth, height: barHeight }
  })
})

const barColor = computed(() => props.color ?? '#2563EB')
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="overflow-visible"
  >
    <rect
      v-for="(bar, index) in bars"
      :key="index"
      :x="bar.x"
      :y="bar.y"
      :width="bar.width"
      :height="bar.height"
      :fill="barColor"
      rx="2"
      opacity="0.85"
    />
  </svg>
</template>
