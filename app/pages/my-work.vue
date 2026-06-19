<script setup lang="ts">
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'My Work',
})

type Tab = 'my-work' | 'my-day'
type TaskStatus = 'overdue' | 'in-progress' | 'todo' | 'in-review' | 'done'
type Priority = 'high' | 'medium' | 'low'
type DueDateFilter = 'all' | 'overdue' | 'this-week' | 'next-week' | 'later'
type StatusFilter = 'all' | TaskStatus
type PriorityFilter = 'all' | Priority
type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

interface Assignee {
  initials: string
  name: string
  avatar?: string
}

interface Task {
  id: string
  title: string
  epicBadge: string
  projectName: string
  priority: Priority
  priorityLabel: string
  status: TaskStatus
  statusLabel: string
  assignee: Assignee
  dueDate: string
  overdue: boolean
  labels: string[]
}

interface Section {
  label: string
  icon: string
  collapsed: boolean
  tasks: Task[]
}

interface StatCard {
  label: string
  value: number
  icon: string
  accent: string
}

interface MyDayTask {
  id: string
  title: string
  priority: Priority
  priorityLabel: string
  dueDate: string
}

interface CompletedTask {
  id: string
  title: string
}

interface FilterChip {
  key: string
  label: string
}

const activeTab = ref<Tab>('my-work')

const sections = ref<Section[]>([
  {
    label: 'Overdue',
    icon: 'ph:warning-circle',
    collapsed: false,
    tasks: [
      {
        id: 'task-13',
        title: 'API rate limit spec',
        epicBadge: 'API',
        projectName: 'API',
        priority: 'high',
        priorityLabel: 'High',
        status: 'overdue',
        statusLabel: 'OVERDUE',
        assignee: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
        dueDate: 'Jul 8',
        overdue: true,
        labels: ['Backend', 'Docs'],
      },
    ],
  },
  {
    label: 'In Progress',
    icon: 'ph:arrow-circle-right',
    collapsed: false,
    tasks: [
      {
        id: 'task-2',
        title: 'Signup form validation',
        epicBadge: 'Auth',
        projectName: 'Auth',
        priority: 'high',
        priorityLabel: 'High',
        status: 'in-progress',
        statusLabel: 'IN PROGRESS',
        assignee: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' },
        dueDate: 'Jul 15',
        overdue: false,
        labels: ['Frontend', 'Auth'],
      },
      {
        id: 'task-5',
        title: 'Profile editing UI',
        epicBadge: 'Settings',
        projectName: 'Settings',
        priority: 'medium',
        priorityLabel: 'Medium',
        status: 'in-progress',
        statusLabel: 'IN PROGRESS',
        assignee: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
        dueDate: 'Aug 5',
        overdue: false,
        labels: ['Frontend', 'Settings'],
      },
      {
        id: 'task-10',
        title: 'SDK quickstart',
        epicBadge: 'API',
        projectName: 'API',
        priority: 'low',
        priorityLabel: 'Low',
        status: 'in-progress',
        statusLabel: 'IN PROGRESS',
        assignee: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' },
        dueDate: 'Jul 18',
        overdue: false,
        labels: ['Docs', 'DX'],
      },
    ],
  },
  {
    label: 'TODO',
    icon: 'ph:circle',
    collapsed: false,
    tasks: [
      {
        id: 'task-7',
        title: 'Account deletion flow',
        epicBadge: 'Settings',
        projectName: 'Settings',
        priority: 'medium',
        priorityLabel: 'Medium',
        status: 'todo',
        statusLabel: 'TODO',
        assignee: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' },
        dueDate: 'Aug 20',
        overdue: false,
        labels: ['Frontend', 'Backend', 'Settings'],
      },
      {
        id: 'task-12',
        title: 'KPI chart component',
        epicBadge: 'Core',
        projectName: 'Core',
        priority: 'medium',
        priorityLabel: 'Medium',
        status: 'todo',
        statusLabel: 'TODO',
        assignee: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' },
        dueDate: 'Aug 25',
        overdue: false,
        labels: ['Frontend', 'Core'],
      },
      {
        id: 'task-6',
        title: 'Notification settings',
        epicBadge: 'Settings',
        projectName: 'Settings',
        priority: 'low',
        priorityLabel: 'Low',
        status: 'todo',
        statusLabel: 'TODO',
        assignee: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' },
        dueDate: 'Aug 15',
        overdue: false,
        labels: ['Frontend', 'Settings'],
      },
    ],
  },
  {
    label: 'In Review',
    icon: 'ph:eye',
    collapsed: false,
    tasks: [
      {
        id: 'task-1',
        title: 'Login page redesign',
        epicBadge: 'Auth',
        projectName: 'Auth',
        priority: 'high',
        priorityLabel: 'High',
        status: 'in-review',
        statusLabel: 'IN REVIEW',
        assignee: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
        dueDate: 'Jul 10',
        overdue: false,
        labels: ['Frontend', 'Auth'],
      },
    ],
  },
  {
    label: 'Done This Week',
    icon: 'ph:check-circle',
    collapsed: true,
    tasks: [
      {
        id: 'task-8',
        title: 'Endpoint reference docs',
        epicBadge: 'API',
        projectName: 'API',
        priority: 'high',
        priorityLabel: 'High',
        status: 'done',
        statusLabel: 'DONE',
        assignee: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' },
        dueDate: 'Jul 5',
        overdue: false,
        labels: ['Docs', 'API'],
      },
      {
        id: 'task-11',
        title: 'Sidebar nav refinement',
        epicBadge: 'Core',
        projectName: 'Core',
        priority: 'low',
        priorityLabel: 'Low',
        status: 'done',
        statusLabel: 'DONE',
        assignee: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
        dueDate: 'Jun 30',
        overdue: false,
        labels: ['Frontend', 'Core'],
      },
    ],
  },
])

