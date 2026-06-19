<script setup lang="ts">
import { progressColor } from '~/shared/projects'

interface Project {
  id: string
  name: string
  status: 'on-track' | 'at-risk' | 'delayed' | 'not-started'
  statusLabel: string
  description: string
  progress: number
  openTasks: number
  atRiskTasks: number
  dueDate: string
  createdDate?: string
  priority: 'high' | 'medium' | 'low'
  priorityLabel: string
  assignees: { initials: string; name: string; avatar: string }[]
}

const props = defineProps<{
  projects: Project[]
}>()

const projectSlideOver = useProjectSlideOver()

const statusClass = (status: string) => ({
  'on-track': 'text-green-700 bg-green-50 border-green-200',
  'at-risk': 'text-amber-700 bg-amber-50 border-amber-200',
  'delayed': 'text-red-700 bg-red-50 border-red-200',
  'not-started': 'text-gray-600 bg-gray-100 border-gray-200',
}[status] || '')

const statusDotClass = (status: string) => ({
  'on-track': 'bg-green-500',
  'at-risk': 'bg-amber-500',
  'delayed': 'bg-red-500',
  'not-started': 'bg-gray-400',
}[status] || 'bg-gray-400')

const priorityClass = (priority: string) => ({
  high: 'text-red-700 bg-red-50 border-red-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-green-700 bg-green-50 border-green-200',
}[priority] || 'text-gray-600 bg-gray-100 border-gray-200')

const deadlineClass = (status: string) =>
  status === 'at-risk' || status === 'delayed' ? 'text-red-600' : 'text-gray-500'
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white">
    <!-- Top bar -->
    <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
      <h2 class="text-lg font-semibold text-gray-900">
        Projects
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <UIcon name="ph:magnifying-glass" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects"
            class="h-9 w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
        </div>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <UIcon name="ph:faders" class="size-4" />
          Filter
        </button>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase text-gray-500">
          <th class="w-12 px-5 py-3">
            <input
              type="checkbox"
              class="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @click.stop
            >
          </th>
          <th class="px-4 py-3">
            Project Name
          </th>
          <th class="px-4 py-3">
            Status
          </th>
          <th class="px-4 py-3">
            Progress
          </th>
          <th class="px-4 py-3">
            Deadline
          </th>
          <th class="px-4 py-3">
            People
          </th>
          <th class="px-4 py-3">
            Priority
          </th>
          <th class="w-px px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in props.projects"
          :key="project.id"
          class="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
          @click="projectSlideOver.openView(project.id)"
        >
          <td class="px-5 py-4" @click.stop>
            <input
              type="checkbox"
              class="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
          </td>
          <td class="px-4 py-4">
            <span class="font-semibold text-gray-900">{{ project.name }}</span>
          </td>
          <td class="px-4 py-4">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="statusClass(project.status)"
            >
              <span class="size-1.5 rounded-full" :class="statusDotClass(project.status)" />
              {{ project.statusLabel }}
            </span>
          </td>
          <td class="px-4 py-4">
            <div class="flex w-40 items-center gap-3">
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="progressColor(project.progress)"
                  :style="{ width: project.progress + '%' }"
                />
              </div>
              <span class="text-xs font-medium text-gray-700">{{ project.progress }}%</span>
            </div>
          </td>
          <td class="px-4 py-4">
            <span class="text-sm" :class="deadlineClass(project.status)">
              <span v-if="project.dueDate">{{ project.dueDate }}</span>
              <span v-else-if="project.createdDate">{{ project.createdDate }}</span>
            </span>
          </td>
          <td class="px-4 py-4">
            <div class="flex items-center">
              <UAvatar
                v-for="(a, i) in project.assignees.slice(0, 3)"
                :key="i"
                :src="a.avatar"
                :text="a.initials"
                size="xs"
                class="ring-2 ring-white first:ml-0 -ml-1.5"
              />
              <div
                v-if="project.assignees.length > 3"
                class="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 ring-2 ring-white -ml-1.5"
              >
                +{{ project.assignees.length - 3 }}
              </div>
            </div>
          </td>
          <td class="px-4 py-4">
            <span
              class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="priorityClass(project.priority)"
            >
              {{ project.priorityLabel }}
            </span>
          </td>
          <td class="px-4 py-4 text-right" @click.stop>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <UIcon name="ph:dots-three-vertical" class="size-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
