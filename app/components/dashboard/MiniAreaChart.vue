<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
}>()

const H = 58
const W = 300
const PX = 0
const PY = 6

const pts = computed(() => {
  const min = Math.min(...props.data)
  const max = Math.max(...props.data)
  const range = max - min || 1
  const uw = W - PX * 2
  const uh = H - PY * 2
  return props.data.map((v, i) => ({
    x: PX + (i / (props.data.length - 1 || 1)) * uw,
    y: PY + uh - ((v - min) / range) * uh,
  }))
})

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  const t = 0.25
  let d = `M ${points[0]!.x},${points[0]!.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) * t
    const cp1y = p1.y + (p2.y - p0.y) * t
    const cp2x = p2.x - (p3.x - p1.x) * t
    const cp2y = p2.y - (p3.y - p1.y) * t
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`
  }
  return d
}

const linePath = computed(() => smoothPath(pts.value))
const areaPath = computed(() => {
  const points = pts.value
  if (!points.length) return ''
  const first = points[0]!
  const last = points[points.length - 1]!
  return `${smoothPath(points)} L ${last.x},${H} L ${first.x},${H} Z`
})

const endPt = computed(() => pts.value[pts.value.length - 1] ?? { x: 0, y: 0 })
const color = computed(() => props.color ?? '#22C55E')
const uid = Math.random().toString(36).slice(2, 8)
</script>

<template>
  <svg
    width="100%"
    height="100%"
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="none"
    class="block"
  >
    <defs>
      <linearGradient :id="`area-lg-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.12" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- dashed grid line -->
    <line x1="0" y1="32" x2="300" y2="32" stroke="#F3F4F6" stroke-dasharray="5 4" stroke-width="1" />

    <!-- area fill -->
    <path :d="areaPath" :fill="`url(#area-lg-${uid})`" stroke="none" />

    <!-- smooth line -->
    <path
      :d="linePath"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- end dot -->
    <circle
      :cx="endPt.x"
      :cy="endPt.y"
      r="3.5"
      :fill="color"
      stroke="white"
      stroke-width="2"
    />
  </svg>
</template>