const stats = computed<StatCard[]>(() => {
  const allTasks = sections.value.flatMap(s => s.tasks)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const inProgress = allTasks.filter(t => t.status === 'in-progress').length
  const dueThisWeek = allTasks.filter(t => {
    const d = parseDueDate(t.dueDate)
    return d && d >= startOfWeek && d <= endOfWeek
  }).length
  const overdue = allTasks.filter(t => t.overdue).length
  const completed = allTasks.filter(t => t.status === 'done').length

  return [
    { label: 'In Progress', value: inProgress, icon: 'ph:arrow-circle-right', accent: 'blue' },
    { label: 'Due This Week', value: dueThisWeek, icon: 'ph:calendar', accent: 'amber' },
    { label: 'Overdue', value: overdue, icon: 'ph:warning-circle', accent: 'red' },
    { label: 'Completed', value: completed, icon: 'ph:check-circle', accent: 'green' },
  ]
})

function parseDueDate(dateStr: string): Date | null {
  try {
    const currentYear = new Date().getFullYear()
    const parsed = new Date(`${dateStr} ${currentYear}`)
    return isNaN(parsed.getTime()) ? null : parsed
  }
  catch {
    return null
  }
}

function priorityDotColor(priority: Priority): string {
  const map: Record<Priority, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-green-500',
  }
  return map[priority]
}

function statusColor(status: TaskStatus): BadgeColor {
  const map: Record<TaskStatus, BadgeColor> = {
    todo: 'neutral',
    'in-progress': 'primary',
    'in-review': 'warning',
    done: 'success',
    overdue: 'error',
  }
  return map[status]
}

function priorityColor(priority: Priority): BadgeColor {
  const map: Record<Priority, BadgeColor> = {
    high: 'error',
    medium: 'warning',
    low: 'success',
  }
  return map[priority]
}

const slideOver = useTaskSlideOver()

function openTask(taskId: string) {
  slideOver.openEdit(taskId)
}

function deleteTask(taskId: string) {
  sections.value.forEach((section) => {
    const index = section.tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      section.tasks.splice(index, 1)
    }
  })
}

function markComplete(taskId: string) {
  const sourceSection = sections.value.find(s => s.tasks.some(t => t.id === taskId))
  if (!sourceSection) return

  const task = sourceSection.tasks.find(t => t.id === taskId)
  if (!task) return

  task.status = 'done'
  task.statusLabel = 'DONE'
  task.overdue = false

  if (sourceSection.label !== 'Done This Week') {
    const index = sourceSection.tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const [moved] = sourceSection.tasks.splice(index, 1)
      const doneSection = sections.value.find(s => s.label === 'Done This Week')
      if (moved && doneSection) {
        doneSection.tasks.push(moved)
      }
    }
  }
}

function taskActionItems(task: Task) {
  return [
    { label: 'Edit', icon: 'ph:pencil-simple', onSelect: () => openTask(task.id) },
    { label: 'Delete', icon: 'ph:trash', color: 'error' as const, onSelect: () => deleteTask(task.id) },
    { label: 'Open in board', icon: 'ph:kanban', to: '/board' },
    { label: 'Mark complete', icon: 'ph:check-circle', onSelect: () => markComplete(task.id) },
  ]
}

