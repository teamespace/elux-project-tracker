<script setup lang="ts">
import { computed, isRef, ref, type Ref } from 'vue'
import { useDropdownCloser } from '~/composables/useClickOutside'
import {
  assigneeOptions,
  priorityOptions,
  projectOptions,
  statusOptions,
  statuses,
  tasks as allTasks,
  type Task,
} from '~/shared/board'

type ViewMode = 'kanban' | 'table' | 'list' | 'calendar'

const currentView = ref<ViewMode>('kanban')

const tasks = ref<Task[]>([...allTasks])

const dueDateOptions = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'this-week', label: 'This week' },
  { value: 'next-week', label: 'Next week' },
  { value: 'later', label: 'Later' },
]

const selectedStatuses = ref<string[]>([])
const selectedPriorities = ref<string[]>([])
const selectedAssignees = ref<string[]>([])
const selectedProjects = ref<string[]>([])
const selectedDueDates = ref<string[]>([])

const openDropdown = ref<'status' | 'priority' | 'filters' | 'sort' | null>(null)

const statusDropdownRef = ref<HTMLElement | null>(null)
const priorityDropdownRef = ref<HTMLElement | null>(null)
const filtersDropdownRef = ref<HTMLElement | null>(null)

useDropdownCloser(
  {
    status: statusDropdownRef,
    priority: priorityDropdownRef,
    filters: filtersDropdownRef,
  },
  openDropdown,
)

function toggleDropdown(name: typeof openDropdown.value) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function toggleSelection<T>(list: Ref<T[]> | T[], value: T) {
  const arr = isRef(list) ? list.value : list
  const index = arr.indexOf(value)
  if (index === -1) {
    arr.push(value)
  }
  else {
    arr.splice(index, 1)
  }
}

function clearFilters() {
  selectedStatuses.value = []
  selectedPriorities.value = []
  selectedAssignees.value = []
  selectedProjects.value = []
  selectedDueDates.value = []
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function isDateMatchingDueDateFilter(dateStr: string, filter: string) {
  const taskDate = new Date(dateStr)
  taskDate.setHours(0, 0, 0, 0)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = startOfWeek(now)
  const thisWeekEnd = endOfWeek(now)
  const nextWeekStart = new Date(thisWeekStart)
  nextWeekStart.setDate(nextWeekStart.getDate() + 7)
  const nextWeekEnd = new Date(thisWeekEnd)
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 7)

  switch (filter) {
    case 'overdue':
      return taskDate < today
    case 'this-week':
      return taskDate >= thisWeekStart && taskDate <= thisWeekEnd
    case 'next-week':
      return taskDate >= nextWeekStart && taskDate <= nextWeekEnd
    case 'later':
      return taskDate > nextWeekEnd
    default:
      return false
  }
}

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    if (selectedStatuses.value.length && !selectedStatuses.value.includes(task.status)) {
      return false
    }
    if (selectedPriorities.value.length && !selectedPriorities.value.includes(task.priority)) {
      return false
    }
    if (selectedAssignees.value.length && !selectedAssignees.value.includes(task.assignee.name)) {
      return false
    }
    if (selectedProjects.value.length && !selectedProjects.value.includes(task.epicName)) {
      return false
    }
    if (selectedDueDates.value.length && !selectedDueDates.value.some(filter => isDateMatchingDueDateFilter(task.dueDate, filter))) {
      return false
    }
    return true
  })
})

function updateTaskStatus(taskId: string, newStatus: Task['status']) {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  task.status = newStatus
  const statusMeta = statuses.find(s => s.id === newStatus)
  if (statusMeta) {
    task.statusLabel = statusMeta.label
  }
}

const viewTabs: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'kanban', label: 'Kanban', icon: 'ph:kanban' },
  { id: 'table', label: 'Table', icon: 'ph:table' },
  { id: 'list', label: 'List', icon: 'ph:list-dashes' },
  { id: 'calendar', label: 'Calendar', icon: 'ph:calendar-blank' },
]

