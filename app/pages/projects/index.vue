<script setup lang="ts">
import { projects, type Project, type ProjectStatus } from '~/shared/projects'

definePageMeta({ layout: 'default', title: 'Projects' })

const openDd = ref('')
const statusFilter = ref<ProjectStatus | 'all'>('all')
const priorityFilter = ref<string>('all')
const sortBy = ref<'name' | 'status' | 'progress'>('name')
const viewMode = ref<'card' | 'list'>('card')

function toggleDd(e: Event, id: string) {
  e.stopPropagation()
  openDd.value = openDd.value === id ? '' : id
}
function closeDd() { openDd.value = '' }
onMounted(() => document.addEventListener('click', closeDd))
onUnmounted(() => document.removeEventListener('click', closeDd))

const statusOptions = [
  { label: 'All Statuses', value: 'all',          dot: '' },
  { label: 'On Track',     value: 'on-track',      dot: '#22C55E' },
  { label: 'At Risk',      value: 'at-risk',        dot: '#F59E0B' },
  { label: 'Delayed',      value: 'delayed',        dot: '#EF4444' },
  { label: 'Not Started',  value: 'not-started',    dot: '#9CA3AF' },
]

const priorityOptions = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High',           value: 'high' },
  { label: 'Medium',         value: 'medium' },
  { label: 'Low',            value: 'low' },
]

const sortOptions = [
  { label: 'Name',     value: 'name' },
  { label: 'Status',   value: 'status' },
  { label: 'Progress', value: 'progress' },
]

const selectedStatusLabel = computed(() =>
  statusOptions.find(o => o.value === statusFilter.value)?.label ?? 'Status'
)
const selectedPriorityLabel = computed(() =>
  priorityOptions.find(o => o.value === priorityFilter.value)?.label ?? 'Priority'
)
const selectedSortLabel = computed(() =>
  sortOptions.find(o => o.value === sortBy.value)?.label ?? 'Name'
)

const filteredProjects = computed<Project[]>(() => {
  let list = [...projects]
  if (statusFilter.value !== 'all') list = list.filter(p => p.status === statusFilter.value)
  if (priorityFilter.value !== 'all') list = list.filter(p => p.priority === priorityFilter.value)
  list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'status') return a.status.localeCompare(b.status)
    if (sortBy.value === 'progress') return b.progress - a.progress
    return 0
  })
  return list
})

function progressFillClass(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    'on-track': 'pfill-green', 'at-risk': 'pfill-amber', delayed: 'pfill-red', 'not-started': 'pfill-gray',
  }
  return map[status]
}

function priorityTagClass(priority: string) {
  return { high: 'high', medium: 'medium', low: 'low' }[priority] ?? ''
}

