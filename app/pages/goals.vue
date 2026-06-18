<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Goals',
})

const goals = [
  {
    id: 'goal-1',
    title: 'Q3 Ship Product Redesign',
    status: 'on-track' as const,
    statusLabel: 'ON TRACK',
    owner: { initials: 'R', name: 'Rasya' },
    kpiCount: 3,
    epicCount: 2,
    dueDate: 'Sep 30, 2026',
    progress: 58,
  },
  {
    id: 'goal-2',
    title: 'Q3 Improve Dev Velocity',
    status: 'at-risk' as const,
    statusLabel: 'AT RISK',
    owner: { initials: 'M', name: 'Maya' },
    kpiCount: 5,
    epicCount: 3,
    dueDate: 'Sep 30, 2026',
    progress: 28,
  },
  {
    id: 'goal-3',
    title: 'Q4 Launch Beta to 100 Users',
    status: 'not-started' as const,
    statusLabel: 'NOT STARTED',
    owner: { initials: 'D', name: 'Dito' },
    kpiCount: 2,
    epicCount: 0,
    dueDate: 'Dec 31, 2026',
    progress: 0,
  },
]

function statusClasses(status: string) {
  const map: Record<string, string> = {
    'on-track': 'bg-green-50 text-green-600 border-green-200',
    'at-risk': 'bg-amber-50 text-amber-600 border-amber-200',
    'not-started': 'bg-gray-50 text-gray-500 border-gray-200',
  }
  return map[status] || map['not-started']
}

function progressBarColor(progress: number) {
  if (progress >= 75) return 'bg-green-600'
  if (progress >= 25) return 'bg-amber-600'
  return 'bg-gray-500'
}
</script>

<template>
  <div>
    <div class="mt-2 flex flex-col gap-2">
      <NuxtLink
        v-for="goal in goals"
        :key="goal.id"
        :to="`/goals/${goal.id}`"
        class="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <h3 class="text-[15px] font-semibold text-gray-900">
              {{ goal.title }}
            </h3>
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
              <span class="inline-flex items-center gap-1.5">
                <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                  {{ goal.owner.initials }}
                </span>
                {{ goal.owner.name }}
              </span>
              <span>{{ goal.kpiCount }} KPIs</span>
              <span class="text-gray-400">·</span>
              <span>{{ goal.epicCount }} {{ goal.epicCount === 1 ? 'epic' : 'epics' }}</span>
              <span class="text-gray-400">·</span>
              <span>Due {{ goal.dueDate }}</span>
            </div>
          </div>
          <span
            class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
            :class="statusClasses(goal.status)"
          >
            {{ goal.statusLabel }}
          </span>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <div class="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full transition-all"
              :class="progressBarColor(goal.progress)"
              :style="{ width: `${goal.progress}%` }"
            />
          </div>
          <span class="w-10 text-right text-[11px] tabular-nums text-gray-500">{{ goal.progress }}%</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
