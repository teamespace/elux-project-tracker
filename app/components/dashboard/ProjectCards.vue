// styled: agent-5
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

const filterOpen = ref(false)
const search = ref('')

// Per-row action menu
const openMenuId = ref<string | null>(null)
const _menuRefs = ref<Record<string, HTMLElement | null>>({})

function toggleMenu(id: string, event: Event) {
  event.stopPropagation()
  if (openMenuId.value === id) {
    openMenuId.value = null
  }
  else {
    openMenuId.value = id
  }
}

function closeMenu() {
  openMenuId.value = null
}

function navigateToProject(id: string) {
  closeMenu()
  projectSlideOver.openView(id)
}

function navigateToAllProjects() {
  closeMenu()
  navigateTo('/projects')
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})

const statusOptions = [
  { label: 'On Track', value: 'on-track' },
  { label: 'At Risk', value: 'at-risk' },
  { label: 'Not Started', value: 'not-started' },
]

const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const selectedStatuses = ref<string[]>(statusOptions.map(s => s.value))
const selectedPriorities = ref<string[]>(priorityOptions.map(p => p.value))

const toggleStatus = (value: string) => {
  const index = selectedStatuses.value.indexOf(value)
  if (index === -1) selectedStatuses.value.push(value)
  else selectedStatuses.value.splice(index, 1)
}

const togglePriority = (value: string) => {
  const index = selectedPriorities.value.indexOf(value)
  if (index === -1) selectedPriorities.value.push(value)
  else selectedPriorities.value.splice(index, 1)
}

const clearFilters = () => {
  selectedStatuses.value = []
  selectedPriorities.value = []
}

const applyFilters = () => {
  filterOpen.value = false
}

const filteredProjects = computed(() => {
  return props.projects.filter((project) => {
    const statusMatch = selectedStatuses.value.length === 0 || selectedStatuses.value.includes(project.status)
    const priorityMatch = selectedPriorities.value.length === 0 || selectedPriorities.value.includes(project.priority)
    const searchMatch = !search.value || project.name.toLowerCase().includes(search.value.toLowerCase())
    return statusMatch && priorityMatch && searchMatch
  })
})

const statusClass = (status: string) => ({
  'on-track': 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
  'at-risk': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'delayed': 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  'not-started': 'bg-[#F8FAFC] text-gray-500 border-gray-200',
}[status] || '')

const statusDotClass = (status: string) => ({
  'on-track': 'bg-green-500 rounded-[2px]',
  'at-risk': 'bg-amber-500 rounded-[2px]',
  'delayed': 'bg-red-500 rounded-[2px]',
  'not-started': 'bg-gray-400 rounded-full',
}[status] || 'bg-gray-400 rounded-full')

const priorityClass = (priority: string) => ({
  high: 'bg-[#FEE2E2] text-[#B91C1C]',
  medium: 'bg-[#FEF3C7] text-[#92400E]',
  low: 'bg-[#D1FAE5] text-[#065F46]',
}[priority] || 'bg-gray-100 text-gray-600')

const deadlineClass = (status: string) =>
  status === 'at-risk' || status === 'delayed' ? 'text-red-500 font-medium' : 'text-gray-500'

