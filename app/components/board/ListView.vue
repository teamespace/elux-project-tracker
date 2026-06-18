<script setup lang="ts">
import type { Status, Task } from '~/shared/board'

const props = defineProps<{
  tasks: Task[]
  statuses: Status[]
}>()

const slideOver = useTaskSlideOver()

const onTaskClick = (task: Task) => {
  slideOver.openEdit(task.id)
}

const tasksByStatus = computed(() => {
  const grouped: Record<string, Task[]> = {}
  for (const status of props.statuses) {
    grouped[status.id] = props.tasks.filter(task => task.status === status.id)
  }
  return grouped
})

const statusDotClass = (statusId: string) => {
  switch (statusId) {
    case 'todo':
      return 'bg-gray-400'
    case 'in-progress':
      return 'bg-blue-500'
    case 'in-review':
      return 'bg-amber-500'
    case 'done':
      return 'bg-green-500'
    default:
      return 'bg-gray-400'
  }
}

const statusClass = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'in-review':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'done':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const priorityClass = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
</script>

<template>
  <BoardEmptyState v-if="props.tasks.length === 0" />
  <div v-else class="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4">
    <div
      v-for="status in props.statuses"
      :key="status.id"
      class="flex flex-col"
    >
      <div class="mb-3 flex items-center gap-2">
        <span class="size-2 rounded-full" :class="statusDotClass(status.id)" />
        <h3 class="text-[14px] font-semibold text-gray-900">
          {{ status.label }}
        </h3>
        <span class="text-[12px] text-gray-500">
          ({{ tasksByStatus[status.id]?.length || 0 }})
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="task in tasksByStatus[status.id]"
          :key="task.id"
          class="flex cursor-pointer items-center gap-4 rounded-md border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-gray-300 hover:bg-gray-50"
          @click="onTaskClick(task)"
        >
          <span
            :class="[
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              statusClass(task.status),
            ]"
          >
            <span class="size-1.5 rounded-full bg-current" />
            {{ task.statusLabel }}
          </span>

          <span
            :class="[
              'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              priorityClass(task.priority),
            ]"
          >
            {{ task.priorityLabel }}
          </span>

          <div class="min-w-0 flex-1">
            <p class="truncate text-[13px] font-semibold text-gray-900">
              {{ task.title }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <div
              class="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
              :title="task.assignee.name"
            >
              {{ task.assignee.initials }}
            </div>
          </div>

          <span
            class="hidden shrink-0 truncate rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 sm:block"
          >
            {{ task.projectName }}
          </span>

          <span class="shrink-0 text-[12px] text-gray-500">
            {{ task.dueDateLabel }}
          </span>
        </div>

        <div
          v-if="!tasksByStatus[status.id]?.length"
          class="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-[13px] text-gray-500"
        >
          No tasks
        </div>
      </div>
    </div>
  </div>
</template>
