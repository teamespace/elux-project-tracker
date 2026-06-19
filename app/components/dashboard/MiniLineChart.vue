<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  height?: number
}>()

const height = computed(() => props.height ?? 48)
const width = 120
const padding = 4

const points = computed(() => {
  const min = Math.min(...props.data)
  const max = Math.max(...props.data)
  const range = max - min || 1
  const usableHeight = height.value - padding * 2
  const usableWidth = width - padding * 2

  return props.data.map((value, index) => {
    const x = padding + (index / (props.data.length - 1 || 1)) * usableWidth
    const y = padding + usableHeight - ((value - min) / range) * usableHeight
    return { x, y }
  })
})

const linePoints = computed(() => {
  return points.value.map(p => `${p.x},${p.y}`).join(' ')
})

const lastPoint = computed(() => {
  return points.value[points.value.length - 1] ?? { x: 0, y: 0 }
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''

  const first = points.value[0]!
  const last = lastPoint.value

  return `M ${first.x} ${height.value - padding} L ${points.value.map(p => `${p.x} ${p.y}`).join(' L ')} L ${last.x} ${height.value - padding} Z`
})

const lineColor = computed(() => props.color ?? '#2563EB')
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="overflow-visible"
  >
    <defs>
      <linearGradient :id="`line-fill-${height}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="lineColor" stop-opacity="0.2" />
        <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <path
      :d="areaPath"
      :fill="`url(#line-fill-${height})`"
      stroke="none"
    />

    <polyline
      :points="linePoints"
      fill="none"
      :stroke="lineColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <circle
      :cx="lastPoint.x"
      :cy="lastPoint.y"
      r="3"
      :fill="lineColor"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
</template>
