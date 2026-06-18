<script setup lang="ts">
interface StatCard {
  label: string
  value: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
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

function parseSub(sub: string) {
  const match = sub.match(/^(\d+(?:\.\d+)?)%?\s*(.*)$/)
  if (match) {
    return { percent: `${match[1]}%`, comparison: match[2] }
  }
  return { percent: '', comparison: sub }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="stat in props.stats"
      :key="stat.label"
      class="cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
    >
      <div class="flex items-start justify-between">
        <p class="text-[13px] font-medium text-gray-500">
          {{ stat.label }}
        </p>
        <UIcon
          :name="stat.icon"
          class="size-5 text-gray-400"
        />
      </div>

      <p class="mt-3 text-[28px] font-bold tracking-tight text-gray-900">
        {{ stat.value }}
      </p>

      <div class="mt-3 flex items-center gap-2">
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
</template>