function statCardClasses(accent: string): string {
  const map: Record<string, string> = {
    blue: 'border-blue-200 bg-blue-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    red: 'border-red-200 bg-red-50/50',
    green: 'border-green-200 bg-green-50/50',
  }
  return map[accent] ?? 'border-gray-200 bg-white'
}

function statIconClasses(accent: string): string {
  const map: Record<string, string> = {
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    green: 'text-green-600',
  }
  return map[accent] ?? 'text-gray-600'
}

const collapsedSections = ref<Set<string>>(new Set(sections.value.filter(s => s.collapsed).map(s => s.label)))

function toggleSection(label: string) {
  if (collapsedSections.value.has(label)) {
    collapsedSections.value.delete(label)
  }
  else {
    collapsedSections.value.add(label)
  }
}

// Filters
const searchQuery = ref('')
const statusFilter = ref<StatusFilter>('all')
const priorityFilter = ref<PriorityFilter>('all')
const dueDateFilter = ref<DueDateFilter>('all')

const statusOptions: { value: StatusFilter, label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'todo', label: 'TODO' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

const priorityOptions: { value: PriorityFilter, label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const dueDateOptions: { value: DueDateFilter, label: string }[] = [
  { value: 'all', label: 'All Due Dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'this-week', label: 'This Week' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'later', label: 'Later' },
]

function isDueThisWeek(date: Date): boolean {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return date >= startOfWeek && date <= endOfWeek
}

function isDueNextWeek(date: Date): boolean {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfNextWeek = new Date(startOfWeek)
  startOfNextWeek.setDate(startOfWeek.getDate() + 7)
  const endOfNextWeek = new Date(startOfNextWeek)
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6)
  endOfNextWeek.setHours(23, 59, 59, 999)
  return date >= startOfNextWeek && date <= endOfNextWeek
}

function matchesDueDateFilter(task: Task): boolean {
  if (dueDateFilter.value === 'all') return true
  if (dueDateFilter.value === 'overdue') return task.overdue

  const date = parseDueDate(task.dueDate)
  if (!date) return false

  if (dueDateFilter.value === 'this-week') return isDueThisWeek(date)
  if (dueDateFilter.value === 'next-week') return isDueNextWeek(date)
  if (dueDateFilter.value === 'later') {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfNextWeek = new Date(startOfWeek)
    endOfNextWeek.setDate(startOfWeek.getDate() + 13)
    endOfNextWeek.setHours(23, 59, 59, 999)
    return date > endOfNextWeek
  }
  return true
}

const filteredSections = computed<Section[]>(() => {
  return sections.value.map(section => ({
    ...section,
    tasks: section.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value === 'all' || task.status === statusFilter.value
      const matchesPriority = priorityFilter.value === 'all' || task.priority === priorityFilter.value
      const matchesDue = matchesDueDateFilter(task)
      return matchesSearch && matchesStatus && matchesPriority && matchesDue
    }),
  }))
})

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || statusFilter.value !== 'all' || priorityFilter.value !== 'all' || dueDateFilter.value !== 'all'
})

const activeFilterChips = computed<FilterChip[]>(() => {
  const chips: FilterChip[] = []
  if (searchQuery.value) {
    chips.push({ key: 'search', label: `Search: "${searchQuery.value}"` })
  }
  if (statusFilter.value !== 'all') {
    const label = statusOptions.find(o => o.value === statusFilter.value)?.label ?? statusFilter.value
    chips.push({ key: 'status', label: `Status: ${label}` })
  }
  if (priorityFilter.value !== 'all') {
    const label = priorityOptions.find(o => o.value === priorityFilter.value)?.label ?? priorityFilter.value
    chips.push({ key: 'priority', label: `Priority: ${label}` })
  }
  if (dueDateFilter.value !== 'all') {
    const label = dueDateOptions.find(o => o.value === dueDateFilter.value)?.label ?? dueDateFilter.value
    chips.push({ key: 'due', label: `Due: ${label}` })
  }
  return chips
})

function removeFilterChip(key: string) {
  if (key === 'search') searchQuery.value = ''
  if (key === 'status') statusFilter.value = 'all'
  if (key === 'priority') priorityFilter.value = 'all'
  if (key === 'due') dueDateFilter.value = 'all'
}

function clearAllFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  dueDateFilter.value = 'all'
}

// My Day data
const todos = ref<MyDayTask[]>([
  { id: 'task-1', title: 'Login page redesign', priority: 'high', priorityLabel: 'HIGH', dueDate: 'Jul 10' },
  { id: 'task-12', title: 'KPI chart component', priority: 'medium', priorityLabel: 'MED', dueDate: 'Aug 25' },
  { id: 'task-7', title: 'Write component spec', priority: 'medium', priorityLabel: 'MED', dueDate: 'Jul 18' },
])

