<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  height?: number
}>()

const height = computed(() => props.height ?? 48)
const width = 120
const padding = 4
const barGap = 3

const bars = computed(() => {
  const min = 0
  const max = Math.max(...props.data, 1)
  const usableHeight = height.value - padding * 2
  const barWidth = (width - padding * 2 - (props.data.length - 1) * barGap) / props.data.length

  return props.data.map((value, index) => {
    const barHeight = ((value - min) / max) * usableHeight
    const x = padding + index * (barWidth + barGap)
    const y = padding + usableHeight - barHeight
    return { x, y, width: barWidth, height: barHeight }
  })
})

const barColor = computed(() => props.color ?? '#EF4444')
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
      ry="2"
    />
  </svg>
</template>
