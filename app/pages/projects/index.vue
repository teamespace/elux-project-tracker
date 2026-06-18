<script setup lang="ts">
import { projects, statusColor, avatarColor, type Project, type ProjectStatus } from '~/shared/projects'

definePageMeta({
  layout: 'default',
  title: 'Projects',
})

const statusFilter = ref<ProjectStatus | 'all'>('all')
const sortBy = ref<'name' | 'status' | 'progress'>('name')

const statusFilterOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'On track', value: 'on-track' },
  { label: 'At risk', value: 'at-risk' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Not started', value: 'not-started' },
]

const sortOptions = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Status', value: 'status' },
  { label: 'Sort by Progress', value: 'progress' },
]

const filteredProjects = computed<Project[]>(() => {
  let list = [...projects]

  if (statusFilter.value !== 'all') {
    list = list.filter(p => p.status === statusFilter.value)
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'status') return a.status.localeCompare(b.status)
    if (sortBy.value === 'progress') return b.progress - a.progress
    return 0
  })

  return list
})

function progressColorForStatus(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    'on-track': 'bg-green-500',
    'at-risk': 'bg-amber-500',
    delayed: 'bg-red-500',
    'not-started': 'bg-gray-400',
  }
  return map[status]
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <USelect
        v-model="statusFilter"
        :items="statusFilterOptions"
        value-key="value"
        label-key="label"
        color="neutral"
        variant="outline"
        size="sm"
        class="w-44"
      />
      <USelect
        v-model="sortBy"
        :items="sortOptions"
        value-key="value"
        label-key="label"
        color="neutral"
        variant="outline"
        size="sm"
        class="w-44"
      />
    </div>

    <div class="flex flex-col gap-3">
      <NuxtLink
        v-for="project in filteredProjects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm active:scale-[0.99] sm:p-5"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-medium text-gray-600">{{ project.key }}</span>
              <h4 class="text-sm font-semibold text-gray-900">{{ project.name }}</h4>
            </div>
            <p class="mt-1 text-xs text-gray-500 line-clamp-2">{{ project.description }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>{{ project.openTasks }} open tasks</span>
              <span v-if="project.atRiskTasks > 0" class="text-amber-600">
                · {{ project.atRiskTasks }} at risk
              </span>
              <span v-if="project.assignees.length" class="flex items-center gap-1">
                ·
                <UAvatarGroup size="2xs" :max="3">
                  <UAvatar
                    v-for="(a, i) in project.assignees"
                    :key="a.name"
                    :text="a.initials"
                    :alt="a.name"
                    :class="avatarColor(i)"
                    :ui="{ fallback: 'text-white' }"
                  />
                </UAvatarGroup>
              </span>
              <span>· Due {{ new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-1.5">
            <UBadge :label="project.statusLabel" :color="statusColor(project.status)" variant="outline" size="sm" />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full transition-all"
              :class="progressColorForStatus(project.status)"
              :style="{ width: `${project.progress}%` }"
            />
          </div>
          <span class="w-10 text-right text-xs tabular-nums text-gray-500">{{ project.progress }}%</span>
        </div>
      </NuxtLink>
    </div>

    <div v-if="filteredProjects.length === 0" class="py-12 text-center">
      <UIcon name="ph:folder" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-sm text-gray-500">No projects match the selected filter.</p>
      <UButton variant="ghost" color="neutral" size="sm" class="mt-2" @click="statusFilter = 'all'">
        Clear filter
      </UButton>
    </div>
  </div>
</template>
