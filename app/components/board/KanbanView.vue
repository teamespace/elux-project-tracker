<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Status, Task } from '~/shared/board'

const props = defineProps<{
  tasks: Task[]
  statuses: Status[]
}>()

const emit = defineEmits<{
  updateTask: [taskId: string, newStatus: Task['status']]
}>()

const draggingTaskId = ref<string | null>(null)
const dragOverStatusId = ref<string | null>(null)

const slideOver = useTaskSlideOver()

const onCardClick = (task: Task) => {
  slideOver.openEdit(task.id)
}

const tasksByStatus = computed(() => {
  const map: Record<string, Task[]> = {}
  for (const status of props.statuses) {
    map[status.id] = props.tasks.filter(task => task.status === status.id)
  }
  return map
})

const statusBadgeClass = (statusId: Task['status']) => {
  switch (statusId) {
    case 'todo':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'in-review':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'done':
      return 'bg-green-50 text-green-700 border-green-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const priorityDotClass = (priority: Task['priority']) => {
  return {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500',
  }[priority]
}

const onDragStart = (event: DragEvent, task: Task) => {
  draggingTaskId.value = task.id
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
  }
}

const onDragEnd = () => {
  draggingTaskId.value = null
  dragOverStatusId.value = null
}

const onDragEnterColumn = (statusId: string) => {
  dragOverStatusId.value = statusId
}

const onDragLeaveColumn = (event: DragEvent, statusId: string) => {
  const target = event.currentTarget as HTMLElement
  const related = event.relatedTarget as HTMLElement | null
  if (!related || !target.contains(related)) {
    if (dragOverStatusId.value === statusId) {
      dragOverStatusId.value = null
    }
  }
}

const onDrop = (status: Status) => {
  dragOverStatusId.value = null
  if (!draggingTaskId.value) return
  emit('updateTask', draggingTaskId.value, status.id)
  draggingTaskId.value = null
}
</script>

<template>
  <BoardEmptyState v-if="tasks.length === 0" />
  <div v-else class="flex h-full gap-4 overflow-x-auto px-1 pb-2">
    <div
      v-for="status in statuses"
      :key="status.id"
      :data-status="status.id"
      class="flex flex-1 min-w-[260px] flex-col rounded-xl border border-gray-200 transition-colors"
      :class="[
        status.bg,
        dragOverStatusId === status.id && draggingTaskId
          ? 'bg-blue-50 ring-2 ring-blue-400'
          : '',
      ]"
      @dragover.prevent
      @dragenter.prevent="onDragEnterColumn(status.id)"
      @dragleave="onDragLeaveColumn($event, status.id)"
      @drop="onDrop(status)"
    >
      <header class="flex items-center gap-2 rounded-t-xl px-4 py-3">
        <span
          class="h-2 w-2 rounded-full"
          :class="status.dotColor"
        />
        <h3
          class="text-xs font-semibold uppercase tracking-wider"
          :class="status.headerText"
        >
          {{ status.label }}
        </h3>
        <span class="text-xs text-gray-500">
          ({{ tasksByStatus[status.id]?.length || 0 }})
        </span>
      </header>

      <div class="flex-1 space-y-3 overflow-y-auto p-3">
        <div
          v-for="task in tasksByStatus[status.id]"
          :key="task.id"
          draggable="true"
          class="cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:cursor-pointer hover:shadow-md active:cursor-grabbing"
          :class="{ 'opacity-50': draggingTaskId === task.id }"
          @click="onCardClick(task)"
          @dragstart="onDragStart($event, task)"
          @dragend="onDragEnd"
        >
          <div class="mb-2 flex items-center justify-between gap-2">
            <span
              class="inline-flex items-center truncate rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600"
            >
              {{ task.epicName }}
            </span>
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :class="priorityDotClass(task.priority)"
            />
          </div>

          <h4 class="mb-1 text-sm font-medium text-gray-900">
            {{ task.title }}
          </h4>

          <p
            v-if="task.description"
            class="mb-3 line-clamp-1 text-xs text-gray-500"
          >
            {{ task.description }}
          </p>

          <span
            class="mb-3 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
            :class="statusBadgeClass(task.status)"
          >
            {{ task.statusLabel }}
          </span>

          <div
            v-if="task.progress > 0 && task.progress < 100"
            class="mb-3"
          >
            <div class="mb-1 flex items-center justify-between">
              <span class="text-[11px] text-gray-500">Progress</span>
              <span class="text-[11px] font-semibold text-gray-700">
                {{ task.progress }}%
              </span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full bg-blue-600 transition-all duration-300"
                :style="{ width: task.progress + '%' }"
              />
            </div>
          </div>

          <div
            v-else-if="task.progress === 100"
            class="mb-3 flex items-center gap-1 text-xs font-medium text-green-600"
          >
            <UIcon name="ph:check" class="size-3.5" />
            Done
          </div>

          <div class="flex items-center justify-between gap-2 pt-1">
            <UAvatar
              :src="task.assignee.avatar"
              :text="task.assignee.initials"
              size="xs"
              :title="task.assignee.name"
            />

            <div class="flex items-center gap-3 text-[11px] text-gray-500">
              <span
                v-if="task.comments > 0"
                class="flex items-center gap-1"
              >
                <UIcon name="ph:chat-circle" class="size-3.5" />
                {{ task.comments }}
              </span>
              <span
                v-if="task.attachments > 0"
                class="flex items-center gap-1"
              >
                <UIcon name="ph:paperclip" class="size-3.5" />
                {{ task.attachments }}
              </span>
              <span
                v-if="task.dueDate"
                class="flex items-center gap-1"
              >
                <UIcon name="ph:calendar-blank" class="size-3.5" />
                {{ task.dueDateLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="m-3 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
        @click="slideOver.openCreate()"
      >
        <UIcon name="ph:plus" class="size-3.5" />
        Add task
      </button>
    </div>
  </div>
</template>
