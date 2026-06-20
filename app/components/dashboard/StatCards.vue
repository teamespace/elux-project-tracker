// styled: agent-3
<script setup lang="ts">
export interface StatCard {
  label: string
  value?: number
  percent?: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
  iconColor?: 'blue' | 'red' | 'amber' | 'green'
  valueColor?: string
  progress?: { pct: number; color: string; caption: string }
  miniBars?: { label: string; value: number; pct: number; color: string }[]
  chartType?: 'line' | 'bar' | 'donut'
  chartData?: number[]
  chartValue?: number
  chartColor?: string
  fullWidthChart?: boolean
  stacked?: { label: string; value: number; color: string; textColor?: string }[]
}

defineProps<{
  stats: StatCard[]
}>()

const iconColorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
}

function parseSub(sub: string) {
  const match = sub.match(/^([+-]?\d+(?:\.\d+)?)%?\s*(.*)$/)
  if (match) {
    return { value: match[1], suffix: sub.startsWith(match[1] + '%') ? '%' : '', rest: match[2] }
  }
  return { value: '', suffix: '', rest: sub }
}
</script>

<template>
  <div class="grid grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white px-[18px] py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      :class="{ 'pb-0': stat.fullWidthChart }"
    >
      <div class="mb-3.5 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div
            class="flex size-7 items-center justify-center rounded-md text-white"
            :class="iconColorMap[stat.iconColor || 'blue']"
          >
            <UIcon :name="stat.icon" class="size-3.5" />
          </div>
          <span class="text-[12px] font-medium text-gray-600">{{ stat.label }}</span>
        </div>
        <button class="flex size-[18px] items-center justify-center rounded-full border border-gray-300 text-[10px] font-bold leading-none text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500">
          i
        </button>
      </div>

      <div class="flex flex-wrap items-baseline gap-2">
        <span class="text-[32px] font-bold leading-none tracking-tight text-gray-900" :class="stat.valueColor">
          {{ stat.percent !== undefined ? `${stat.percent}%` : stat.value }}
        </span>
        <span
          v-if="parseSub(stat.sub).value"
          class="inline-flex items-center gap-0.5 text-[12px] font-semibold"
          :class="stat.trend === 'down' ? 'text-red-600' : 'text-green-600'"
        >
          <UIcon
            :name="stat.trend === 'down' ? 'ph:caret-down' : 'ph:caret-up'"
            class="size-3"
          />
          {{ parseSub(stat.sub).value }}{{ parseSub(stat.sub).suffix }}
        </span>
        <span class="text-[12px] text-gray-400">{{ parseSub(stat.sub).rest }}</span>
      </div>

      <!-- Open Tasks: progress bar -->
      <template v-if="stat.progress">
        <div class="mt-3.5">
          <div class="h-[5px] overflow-hidden rounded-md bg-gray-100">
            <div
              class="h-full rounded-md"
              :class="stat.progress.color"
              :style="{ width: `${stat.progress.pct}%` }"
            />
          </div>
          <p class="mt-[7px] text-[11px] text-gray-400">{{ stat.progress.caption }}</p>
        </div>
      </template>

      <!-- At Risk: mini bars -->
      <template v-if="stat.miniBars?.length">
        <div class="mt-auto flex flex-col gap-2 pt-3">
          <div
            v-for="bar in stat.miniBars"
            :key="bar.label"
            class="flex items-center gap-2"
          >
            <span class="w-[50px] text-[11px] text-gray-500">{{ bar.label }}</span>
            <div class="h-[5px] flex-1 overflow-hidden rounded-md bg-gray-100">
              <div
                class="h-full rounded-md"
                :class="bar.color"
                :style="{ width: `${bar.pct}%` }"
              />
            </div>
            <span class="w-3.5 text-right text-[12px] font-semibold text-gray-700">{{ bar.value }}</span>
          </div>
        </div>
      </template>

      <!-- Due This Week: full-width area chart -->
      <template v-if="stat.fullWidthChart && stat.chartType === 'line'">
        <div class="-mx-[18px] mt-3 h-[58px]">
          <DashboardMiniAreaChart :data="stat.chartData ?? []" :color="stat.chartColor || '#22C55E'" />
        </div>
      </template>

      <!-- Completion Rate: stacked bar -->
      <template v-if="stat.stacked?.length">
        <div class="mt-auto flex flex-col gap-2 pt-3">
          <div class="flex h-2 gap-0.5 overflow-hidden rounded-md">
            <div
              v-for="seg in stat.stacked"
              :key="seg.label"
              class="h-full"
              :class="seg.color"
              :style="{ flex: seg.value }"
            />
          </div>
          <div class="flex">
            <div
              v-for="seg in stat.stacked"
              :key="seg.label"
              class="flex flex-1 flex-col gap-0.5 border-l border-gray-100 pl-2.5 first:border-l-0 first:pl-0"
            >
              <span class="text-[14px] font-bold leading-none" :class="seg.textColor || 'text-gray-900'">{{ seg.value }}</span>
              <span class="text-[10.5px] text-gray-400">{{ seg.label }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
