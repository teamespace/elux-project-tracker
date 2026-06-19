<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
}

const props = defineProps<{
  title: string
  subtitle?: string
  data: DataPoint[]
  color?: string
}>()

const color = computed(() => props.color || '#171717')
const gradientId = computed(() => `area-gradient-${props.title.toLowerCase().replace(/\s+/g, '-')}`)

const viewBox = { width: 800, height: 280 }
const padding = { top: 24, right: 24, bottom: 40, left: 56 }

const chartWidth = viewBox.width - padding.left - padding.right
const chartHeight = viewBox.height - padding.top - padding.bottom

const values = computed(() => props.data.map(d => d.value))
const minValue = computed(() => Math.min(...values.value))
const maxValue = computed(() => Math.max(...values.value))
const range = computed(() => Math.max(maxValue.value - minValue.value, 1))

function x(index: number) {
  return padding.left + (index / (props.data.length - 1 || 1)) * chartWidth
}

function y(value: number) {
  return padding.top + chartHeight - ((value - minValue.value) / range.value) * chartHeight
}

const lineD = computed(() => {
  return props.data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
    .join(' ')
})

const areaD = computed(() => {
  if (!props.data.length) return ''
  const firstX = x(0)
  const lastX = x(props.data.length - 1)
  const bottomY = padding.top + chartHeight
  return `${lineD.value} L ${lastX.toFixed(1)} ${bottomY} L ${firstX.toFixed(1)} ${bottomY} Z`
})

const yTicks = computed(() => {
  const count = 5
  return Array.from({ length: count }, (_, i) => {
    const value = minValue.value + (range.value * i) / (count - 1)
    return { value, y: y(value) }
  })
})

const xTicks = computed(() => {
  const count = Math.min(props.data.length, 7)
  const step = Math.max(1, Math.floor(props.data.length / count))
  return props.data
    .map((d, i) => ({ label: d.label, x: x(i), index: i }))
    .filter((_, i) => i % step === 0 || i === props.data.length - 1)
})

function format(value: number) {
  return Math.round(value).toLocaleString()
}
</script>

<template>
  <div class="flex flex-col rounded-xl border border-neutral-200 bg-white p-5">
    <div class="mb-5">
      <h3 class="text-[15px] font-semibold tracking-tight text-neutral-900">{{ title }}</h3>
      <p v-if="subtitle" class="mt-0.5 text-[13px] text-neutral-500">{{ subtitle }}</p>
    </div>

    <svg
      :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
      class="h-[260px] w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.12" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line
        v-for="(tick, i) in yTicks"
        :key="`grid-${i}`"
        :x1="padding.left"
        :y1="tick.y"
        :x2="viewBox.width - padding.right"
        :y2="tick.y"
        stroke="#f5f5f5"
        stroke-width="1"
      />

      <!-- Y-axis labels -->
      <text
        v-for="(tick, i) in yTicks"
        :key="`y-${i}`"
        :x="padding.left - 10"
        :y="tick.y + 4"
        text-anchor="end"
        class="fill-neutral-400 text-[11px]"
        style="font-family: var(--font-mono)"
      >
        {{ format(tick.value) }}
      </text>

      <!-- X-axis labels -->
      <text
        v-for="(tick, i) in xTicks"
        :key="`x-${i}`"
        :x="tick.x"
        :y="viewBox.height - 12"
        text-anchor="middle"
        class="fill-neutral-400 text-[11px]"
      >
        {{ tick.label }}
      </text>

      <!-- Area -->
      <path
        :d="areaD"
        :fill="`url(#${gradientId})`"
      />

      <!-- Line -->
      <path
        :d="lineD"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />

      <!-- End dot -->
      <circle
        v-if="data.length"
        :cx="x(data.length - 1)"
        :cy="y(data[data.length - 1]!.value)"
        r="4"
        :fill="color"
      />
    </svg>
  </div>
</template>
