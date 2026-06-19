<script setup lang="ts">
interface DonutSegment {
  label: string
  value: number
  color: string
}

interface StatCard {
  label: string
  value: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
  chartType: 'line' | 'bar' | 'donut'
  chartData: number[] | DonutSegment[]
}

const props = defineProps<{
  stats: StatCard[]
}>()

const trendMeta = {
  up: {
    icon: 'ph:arrow-up',
    class: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  down: {
    icon: 'ph:arrow-down',
    class: 'text-rose-500 bg-rose-50 border-rose-200',
  },
  neutral: {
    icon: 'ph:minus',
    class: 'text-neutral-600 bg-neutral-100 border-neutral-200',
  },
}

function parseSub(sub: string) {
  const match = sub.match(/^([+-]?\d+(?:\.\d+)?)%?\s*(.*)$/)
  if (match) {
    return { percent: `${match[1]}%`, comparison: match[2] }
  }
  return { percent: '', comparison: sub }
}

function isNumberArray(data: number[] | DonutSegment[]): data is number[] {
  return typeof data[0] === 'number'
}

function chartColor(trend: 'up' | 'down' | 'neutral') {
  if (trend === 'up') return '#10B981'
  if (trend === 'down') return '#F43F5E'
  return '#2563EB'
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="stat in props.stats"
      :key="stat.label"
      class="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
    >
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <UIcon
              :name="stat.icon"
              class="size-4 text-neutral-400 transition-colors group-hover:text-neutral-600"
            />
            <p class="text-[12px] font-medium text-neutral-500">
              {{ stat.label }}
            </p>
          </div>

          <p class="mt-3 text-[32px] font-semibold leading-none tracking-tight text-neutral-900 tabular-nums">
            {{ stat.value.toLocaleString() }}
          </p>
        </div>

        <div class="shrink-0">
          <DashboardMiniLineChart
            v-if="stat.chartType === 'line' && isNumberArray(stat.chartData)"
            :data="stat.chartData"
            :color="chartColor(stat.trend)"
            :height="48"
          />
          <DashboardMiniBarChart
            v-else-if="stat.chartType === 'bar' && isNumberArray(stat.chartData)"
            :data="stat.chartData"
            :color="chartColor(stat.trend)"
            :height="48"
          />
          <DashboardMiniDonutChart
            v-else-if="stat.chartType === 'donut' && !isNumberArray(stat.chartData)"
            :data="stat.chartData"
            :size="48"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
            :class="trendMeta[stat.trend].class"
          >
            <UIcon :name="trendMeta[stat.trend].icon" class="size-3" />
            <template v-if="parseSub(stat.sub).percent">
              {{ parseSub(stat.sub).percent }}
            </template>
            <template v-else>
              {{ stat.sub }}
            </template>
          </span>
        </div>

        <span class="text-[11px] text-neutral-400">
          {{ parseSub(stat.sub).comparison || 'Last 30 days' }}
        </span>
      </div>
    </div>
  </div>
</template>
