<script setup lang="ts">
import type { Task } from '~/shared/board'

const props = defineProps<{
  tasks: Task[]
}>()

const slideOver = useTaskSlideOver()

const onTaskClick = (task: Task) => {
  slideOver.openEdit(task.id)
}

const currentMonth = ref(new Date(2026, 6, 1)) // July 2026
const MAX_VISIBLE_TASKS = 3

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

function toLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const tasksByDate = computed(() => {
  const map = new Map<string, Task[]>()
  for (const task of props.tasks) {
    const list = map.get(task.dueDate) ?? []
    list.push(task)
    map.set(task.dueDate, list)
  }
  return map
})

interface CalendarDay {
  date: Date
  inCurrentMonth: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay() // 0 = Sunday

  const days: CalendarDay[] = []

  // Previous month filler days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      inCurrentMonth: false,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    })
  }

  // Next month filler days to complete the last week
  const remainingCells = 42 - days.length // always show 6 weeks
  for (let day = 1; day <= remainingCells; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      inCurrentMonth: false,
    })
  }

  return days
})

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
  )
}

function statusDotColor(status: Task['status']): string {
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

function previousMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}
</script>

<template>
  <BoardEmptyState v-if="props.tasks.length === 0" />
  <div v-else class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ monthLabel }}
      </h2>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          @click="previousMonth"
        >
          Previous
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          @click="nextMonth"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-px mb-2">
      <div
        v-for="day in WEEKDAYS"
        :key="day"
        class="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px border border-gray-200 rounded-md overflow-hidden">
      <div
        v-for="(calendarDay, index) in calendarDays"
        :key="index"
        class="min-h-[120px] p-2 bg-white hover:bg-gray-50 transition-colors"
        :class="{ 'bg-gray-50/50': !calendarDay.inCurrentMonth }"
      >
        <div class="flex items-center justify-between mb-1">
          <span
            class="text-sm font-medium"
            :class="[
              calendarDay.inCurrentMonth ? 'text-gray-900' : 'text-gray-400',
              isToday(calendarDay.date)
                ? 'inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white'
                : '',
            ]"
          >
            {{ calendarDay.date.getDate() }}
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <template v-if="tasksByDate.has(toLocalISODate(calendarDay.date))">
            <div
              v-for="task in (tasksByDate.get(toLocalISODate(calendarDay.date)) ?? []).slice(0, MAX_VISIBLE_TASKS)"
              :key="task.id"
              class="flex cursor-pointer items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200 truncate hover:bg-gray-200"
              :title="task.title"
              @click="onTaskClick(task)"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="statusDotColor(task.status)"
              />
              <span class="truncate">{{ task.title }}</span>
            </div>

            <div
              v-if="(tasksByDate.get(toLocalISODate(calendarDay.date)) ?? []).length > MAX_VISIBLE_TASKS"
              class="px-2 py-0.5 text-xs font-medium text-gray-500"
            >
              +{{ (tasksByDate.get(toLocalISODate(calendarDay.date)) ?? []).length - MAX_VISIBLE_TASKS }} more
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