interface ActiveFilter {
  type: string
  typeLabel: string
  value: string
  valueLabel: string
  remove: () => void
}

const activeFilters = computed<ActiveFilter[]>(() => {
  const filters: ActiveFilter[] = []

  selectedStatuses.value.forEach((value) => {
    const option = statusOptions.find(o => o.value === value)
    filters.push({
      type: 'status',
      typeLabel: 'Status',
      value,
      valueLabel: option?.label ?? value,
      remove: () => {
        const index = selectedStatuses.value.indexOf(value)
        if (index !== -1) selectedStatuses.value.splice(index, 1)
      },
    })
  })

  selectedPriorities.value.forEach((value) => {
    const option = priorityOptions.find(o => o.value === value)
    filters.push({
      type: 'priority',
      typeLabel: 'Priority',
      value,
      valueLabel: option?.label ?? value,
      remove: () => {
        const index = selectedPriorities.value.indexOf(value)
        if (index !== -1) selectedPriorities.value.splice(index, 1)
      },
    })
  })

  selectedAssignees.value.forEach((value) => {
    filters.push({
      type: 'assignee',
      typeLabel: 'Assignee',
      value,
      valueLabel: value,
      remove: () => {
        const index = selectedAssignees.value.indexOf(value)
        if (index !== -1) selectedAssignees.value.splice(index, 1)
      },
    })
  })

  selectedProjects.value.forEach((value) => {
    filters.push({
      type: 'project',
      typeLabel: 'Project',
      value,
      valueLabel: value,
      remove: () => {
        const index = selectedProjects.value.indexOf(value)
        if (index !== -1) selectedProjects.value.splice(index, 1)
      },
    })
  })

  selectedDueDates.value.forEach((value) => {
    const option = dueDateOptions.find(o => o.value === value)
    filters.push({
      type: 'dueDate',
      typeLabel: 'Due date',
      value,
      valueLabel: option?.label ?? value,
      remove: () => {
        const index = selectedDueDates.value.indexOf(value)
        if (index !== -1) selectedDueDates.value.splice(index, 1)
      },
    })
  })

  return filters
})

const hasActiveFilters = computed(() => activeFilters.value.length > 0)

</script>