const progressColorForStatus = (status: string) => {
  if (status === 'at-risk' || status === 'delayed') return 'bg-red-500'
  if (status === 'on-track') return 'bg-green-500'
  if (status === 'not-started') return 'bg-gray-400'
  return progressColor(50)
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white overflow-hidden">
    <!-- Toolbar -->
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
      <div class="flex items-center gap-2">
        <h2 class="text-[13px] font-semibold text-gray-900">
          Projects
        </h2>
        <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">{{ filteredProjects.length }}</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative hidden sm:block">
          <UIcon name="ph:magnifying-glass" class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search"
            class="h-7 w-36 rounded-md border border-gray-200 bg-gray-50 pl-8 pr-2 text-[12px] text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          >
        </div>

        <div class="relative">
          <button
            class="inline-flex h-7 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
            :class="{ 'bg-blue-50 border-blue-200 text-blue-600': filterOpen }"
            @click="filterOpen = !filterOpen"
          >
            <UIcon name="ph:faders" class="size-3.5" />
            Filter
          </button>
          <div
            v-if="filterOpen"
            class="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[220px] rounded-[10px] border border-gray-200 bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
          >
            <div class="mb-3">
              <p class="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  class="rounded-[20px] border px-2.5 py-0.5 text-[11.5px] transition-colors"
                  :class="selectedStatuses.includes(option.value) ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600'"
                  @click="toggleStatus(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            <div>
              <p class="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-gray-400">Priority</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="option in priorityOptions"
                  :key="option.value"
                  class="rounded-[20px] border px-2.5 py-0.5 text-[11.5px] transition-colors"
                  :class="selectedPriorities.includes(option.value) ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600'"
                  @click="togglePriority(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            <div class="mt-3 flex justify-end gap-1.5 border-t border-gray-100 pt-2.5">
              <button class="px-2 py-1 text-[12px] text-gray-500 transition-colors hover:text-gray-700" @click="clearFilters">
                Clear all
              </button>
              <button class="rounded-md bg-blue-600 px-3 py-1 text-[12px] font-medium text-white transition-colors hover:bg-blue-700" @click="applyFilters">
                Apply
              </button>
            </div>
          </div>
        </div>

        <NuxtLink to="/projects" class="text-[12px] text-gray-400 transition-colors hover:text-gray-700">
          View all
        </NuxtLink>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <th class="w-8 py-2 pl-3">
            <input type="checkbox" class="size-3.5 rounded border-gray-300 text-blue-600 accent-blue-600">
          </th>
          <th class="px-3 py-2 min-w-[160px]">Project Name</th>
          <th class="px-3 py-2 w-[100px]">Status</th>
          <th class="px-3 py-2 w-[120px]">Progress</th>
          <th class="px-3 py-2 w-[110px]">Deadline</th>
          <th class="px-3 py-2 w-[80px]">People</th>
          <th class="px-3 py-2 w-[80px]">Priority</th>
          <th class="w-8 px-3 py-2" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in filteredProjects"
          :key="project.id"
          class="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
          @click="projectSlideOver.openView(project.id)"
        >
          <td class="py-2 pl-3 pr-3" @click.stop>
            <input type="checkbox" class="size-3.5 rounded border-gray-300 text-blue-600 accent-blue-600">
          </td>
          <td class="py-2 px-3">
            <span class="text-[13px] font-medium text-gray-900">{{ project.name }}</span>
          </td>
          <td class="py-2 px-3">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap"
              :class="statusClass(project.status)"
            >
              <span class="size-[7px] rounded-full" :class="statusDotClass(project.status)" />
              {{ project.statusLabel }}
            </span>
          </td>
          <td class="py-2 px-3">
            <div class="flex items-center gap-2">
              <div class="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="progressColorForStatus(project.status)"
                  :style="{ width: project.progress + '%' }"
                />
              </div>
              <span class="text-[11px] font-medium text-gray-500">{{ project.progress }}%</span>
            </div>
          </td>
          <td class="py-2 px-3">
            <span class="text-[12px] whitespace-nowrap" :class="deadlineClass(project.status)">
              {{ project.dueDate }}
            </span>
          </td>
          <td class="py-2 px-3">
            <div class="flex items-center">
              <img
                v-for="(a, i) in project.assignees.slice(0, 3)"
                :key="i"
                :src="a.avatar"
                :alt="a.name"
                class="size-7 rounded-full border-2 border-white object-cover first:ml-0 -ml-1.5"
              >
              <div
                v-if="project.assignees.length > 3"
                class="flex size-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[8px] font-bold text-gray-600 -ml-1.5"
              >
                +{{ project.assignees.length - 3 }}
              </div>
            </div>
          </td>
          <td class="py-2 px-3">
            <span
              class="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold"
              :class="priorityClass(project.priority)"
            >
              {{ project.priorityLabel }}
            </span>
          </td>
          <td class="py-2 px-3 text-center" @click.stop>
            <div class="relative">
              <button
                class="inline-flex items-center justify-center rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                @click="toggleMenu(project.id, $event)"
              >
                <UIcon name="ph:dots-three-vertical" class="size-4" />
              </button>

              <!-- Action Menu -->
              <div
                v-if="openMenuId === project.id"
                ref="el => { _menuRefs[project.id] = el as HTMLElement | null }"
                class="absolute right-0 top-full z-30 mt-1 min-w-[180px] rounded-[10px] border border-gray-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] text-gray-700 transition-colors hover:bg-gray-50"
                  @click="navigateToProject(project.id)"
                >
                  <UIcon name="ph:eye" class="size-4 text-gray-400" />
                  View details
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] text-gray-700 transition-colors hover:bg-gray-50"
                  @click="navigateToAllProjects"
                >
                  <UIcon name="ph:link" class="size-4 text-gray-400" />
                  Open in Projects
                </button>
                <button
                  class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] text-red-600 transition-colors hover:bg-red-50"
                >
                  <UIcon name="ph:trash" class="size-4 text-red-500" />
                  Delete project
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
