<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  height?: number
}>()

const H = computed(() => props.height ?? 48)
const W = 110
const PX = 2
const PY = 4
const BAR_W = 4
const GAP = 3

const bars = computed(() => {
  const max = Math.max(...props.data, 1)
  const uh = H.value - PY * 2
  // center the bar group horizontally
  const totalW = props.data.length * BAR_W + (props.data.length - 1) * GAP
  const startX = PX + (W - PX * 2 - totalW) / 2

  return props.data.map((v, i) => {
    const barH = Math.max((v / max) * uh, 2)
    const isLast = i === props.data.length - 1
    return {
      x: startX + i * (BAR_W + GAP),
      y: PY + uh - barH,
      w: BAR_W,
      h: barH,
      opacity: isLast ? 1 : 0.35 + (i / props.data.length) * 0.45,
    }
  })
})

const color = computed(() => props.color ?? '#EF4444')
</script>

<template>
  <svg
    :width="W"
    :height="H"
    :viewBox="`0 0 ${W} ${H}`"
    class="overflow-visible"
  >
    <rect
      v-for="(bar, i) in bars"
      :key="i"
      :x="bar.x"
      :y="bar.y"
      :width="bar.w"
      :height="bar.h"
      :fill="color"
      :fill-opacity="bar.opacity"
      rx="1.5"
      ry="1.5"
    />
  </svg>
</template>
