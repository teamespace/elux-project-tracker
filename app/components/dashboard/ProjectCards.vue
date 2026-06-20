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

// Per-row action menu
const openMenuId = ref<string | null>(null)

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
    return statusMatch && priorityMatch
  })
})

const statusClass = (status: string) => ({
  'on-track': 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
  'at-risk': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
  'delayed': 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  'not-started': 'bg-[#F8FAFC] text-gray-500 border-gray-200',
}[status] || '')

const progressColorForStatus = (status: string) => {
  if (status === 'at-risk' || status === 'delayed') return '#EF4444'
  if (status === 'on-track') return '#10B981'
  if (status === 'not-started') return '#9CA3AF'
  return progressColor(50)
}

function overdueClass(p: Project): string {
  if (p.status === 'at-risk' || p.status === 'delayed') return 'overdue'
  return ''
}

function avatarColorForInitials(initials: string): string {
  // Map initials to one of the avatar color palette
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6']
  let hash = 0
  for (let i = 0; i < initials.length; i++) hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]!
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white overflow-hidden">
    <!-- Panel Header -->
    <div class="panel-header" style="position:relative">
      <div class="panel-title">
        Projects
        <span class="panel-count">{{ filteredProjects.length }}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="relative">
          <button
            class="filter-btn"
            :class="{ active: filterOpen }"
            @click="filterOpen = !filterOpen"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
            Filter
          </button>
          <div
            v-if="filterOpen"
            class="filter-dropdown open"
          >
            <div class="filter-group">
              <p class="filter-group-label">Status</p>
              <div class="filter-chips">
                <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  class="filter-chip"
                  :class="{ on: selectedStatuses.includes(option.value) }"
                  @click="toggleStatus(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            <div class="filter-group">
              <p class="filter-group-label">Priority</p>
              <div class="filter-chips">
                <button
                  v-for="option in priorityOptions"
                  :key="option.value"
                  class="filter-chip"
                  :class="{ on: selectedPriorities.includes(option.value) }"
                  @click="togglePriority(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
            <div class="filter-actions">
              <button class="filter-clear" @click="clearFilters">Clear all</button>
              <button class="filter-apply" @click="applyFilters">Apply</button>
            </div>
          </div>
        </div>

        <NuxtLink to="/projects" class="link-sm">View all</NuxtLink>
      </div>
    </div>

    <!-- Table -->
    <table class="proj-table">
      <thead>
        <tr>
          <th class="col-check"><input type="checkbox"></th>
          <th>Project Name</th>
          <th>Status</th>
          <th>Progress</th>
          <th>Deadline</th>
          <th>People</th>
          <th>Priority</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in filteredProjects"
          :key="p.id"
          @click="projectSlideOver.openView(p.id)"
        >
          <td class="col-check" @click.stop>
            <input type="checkbox">
          </td>
          <td class="col-name">{{ p.name }}</td>
          <td>
            <span :class="['status-pill', statusClass(p.status)]">{{ p.statusLabel }}</span>
          </td>
          <td>
            <div class="tbl-prog">
              <div class="tbl-prog-track">
                <div class="tbl-prog-fill" :style="{ width: p.progress + '%', background: progressColorForStatus(p.status) }"></div>
              </div>
              <div class="tbl-prog-label">{{ p.progress }}%</div>
            </div>
          </td>
          <td :class="['col-deadline', overdueClass(p)]">{{ p.dueDate }}</td>
          <td class="col-people">
            <div class="avatar-stack">
              <template v-for="(a, i) in p.assignees.slice(0, 3)" :key="i">
                <img
                  v-if="a.avatar"
                  :src="a.avatar"
                  :alt="a.name"
                  class="avatar-sm"
                  :style="{ background: avatarColorForInitials(a.initials) }"
                >
                <div
                  v-else
                  class="avatar-sm"
                  :style="{ background: avatarColorForInitials(a.initials) }"
                >{{ a.initials }}</div>
              </template>
              <div v-if="p.assignees.length > 3" class="avatar-overflow">+{{ p.assignees.length - 3 }}</div>
            </div>
          </td>
          <td>
            <span :class="['priority-pill', p.priority]">{{ p.priorityLabel }}</span>
          </td>
          <td class="col-more" @click.stop>
            <button class="proj-more-btn" @click="toggleMenu(p.id, $event)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