<template>
  <div class="flex w-full flex-col">
    <!-- Toolbar -->
    <div class="flex flex-col gap-3 border-b border-gray-100 bg-white pb-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
      <!-- Left: filters -->
      <div class="flex items-center gap-1.5">
        <!-- Status dropdown -->
        <div ref="statusDropdownRef" class="relative">
          <button
            class="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'border-gray-400 bg-gray-50 text-gray-900': selectedStatuses.length > 0 }"
            @click="toggleDropdown('status')"
          >
            <span>Status</span>
            <span
              v-if="selectedStatuses.length > 0"
              class="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white"
            >
              {{ selectedStatuses.length }}
            </span>
            <UIcon name="ph:caret-down" class="size-3 text-gray-500" />
          </button>
          <div
            v-if="openDropdown === 'status'"
            class="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            <label
              v-for="option in statusOptions"
              :key="option.value"
              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                :checked="selectedStatuses.includes(option.value)"
                @change="toggleSelection(selectedStatuses, option.value)"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Priority dropdown -->
        <div ref="priorityDropdownRef" class="relative">
          <button
            class="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'border-gray-400 bg-gray-50 text-gray-900': selectedPriorities.length > 0 }"
            @click="toggleDropdown('priority')"
          >
            <span>Priority</span>
            <span
              v-if="selectedPriorities.length > 0"
              class="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white"
            >
              {{ selectedPriorities.length }}
            </span>
            <UIcon name="ph:caret-down" class="size-3 text-gray-500" />
          </button>
          <div
            v-if="openDropdown === 'priority'"
            class="absolute left-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            <label
              v-for="option in priorityOptions"
              :key="option.value"
              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                :checked="selectedPriorities.includes(option.value)"
                @change="toggleSelection(selectedPriorities, option.value)"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Filters dropdown -->
        <div ref="filtersDropdownRef" class="relative">
          <button
            class="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'border-gray-400 bg-gray-50 text-gray-900': selectedAssignees.length + selectedProjects.length + selectedDueDates.length > 0 }"
            @click="toggleDropdown('filters')"
          >
            <UIcon name="ph:funnel" class="size-3.5 text-gray-500" />
            <span>Filters</span>
            <span
              v-if="selectedAssignees.length + selectedProjects.length + selectedDueDates.length > 0"
              class="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white"
            >
              {{ selectedAssignees.length + selectedProjects.length + selectedDueDates.length }}
            </span>
          </button>
          <div
            v-if="openDropdown === 'filters'"
            class="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
          >
            <div class="mb-3">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Assignee
              </p>
              <label
                v-for="name in assigneeOptions"
                :key="name"
                class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  :checked="selectedAssignees.includes(name)"
                  @change="toggleSelection(selectedAssignees, name)"
                >
                <span>{{ name }}</span>
              </label>
            </div>

            <div class="mb-3">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Project
              </p>
              <label
                v-for="name in projectOptions"
                :key="name"
                class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  :checked="selectedProjects.includes(name)"
                  @change="toggleSelection(selectedProjects, name)"
                >
                <span>{{ name }}</span>
              </label>
            </div>

            <div>
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Due date
              </p>
              <label
                v-for="option in dueDateOptions"
                :key="option.value"
                class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] text-gray-700 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  :checked="selectedDueDates.includes(option.value)"
                  @change="toggleSelection(selectedDueDates, option.value)"
                >
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: view tabs -->
      <div class="flex items-center gap-2">
        <div class="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            v-for="tab in viewTabs"
            :key="tab.id"
            class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:text-gray-900"
            :class="currentView === tab.id ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'hover:bg-gray-100'"
            @click="currentView = tab.id"
          >
            <UIcon :name="tab.icon" class="size-4" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Active filter chips -->
    <div
      v-if="hasActiveFilters"
      class="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-white px-0 py-2.5"
    >
      <span
        v-for="filter in activeFilters"
        :key="`${filter.type}-${filter.value}`"
        class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[12px] text-gray-700"
      >
        <span class="font-medium text-gray-900">{{ filter.typeLabel }}:</span>
        <span>{{ filter.valueLabel }}</span>
        <button
          class="ml-0.5 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
          @click="filter.remove"
        >
          <UIcon name="ph:x" class="size-3" />
        </button>
      </span>
      <button
        class="text-[12px] font-medium text-gray-500 hover:text-gray-900"
        @click="clearFilters"
      >
        Clear all
      </button>
    </div>

    <!-- Active view -->
    <div class="mt-4 min-h-0 flex-1">
      <template v-if="filteredTasks.length > 0">
        <BoardKanbanView
          v-if="currentView === 'kanban'"
          :tasks="filteredTasks"
          :statuses="statuses"
          @update-task="updateTaskStatus"
        />
        <BoardTableView
          v-else-if="currentView === 'table'"
          :tasks="filteredTasks"
          :statuses="statuses"
        />
        <BoardListView
          v-else-if="currentView === 'list'"
          :tasks="filteredTasks"
          :statuses="statuses"
        />
        <BoardCalendarView
          v-else-if="currentView === 'calendar'"
          :tasks="filteredTasks"
        />
      </template>
      <div
        v-else
        class="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center"
      >
        <div class="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100">
          <UIcon name="ph:magnifying-glass" class="size-6 text-gray-400" />
        </div>
        <p class="text-[14px] font-medium text-gray-900">
          No tasks match your filters.
        </p>
        <p class="mb-4 mt-1 text-[13px] text-gray-500">
          Try adjusting your filters to see more results.
        </p>
        <button
          class="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 hover:text-gray-900"
          @click="clearFilters"
        >
          <UIcon name="ph:x" class="size-3.5" />
          Clear filters
        </button>
      </div>
    </div>
  </div>
</template>