const overdues = ref<MyDayTask[]>([
  { id: 'task-13', title: 'API rate limit spec', priority: 'high', priorityLabel: 'HIGH', dueDate: 'Jul 8' },
])

const completedToday = ref<CompletedTask[]>([
  { id: 'task-11', title: 'Figma export review' },
  { id: 'task-14', title: 'Stand-up prep notes' },
])

const checkedTasks = ref<Set<string>>(new Set())

function toggleCheck(taskId: string) {
  if (checkedTasks.value.has(taskId)) {
    checkedTasks.value.delete(taskId)
  }
  else {
    checkedTasks.value.add(taskId)
  }
}
</script>

<template>
  <div>
    <!-- Tabs -->
    <div class="mt-2 flex border-b border-gray-200">
      <button
        v-for="tab in (['my-work', 'my-day'] as const)"
        :key="tab"
        type="button"
        class="relative px-4 pb-2.5 text-[13px] font-medium transition-colors"
        :class="activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
        @click="activeTab = tab"
      >
        {{ tab === 'my-work' ? 'My Work' : 'My Day' }}
        <div
          v-if="activeTab === tab"
          class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600"
        />
      </button>
    </div>

    <!-- My Work tab -->
    <div v-if="activeTab === 'my-work'" class="mt-4 space-y-4">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm"
          :class="statCardClasses(stat.accent)"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[24px] font-semibold tabular-nums text-gray-900">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-[13px] font-medium text-gray-500">
                {{ stat.label }}
              </p>
            </div>
            <UIcon :name="stat.icon" class="size-6" :class="statIconClasses(stat.accent)" />
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex flex-wrap items-center gap-3">
          <UInput
            v-model="searchQuery"
            icon="ph:magnifying-glass"
            placeholder="Search tasks..."
            size="sm"
            class="min-w-0 flex-1"
          />

          <USelect
            v-model="statusFilter"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            placeholder="Status"
            size="sm"
            class="w-44"
          />

          <USelect
            v-model="priorityFilter"
            :items="priorityOptions"
            value-key="value"
            label-key="label"
            placeholder="Priority"
            size="sm"
            class="w-44"
          />

          <USelect
            v-model="dueDateFilter"
            :items="dueDateOptions"
            value-key="value"
            label-key="label"
            placeholder="Due date"
            size="sm"
            class="w-44"
          />

          <UButton
            v-if="hasActiveFilters"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="ph:x"
            @click="clearAllFilters"
          >
            Clear all
          </UButton>
        </div>

        <!-- Active Filter Chips -->
        <div v-if="activeFilterChips.length > 0" class="mt-3 flex flex-wrap items-center gap-2">
          <UBadge
            v-for="chip in activeFilterChips"
            :key="chip.key"
            color="neutral"
            variant="subtle"
            size="sm"
            class="gap-1 pr-1"
          >
            {{ chip.label }}
            <UButton
              variant="link"
              color="neutral"
              size="xs"
              icon="ph:x"
              class="p-0"
              @click="removeFilterChip(chip.key)"
            />
          </UBadge>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="flex flex-col gap-6">
        <div v-for="section in filteredSections" :key="section.label">
          <button
            class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-100"
            @click="toggleSection(section.label)"
          >
            <UIcon
              :name="collapsedSections.has(section.label) ? 'ph:caret-right' : 'ph:caret-down'"
              class="size-4 text-gray-500"
            />
            <UIcon :name="section.icon" class="size-4 text-gray-500" />
            <span class="text-[13px] font-semibold uppercase tracking-wide text-gray-700">
              {{ section.label }}
            </span>
            <span class="text-[12px] text-gray-400 tabular-nums">({{ section.tasks.length }})</span>
          </button>

          <div v-if="!collapsedSections.has(section.label)" class="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[900px] border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Task</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Project</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Status</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Priority</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Due Date</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Assignee</th>
                    <th class="px-4 py-2 text-[12px] font-semibold text-gray-600">Labels</th>
                    <th class="px-4 py-2 text-right text-[12px] font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="section.tasks.length === 0">
                    <td colspan="8" class="px-4 py-6 text-center text-[13px] text-gray-500">
                      No tasks
                    </td>
                  </tr>
                  <tr
                    v-for="task in section.tasks"
                    :key="task.id"
                    class="group cursor-pointer bg-white transition-colors hover:bg-gray-50"
                    @click="openTask(task.id)"
                  >
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <div class="min-w-0">
                        <p class="truncate text-[13px] font-semibold text-gray-900">
                          {{ task.title }}
                        </p>
                        <p class="mt-0.5 text-[12px] text-gray-500">
                          {{ task.id }}
                        </p>
                      </div>
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <span class="inline-flex shrink-0 items-center rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                        {{ task.projectName }}
                      </span>
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <UBadge :label="task.statusLabel" :color="statusColor(task.status)" variant="outline" size="sm" />
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <UBadge :label="task.priorityLabel" :color="priorityColor(task.priority)" variant="outline" size="sm" />
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <span
                        class="text-[13px]"
                        :class="task.overdue ? 'font-medium text-red-600' : 'text-gray-700'"
                      >
                        {{ task.dueDate }}
                      </span>
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <div class="flex items-center gap-2">
                        <UAvatar
                          :src="task.assignee.avatar"
                          :text="task.assignee.initials"
                          size="xs"
                          :title="task.assignee.name"
                        />
                        <span class="truncate text-[13px] text-gray-700">
                          {{ task.assignee.name }}
                        </span>
                      </div>
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <div class="flex flex-wrap items-center gap-1">
                        <span
                          v-for="label in task.labels"
                          :key="label"
                          class="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                        >
                          {{ label }}
                        </span>
                      </div>
                    </td>
                    <td class="border-y border-gray-200 px-4 py-3 text-right first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg">
                      <UDropdownMenu :items="taskActionItems(task)">
                        <UButton variant="ghost" color="neutral" size="xs" icon="ph:dots-three" @click.stop />
                      </UDropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Day tab -->
    <div v-else class="mx-auto mt-4 max-w-[640px]">
      <!-- Greeting -->
      <h3 class="text-[20px] font-semibold text-gray-900">Good morning, Rasya.</h3>
      <p class="mt-1 text-[14px] text-gray-500">Here is what is on your plate today.</p>

      <!-- Today's Focus -->
      <div class="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="ph:sun" class="size-5 text-amber-500" />
            <p class="text-[13px] font-semibold uppercase tracking-wide text-gray-700">Today's Focus</p>
          </div>
          <span class="text-[12px] font-medium text-gray-400">{{ todos.length }}</span>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <button
            v-for="task in todos"
            :key="task.id"
            type="button"
            class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            @click="toggleCheck(task.id)"
          >
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
              :class="checkedTasks.has(task.id)
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 bg-white group-hover:border-gray-400'"
            >
              <UIcon v-if="checkedTasks.has(task.id)" name="ph:check" class="size-3.5" />
            </span>
            <span
              class="flex-1 text-[14px] font-medium"
              :class="checkedTasks.has(task.id) ? 'text-gray-500 line-through' : 'text-gray-900'"
            >
              {{ task.title }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-[12px] text-gray-500">
              <span class="size-1.5 rounded-full" :class="priorityDotColor(task.priority)" />
              {{ task.priorityLabel }}
            </span>
            <span class="w-12 text-right text-[12px] tabular-nums text-gray-500">{{ task.dueDate }}</span>
          </button>
        </div>
      </div>

      <!-- Overdue -->
      <div class="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex items-center gap-2">
          <UIcon name="ph:warning-circle" class="size-5 text-red-600" />
          <p class="text-[13px] font-semibold uppercase tracking-wide text-gray-700">Overdue</p>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <NuxtLink
            v-for="task in overdues"
            :key="task.id"
            :to="`/tasks/${task.id}`"
            class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
          >
            <span class="flex size-5 shrink-0 items-center justify-center rounded border-2 border-red-200 bg-red-50">
              <UIcon name="ph:warning" class="size-3.5 text-red-600" />
            </span>
            <span class="flex-1 text-[14px] font-medium text-gray-900">{{ task.title }}</span>
            <span class="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600">
              <span class="size-1.5 rounded-full bg-red-500" />
              {{ task.priorityLabel }}
            </span>
            <span class="w-12 text-right text-[12px] tabular-nums text-red-600">{{ task.dueDate }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Completed Today -->
      <div class="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex items-center gap-2">
          <UIcon name="ph:check-circle" class="size-5 text-green-600" />
          <p class="text-[13px] font-semibold uppercase tracking-wide text-gray-700">Completed Today</p>
          <span class="text-[12px] font-medium text-gray-400">({{ completedToday.length }})</span>
        </div>
        <div class="mt-3 flex flex-col gap-1">
          <div
            v-for="task in completedToday"
            :key="task.id"
            class="flex items-center gap-3 rounded-lg px-3 py-2"
          >
            <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-600">
              <UIcon name="ph:check" class="size-3.5 text-white" />
            </span>
            <span class="flex-1 text-[14px] font-medium text-gray-500 line-through">{{ task.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
