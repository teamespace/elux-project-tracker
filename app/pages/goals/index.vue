<script setup lang="ts">
import { goals, progressBarColor, statusClasses } from '~/shared/goals'

const { openCreate } = useGoalSlideOver()

definePageMeta({
  layout: 'default',
  title: 'Goals',
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">Goals</h1>
      <UButton color="primary" icon="ph:plus" label="New goal" @click="openCreate" />
    </div>

    <div class="flex flex-col gap-2">
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
              <span>{{ goal.kpis.length }} KPIs</span>
              <span class="text-gray-400">·</span>
              <span>{{ goal.linkedProjects.length }} {{ goal.linkedProjects.length === 1 ? 'project' : 'projects' }}</span>
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
