<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

interface Task {
  id: string
  title: string
  description: string
}

interface ResultItem {
  id: string
  category: 'Tasks' | 'Projects' | 'People'
  icon: string
  label: string
  subtitle?: string
}

const { isOpen, close } = useSearchModal()

const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

// Mirror of the dummy tasks used on the board page.
const dummyTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Login page redesign',
    description: 'Redesign the login page to align with the new brand identity and improve conversion.',
  },
  {
    id: 'task-2',
    title: 'Signup form validation',
    description: 'Add client-side and server-side validation rules to the signup form.',
  },
  {
    id: 'task-3',
    title: 'Email verification flow',
    description: 'Implement the end-to-end email verification flow with resend capabilities.',
  },
  {
    id: 'task-4',
    title: 'Password reset UX',
    description: 'Simplify the password reset experience and clarify error messaging.',
  },
  {
    id: 'task-5',
    title: 'Profile editing UI',
    description: 'Design and build the profile editing interface with avatar upload and field validation.',
  },
  {
    id: 'task-6',
    title: 'Notification settings',
    description: 'Create the notification preferences page for email and in-app alerts.',
  },
  {
    id: 'task-7',
    title: 'Account deletion flow',
    description: 'Build a secure account deletion flow with confirmation steps and data retention notices.',
  },
  {
    id: 'task-8',
    title: 'Endpoint reference docs',
    description: 'Publish the complete API endpoint reference with request and response examples.',
  },
  {
    id: 'task-9',
    title: 'Auth guide & examples',
    description: 'Write the authentication integration guide with code samples in multiple languages.',
  },
  {
    id: 'task-10',
    title: 'SDK quickstart',
    description: 'Create a quickstart guide for installing and using the official SDK.',
  },
  {
    id: 'task-11',
    title: 'Sidebar nav refinement',
    description: 'Refine the sidebar navigation with collapsible sections and keyboard shortcuts.',
  },
  {
    id: 'task-12',
    title: 'KPI chart component',
    description: 'Build a reusable KPI chart component for dashboards and reports.',
  },
]

const projects: ResultItem[] = [
  { id: 'project-auth', category: 'Projects', icon: 'ph:folder', label: 'Auth', subtitle: 'Authentication & identity' },
  { id: 'project-settings', category: 'Projects', icon: 'ph:folder', label: 'Settings', subtitle: 'Preferences & account' },
  { id: 'project-api', category: 'Projects', icon: 'ph:folder', label: 'API', subtitle: 'Developer platform' },
  { id: 'project-core', category: 'Projects', icon: 'ph:folder', label: 'Core', subtitle: 'Foundation & navigation' },
]

const people: ResultItem[] = [
  { id: 'person-rasya', category: 'People', icon: 'ph:user', label: 'Rasya', subtitle: 'Team member' },
  { id: 'person-dito', category: 'People', icon: 'ph:user', label: 'Dito', subtitle: 'Team member' },
  { id: 'person-maya', category: 'People', icon: 'ph:user', label: 'Maya', subtitle: 'Team member' },
  { id: 'person-rara', category: 'People', icon: 'ph:user', label: 'Rara', subtitle: 'Team member' },
]

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredTasks = computed<ResultItem[]>(() => {
  const q = normalizedQuery.value
  return dummyTasks
    .filter(
      task =>
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q),
    )
    .map(task => ({
      id: task.id,
      category: 'Tasks' as const,
      icon: 'ph:check-square',
      label: task.title,
      subtitle: task.description,
    }))
})

const filteredProjects = computed(() =>
  projects.filter(
    p =>
      !normalizedQuery.value ||
      p.label.toLowerCase().includes(normalizedQuery.value) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(normalizedQuery.value)),
  ),
)

const filteredPeople = computed(() =>
  people.filter(
    p =>
      !normalizedQuery.value ||
      p.label.toLowerCase().includes(normalizedQuery.value) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(normalizedQuery.value)),
  ),
)

const groupedResults = computed(() => [
  { category: 'Tasks' as const, items: filteredTasks.value },
  { category: 'Projects' as const, items: filteredProjects.value },
  { category: 'People' as const, items: filteredPeople.value },
])

const flatResults = computed<ResultItem[]>(() =>
  groupedResults.value.flatMap(section => section.items),
)

watch(query, () => {
  selectedIndex.value = 0
})

watch(isOpen, open => {
  if (open) {
    query.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

function moveSelection(delta: number) {
  const total = flatResults.value.length
  if (!total) return
  selectedIndex.value = (selectedIndex.value + delta + total) % total
}

function selectItem(item: ResultItem) {
  console.log('Selected search result:', item)
}

function selectCurrent() {
  const item = flatResults.value[selectedIndex.value]
  if (item) selectItem(item)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveSelection(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveSelection(-1)
  } else if (event.key === 'Enter') {
    // Let a focused result button trigger its own click handler.
    if ((event.target as HTMLElement)?.tagName === 'BUTTON') return
    event.preventDefault()
    selectCurrent()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function resultIndex(sectionCategory: string, localIndex: number) {
  const sectionIndex = groupedResults.value.findIndex(s => s.category === sectionCategory)
  return (
    groupedResults.value
      .slice(0, sectionIndex)
      .reduce((acc, s) => acc + s.items.length, 0) + localIndex
  )
}

function isSelected(globalIndex: number) {
  return globalIndex === selectedIndex.value
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-[10vh]"
    role="dialog"
    aria-modal="true"
    @click.self="close"
    @keydown="onKeydown"
  >
    <div class="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
      <!-- Search input -->
      <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <UIcon name="ph:magnifying-glass" class="size-5 text-gray-400" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Search tasks, projects, people..."
          class="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
        >
      </div>

      <!-- Results -->
      <div class="max-h-[60vh] overflow-y-auto py-2">
        <template v-if="flatResults.length">
          <div
            v-for="section in groupedResults"
            :key="section.category"
          >
            <div
              v-if="section.items.length"
              class="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {{ section.category }}
            </div>
            <button
              v-for="(item, localIndex) in section.items"
              :key="item.id"
              type="button"
              class="group flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors"
              :class="isSelected(resultIndex(section.category, localIndex)) ? 'bg-gray-100' : 'hover:bg-gray-50'"
              @click="selectItem(item)"
              @mouseenter="selectedIndex = resultIndex(section.category, localIndex)"
            >
              <span
                class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600 group-hover:bg-white"
                :class="isSelected(resultIndex(section.category, localIndex)) ? 'bg-white' : ''"
              >
                <UIcon :name="item.icon" class="size-4" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-gray-900">
                  {{ item.label }}
                </div>
                <div
                  v-if="item.subtitle"
                  class="line-clamp-1 text-xs text-gray-500"
                >
                  {{ item.subtitle }}
                </div>
              </div>
            </button>
          </div>
        </template>

        <!-- Empty state -->
        <div
          v-else
          class="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center"
        >
          <UIcon name="ph:magnifying-glass" class="size-8 text-gray-300" />
          <p class="text-sm text-gray-500">
            No results for "<span class="font-medium text-gray-900">{{ query }}</span>"
          </p>
          <p class="text-xs text-gray-400">
            Try a different keyword or check your spelling.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <span>↑↓ to navigate, ↵ to select, esc to close</span>
      </div>
    </div>
  </div>
</template>
