<script setup lang="ts">
interface TableTaskAssignee {
  name: string
  initials: string
  bg?: string
  color?: string
  avatar?: string
}

type TableTaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'
type TableTaskPriority = 'high' | 'medium' | 'low'

interface TableTask {
  id: string | number
  title: string
  description?: string
  status: TableTaskStatus
  priority: TableTaskPriority
  assignee: TableTaskAssignee
  date: string
  progress: number
}

const props = defineProps<{
  tasks: TableTask[]
  projectName?: string
  projectCategory?: string
}>()

const emit = defineEmits<{
  'row-click': [task: TableTask]
}>()

const statusClass = (status: TableTaskStatus) => {
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

const statusDotClass = (status: TableTaskStatus) => {
  switch (status) {
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

const statusLabel = (status: TableTaskStatus) => {
  switch (status) {
    case 'todo':
      return 'To Do'
    case 'in-progress':
      return 'In Progress'
    case 'in-review':
      return 'In Review'
    case 'done':
      return 'Done'
    default:
      return status
  }
}

const priorityClass = (priority: TableTaskPriority) => {
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

const priorityLabel = (priority: TableTaskPriority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const progressColor = (progress: number) => {
  if (progress === 0) return 'bg-gray-300'
  if (progress <= 33) return 'bg-amber-500'
  if (progress <= 66) return 'bg-blue-500'
  if (progress < 100) return 'bg-green-500'
  return 'bg-green-600'
}

const onRowClick = (task: TableTask) => {
  emit('row-click', task)
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] border-collapse">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left">
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Task
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Status
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Priority
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Assignee
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Project
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Due Date
            </th>
            <th class="px-4 py-3 text-[12px] font-semibold text-gray-600">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in props.tasks"
            :key="task.id"
            class="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
            @click="onRowClick(task)"
          >
            <td class="px-4 py-3">
              <div class="min-w-0">
                <p class="truncate text-[13px] font-semibold text-gray-900">
                  {{ task.title }}
                </p>
                <p v-if="task.description" class="mt-0.5 line-clamp-1 text-[12px] text-gray-500">
                  {{ task.description }}
                </p>
              </div>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                  statusClass(task.status),
                ]"
              >
                <span class="size-1.5 rounded-full" :class="statusDotClass(task.status)" />
                {{ statusLabel(task.status) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                  priorityClass(task.priority),
                ]"
              >
                {{ priorityLabel(task.priority) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <UAvatar
                  v-if="task.assignee.avatar"
                  :src="task.assignee.avatar"
                  :text="task.assignee.initials"
                  size="xs"
                />
                <div
                  v-else
                  class="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold"
                  :style="{ background: task.assignee.bg || '#9CA3AF', color: task.assignee.color || '#fff' }"
                >
                  {{ task.assignee.initials }}
                </div>
                <span class="truncate text-[13px] text-gray-700">
                  {{ task.assignee.name }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-col gap-0.5">
                <span v-if="props.projectName" class="truncate text-[13px] font-medium text-gray-900">
                  {{ props.projectName }}
                </span>
                <span v-if="props.projectCategory" class="truncate text-[12px] text-gray-500">
                  {{ props.projectCategory }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="text-[13px] text-gray-700">
                {{ task.date }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="w-28">
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-[12px] font-semibold text-gray-700">
                    {{ task.progress }}%
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="progressColor(task.progress)"
                    :style="{ width: task.progress + '%' }"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