function statusPillClass(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    'on-track': 'goal-status-pill on-track', 'at-risk': 'goal-status-pill at-risk',
    delayed: 'goal-status-pill delayed', 'not-started': 'goal-status-pill not-started',
  }
  return map[status]
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="page-toolbar">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <!-- Status -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'status')">
          <button class="df-btn" :class="{ 'has-filter': statusFilter !== 'all' }">
            <span>{{ selectedStatusLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'status' }">
            <div
              v-for="opt in statusOptions" :key="opt.value"
              class="df-item" :class="{ 'active-item': statusFilter === opt.value }"
              @click="statusFilter = opt.value as any; openDd = ''"
            >
              <span v-if="opt.dot" class="df-dot" :style="{ background: opt.dot }" />
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- Priority -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'priority')">
          <button class="df-btn" :class="{ 'has-filter': priorityFilter !== 'all' }">
            <span>{{ selectedPriorityLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'priority' }">
            <div
              v-for="opt in priorityOptions" :key="opt.value"
              class="df-item" :class="{ 'active-item': priorityFilter === opt.value }"
              @click="priorityFilter = opt.value; openDd = ''"
            >
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- Sort -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'sort')">
          <button class="df-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
            <span>{{ selectedSortLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'sort' }">
            <div
              v-for="opt in sortOptions" :key="opt.value"
              class="df-item" :class="{ 'active-item': sortBy === opt.value }"
              @click="sortBy = opt.value as any; openDd = ''"
            >
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;">
        <div class="proj-view-switcher">
          <button class="proj-view-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
            Cards
          </button>
          <button class="proj-view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>
            List
          </button>
        </div>
        <NuxtLink to="/projects/new" class="btn-new-proj">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </NuxtLink>
      </div>
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'card'" class="proj-card-grid" style="overflow-y:auto;">
      <NuxtLink
        v-for="project in filteredProjects" :key="project.id"
        :to="`/projects/${project.id}`"
        class="proj-card"
      >
        <div class="proj-card-header">
          <span class="proj-priority-tag" :class="priorityTagClass(project.priority)">
            <svg class="proj-flag" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v10H4z" opacity=".2"/><path d="M4 4l16 5-16 5V4z"/><line x1="4" y1="22" x2="4" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ project.priority.charAt(0).toUpperCase() + project.priority.slice(1) }}
          </span>
          <button class="proj-card-more" @click.prevent>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>

        <div class="proj-card-title">{{ project.name }}</div>
        <div class="proj-card-cat">
          <span style="font-family:monospace;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:.03em;margin-right:4px;">{{ project.key }}</span>
          {{ project.description }}
        </div>

        <div class="proj-prog-section">
          <div class="proj-prog-row">
            <span class="proj-prog-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Progress
            </span>
            <span class="proj-task-count">{{ project.openTasks }} tasks</span>
          </div>
          <div class="proj-prog-bar">
            <div class="proj-prog-fill" :class="progressFillClass(project.status)" :style="{ width: `${project.progress}%` }" />
          </div>
        </div>

        <div class="proj-due" :class="{ overdue: project.status === 'delayed' }">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {{ new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </div>

        <div class="proj-card-footer">
          <div class="proj-card-meta">
            <span v-if="project.atRiskTasks > 0" class="proj-meta-item" style="color:#D97706;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              {{ project.atRiskTasks }} at risk
            </span>
          </div>
          <div class="av-stack">
            <img
              v-for="(a, i) in project.assignees.slice(0, 3)" :key="a.name"
              class="av-circle"
              :src="a.avatar"
              :alt="a.name"
              :title="a.name"
            >
            <span v-if="project.assignees.length > 3" class="av-circle" style="background:#E5E7EB;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#6B7280;">
              +{{ project.assignees.length - 3 }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- List View -->
    <div v-else style="flex:1;overflow-y:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr>
            <th class="list-th">Project</th>
            <th class="list-th" style="width:110px">Status</th>
            <th class="list-th" style="width:90px">Priority</th>
            <th class="list-th" style="width:150px">Progress</th>
            <th class="list-th" style="width:80px">Tasks</th>
            <th class="list-th" style="width:110px">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in filteredProjects" :key="project.id"
            class="list-tr"
            @click="navigateTo(`/projects/${project.id}`)"
          >
            <td class="list-td">
              <div style="display:flex;align-items:center;gap:7px;">
                <span style="font-family:monospace;font-size:10px;font-weight:700;color:#9CA3AF;letter-spacing:.03em;background:#F3F4F6;padding:2px 5px;border-radius:4px;">{{ project.key }}</span>
                <span style="font-weight:600;color:#111827;">{{ project.name }}</span>
              </div>
            </td>
            <td class="list-td"><span :class="statusPillClass(project.status)">{{ project.statusLabel }}</span></td>
            <td class="list-td">
              <span class="proj-priority-tag" :class="priorityTagClass(project.priority)">
                {{ project.priority.charAt(0).toUpperCase() + project.priority.slice(1) }}
              </span>
            </td>
            <td class="list-td">
              <div style="display:flex;align-items:center;gap:8px;">
                <div class="proj-prog-bar" style="flex:1;">
                  <div class="proj-prog-fill" :class="progressFillClass(project.status)" :style="{ width: `${project.progress}%` }" />
                </div>
                <span style="font-size:12px;color:#6B7280;min-width:30px;text-align:right;">{{ project.progress }}%</span>
              </div>
            </td>
            <td class="list-td" style="color:#6B7280;">{{ project.openTasks }}</td>
            <td class="list-td" style="color:#9CA3AF;font-size:12px;">
              {{ new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </td>
          </tr>
          <tr v-if="filteredProjects.length === 0">
            <td colspan="6" style="padding:40px;text-align:center;color:#9CA3AF;font-size:14px;">No projects match the selected filters.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
