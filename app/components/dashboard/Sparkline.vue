<script setup lang="ts">
const props = withDefaults(defineProps<{
  data: number[]
  color?: string
  fill?: boolean
  strokeWidth?: number
  height?: number
}>(), {
  color: '#171717',
  fill: true,
  strokeWidth: 1.5,
  height: 40,
})

const width = 160
const padding = 4
const chartHeight = computed(() => props.height ?? 40)

const points = computed(() => {
  const values = props.data.length ? props.data : [0]
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const usableHeight = chartHeight.value - padding * 2
  const usableWidth = width - padding * 2

  return values.map((value, index) => {
    const x = padding + (index / (values.length - 1 || 1)) * usableWidth
    const y = padding + usableHeight - ((value - min) / range) * usableHeight
    return [x, y] as const
  })
})

const pathD = computed(() => {
  if (points.value.length < 2) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ')
})

const areaD = computed(() => {
  if (points.value.length < 2) return ''
  const first = points.value[0]!
  const last = points.value[points.value.length - 1]!
  const bottomY = chartHeight.value - padding
  return `${pathD.value} L ${last[0].toFixed(1)} ${bottomY} L ${first[0].toFixed(1)} ${bottomY} Z`
})
</script>

<template>
  <svg
    :width="width"
    :height="chartHeight"
    :viewBox="`0 0 ${width} ${chartHeight}`"
    fill="none"
    class="overflow-visible"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient :id="`sparkline-gradient-${chartHeight}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.12" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path
      v-if="fill"
      :d="areaD"
      :fill="`url(#sparkline-gradient-${chartHeight})`"
    />
    <path
      :d="pathD"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>
