<script setup lang="ts">
interface StatCard {
  label: string
  value: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
  chartType: 'line' | 'bar' | 'donut'
  chartData?: number[]
  chartValue?: number
}

const props = defineProps<{
  stats: StatCard[]
}>()

const trendMeta = {
  up: {
    icon: 'ph:arrow-up',
    class: 'text-green-700 bg-green-50 border-green-200',
  },
  down: {
    icon: 'ph:arrow-down',
    class: 'text-red-700 bg-red-50 border-red-200',
  },
  neutral: {
    icon: 'ph:minus',
    class: 'text-gray-600 bg-gray-100 border-gray-200',
  },
}

function chartColor(trend: StatCard['trend']) {
  if (trend === 'up') return '#16A34A'
  if (trend === 'down') return '#DC2626'
  return '#4B5563'
}

function parseSub(sub: string) {
  const match = sub.match(/^([+-]?\d+(?:\.\d+)?)%?\s*(.*)$/)
  if (match) {
    return { percent: `${match[1]}%`, comparison: match[2] }
  }
  return { percent: '', comparison: sub }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div
      v-for="stat in props.stats"
      :key="stat.label"
      class="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
    >
      <div class="flex flex-col justify-between gap-4">
        <div class="flex items-center gap-2">
          <UIcon
            :name="stat.icon"
            class="size-4 text-gray-400"
          />
          <p class="text-[13px] font-medium text-gray-500">
            {{ stat.label }}
          </p>
        </div>

        <div>
          <p class="text-[32px] font-bold tracking-tight text-gray-900">
            {{ stat.value }}
          </p>

          <div class="mt-1 flex items-center gap-2">
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
            <span
              v-if="parseSub(stat.sub).comparison"
              class="text-[11px] text-gray-500"
            >
              {{ parseSub(stat.sub).comparison }}
            </span>
          </div>
        </div>
      </div>

      <div class="shrink-0">
        <DashboardMiniLineChart
          v-if="stat.chartType === 'line'"
          :data="stat.chartData ?? []"
          :color="chartColor(stat.trend)"
          :height="56"
        />
        <DashboardMiniBarChart
          v-else-if="stat.chartType === 'bar'"
          :data="stat.chartData ?? []"
          :color="chartColor(stat.trend)"
          :height="56"
        />
        <DashboardMiniDonutChart
          v-else-if="stat.chartType === 'donut'"
          :value="stat.chartValue ?? 0"
          :color="chartColor(stat.trend)"
          :height="56"
        />
      </div>
    </div>
  </div>
</template>
