<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'My Task', middleware: 'auth' })
import {
  type DueFilter,
  type GroupId,
  type MyTask,
  currentUser,
  groups as rawGroups,
  statusClass,
  statusDotClass,
  priorityClass,
  progressColor,
  statusFromGroup,
} from '~/shared/my-tasks'

const activeStatCard = ref<GroupId | 'all'>('all')
const dueFilter = ref<DueFilter>('all')
const projectFilter = ref('')
const priorityFilter = ref('')
const statusFilter = ref('')
const viewMode = ref<'list' | 'table'>('list')
const openDd = ref('')
const tablePage = ref(1)
const pageSize = 10

const collapsedGroups = ref<Set<GroupId>>(new Set(['completed']))

function toggleGroup(id: GroupId) {
  if (collapsedGroups.value.has(id)) collapsedGroups.value.delete(id)
  else collapsedGroups.value.add(id)
}

function setStatCard(id: GroupId | 'all') {
  activeStatCard.value = activeStatCard.value === id ? 'all' : id
}

function toggleDd(e: Event, id: string) {
  e.stopPropagation()
  openDd.value = openDd.value === id ? '' : id
}
function closeDd() { openDd.value = '' }
onMounted(() => document.addEventListener('click', closeDd))
onUnmounted(() => document.removeEventListener('click', closeDd))

const dueOptions = [
  { label: 'Due date', value: 'all' },
  { label: 'Today',     value: 'today' },
  { label: 'This week', value: 'week' },
  { label: 'Overdue',   value: 'overdue' },
  { label: 'No date',   value: 'none' },
]
const projectOptions = [
  { label: 'Project',    value: '' },
  { label: 'Alpha Project',   value: 'Alpha Project' },
  { label: 'Beta Launch',     value: 'Beta Launch' },
  { label: 'Mobile App MVP',  value: 'Mobile App MVP' },
  { label: 'Design System v2', value: 'Design System v2' },
]
const priorityOptions = [
  { label: 'Priorities', value: '' },
  { label: 'High',   value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low',    value: 'low' },
]
const statusOptions = [
  { label: 'Status', value: '' },
  { label: 'To Do',       value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'In Review',   value: 'inreview' },
  { label: 'Overdue',     value: 'overdue' },
  { label: 'Completed',   value: 'completed' },
]

const selectedDueLabel = computed(() =>
  dueOptions.find(o => o.value === dueFilter.value)?.label ?? 'Due date'
)
const selectedProjectLabel = computed(() =>
  projectOptions.find(o => o.value === projectFilter.value)?.label ?? 'Project'
)
const selectedPriorityLabel = computed(() =>
  priorityOptions.find(o => o.value === priorityFilter.value)?.label ?? 'Priorities'
)
const selectedStatusLabel = computed(() =>
  statusOptions.find(o => o.value === statusFilter.value)?.label ?? 'Status'
)

const enrichedGroups = computed(() =>
  groups.value.map(g => ({
    ...g,
    statusInfo: { id: g.id === 'completed' ? 'done' : g.id === 'inprogress' || g.id === 'overdue' ? 'in-progress' : g.id === 'inreview' ? 'in-review' : 'todo', label: g.id === 'completed' ? 'Done' : g.id === 'inprogress' || g.id === 'overdue' ? 'In Progress' : g.id === 'inreview' ? 'In Review' : 'To Do' },
    tasks: g.tasks.map(t => ({
      ...t,
      description: t.labels.map(l => l.text).join(' · ') || undefined,
      progress: t.progress ?? (g.id === 'completed' ? 100 : g.id === 'inreview' ? 75 : g.id === 'inprogress' ? 50 : g.id === 'overdue' ? 25 : 0),
      assignee: t.assignee ?? currentUser,
    })),
  }))
)

const filteredGroups = computed(() =>
  enrichedGroups.value.map(g => ({
    ...g,
    tasks: g.tasks.filter(t => {
      if (activeStatCard.value !== 'all' && g.id !== activeStatCard.value) return false
      if (dueFilter.value !== 'all' && t.dueType !== dueFilter.value) return false
      if (projectFilter.value && t.project !== projectFilter.value) return false
      if (priorityFilter.value && t.priority !== priorityFilter.value) return false
      if (statusFilter.value && g.id !== statusFilter.value) return false
      return true
    }),
  })).filter(g => g.tasks.length > 0)
)

const allFilteredTasks = computed(() =>
  filteredGroups.value.flatMap(g => g.tasks.map(t => ({ ...t, groupId: g.id, groupLabel: g.label, statusInfo: g.statusInfo })))
)

const paginatedTasks = computed(() => {
  const start = (tablePage.value - 1) * pageSize
  return allFilteredTasks.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.max(1, Math.ceil(allFilteredTasks.value.length / pageSize)))

function goToPage(page: number) {
  tablePage.value = Math.min(Math.max(1, page), totalPages.value)
}

watch([projectFilter, priorityFilter, dueFilter, statusFilter, activeStatCard, viewMode], () => {
  tablePage.value = 1
})

function navigateToTask(taskId: string) {
  navigateTo(`/tasks/${taskId}`)
}

const groups = ref(structuredClone(rawGroups))

const taskSlideOver = useTaskSlideOver()
const actionOpen = ref<string | null>(null)

function openActions(e: Event, id: string) {
  e.stopPropagation()
  e.preventDefault()
  actionOpen.value = actionOpen.value === id ? null : id
}
function closeActions() { actionOpen.value = null }

function taskToDraft(task: MyTask, groupId: GroupId): Partial<import('~/shared/board').Task> {
  const statusInfo = statusFromGroup(groupId)
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status: statusInfo.id as import('~/shared/board').TaskStatus,
    statusLabel: statusInfo.label,
    priority: task.priority,
    priorityLabel: task.priorityLabel,
    assignee: task.assignee
      ? { id: `u-${task.id}`, ...task.assignee }
      : { id: 'u-me', name: currentUser.name, initials: currentUser.initials },
    epicName: task.project,
    projectName: task.project,
    dueDate: '',
    dueDateLabel: task.due,
    progress: task.progress ?? 0,
    comments: 0,
    attachments: 0,
  }
}

function viewTask(task: MyTask, groupId: GroupId) {
  closeActions()
  taskSlideOver.openPeek(taskToDraft(task, groupId))
}

function editTask(task: MyTask, groupId: GroupId) {
  closeActions()
  taskSlideOver.openEdit(task.id, taskToDraft(task, groupId))
}

function deleteTask(id: string) {
  closeActions()
  for (const group of groups.value) {
    const idx = group.tasks.findIndex(t => t.id === id)
    if (idx !== -1) {
      group.tasks.splice(idx, 1)
      break
    }
  }
}

onMounted(() => document.addEventListener('click', closeActions))
onUnmounted(() => document.removeEventListener('click', closeActions))

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <!-- Header -->
    <div class="mw-header">
      <div>
        <div class="mw-title">My Task</div>
        <div class="mw-subtitle">{{ today }} · Rasya Ardiansyah</div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="mw-stats">
      <!-- In Progress — tick bar style -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'inprogress' }" @click="setStatCard('inprogress')">
        <div class="mw-stat-icon-row">
          <div class="mw-stat-icon blue"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <span class="mw-stat-label">In Progress</span>
        </div>
        <div class="mw-num-row">
          <div class="mw-stat-num">5</div>
          <div class="mw-stat-sublabel">of 20 tasks</div>
        </div>
        <div class="mw-ticks">
          <div class="mw-tick on blue"/><div class="mw-tick on blue"/><div class="mw-tick on blue"/><div class="mw-tick on blue"/><div class="mw-tick on blue"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
        </div>
      </div>

      <!-- Due This Week — donut chart -->
      <div class="mw-stat-card" @click="setStatCard('all')">
        <div class="mw-stat-icon-row">
          <div class="mw-stat-icon amber"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <span class="mw-stat-label">Due This Week</span>
        </div>
        <div class="mw-donut-row">
          <svg viewBox="0 0 56 56" style="width:80px;height:80px;transform:rotate(-90deg);flex-shrink:0">
            <circle cx="28" cy="28" r="22" fill="none" stroke="white" stroke-width="9"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke="oklch(60.6% 0.25 292.717)" stroke-width="9" stroke-dasharray="67.12 71.11" stroke-dashoffset="0" stroke-linecap="butt"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke="#F59E0B" stroke-width="9" stroke-dasharray="32.56 105.67" stroke-dashoffset="-69.12" stroke-linecap="butt"/>
            <circle cx="28" cy="28" r="22" fill="none" stroke="#22C55E" stroke-width="9" stroke-dasharray="32.56 105.67" stroke-dashoffset="-103.68" stroke-linecap="butt"/>
          </svg>
          <div class="mw-donut-legend">
            <div class="mw-dl-item"><span class="mw-dl-dot" style="background:oklch(60.6% 0.25 292.717)"/><span class="mw-dl-label">Alpha Project</span><span class="mw-dl-val">2</span><span class="mw-dl-pct">· 50%</span></div>
            <div class="mw-dl-item"><span class="mw-dl-dot" style="background:#F59E0B"/><span class="mw-dl-label">Beta Launch</span><span class="mw-dl-val">1</span><span class="mw-dl-pct">· 25%</span></div>
            <div class="mw-dl-item"><span class="mw-dl-dot" style="background:#22C55E"/><span class="mw-dl-label">Mobile MVP</span><span class="mw-dl-val">1</span><span class="mw-dl-pct">· 25%</span></div>
          </div>
        </div>
      </div>

      <!-- Overdue — tick bar (red) -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'overdue' }" @click="setStatCard('overdue')">
        <div class="mw-stat-icon-row">
          <div class="mw-stat-icon red"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <span class="mw-stat-label">Overdue</span>
        </div>
        <div class="mw-num-row">
          <div class="mw-stat-num">3</div>
          <div class="mw-stat-sublabel">of 20 tasks</div>
        </div>
        <div class="mw-ticks">
          <div class="mw-tick on red"/><div class="mw-tick on red"/><div class="mw-tick on red"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
          <div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/><div class="mw-tick"/>
          <div class="mw-tick"/><div class="mw-tick"/>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'completed' }" @click="setStatCard('completed')" style="justify-content:flex-start">
        <div class="mw-stat-icon-row" style="justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <div class="mw-stat-icon green"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
            <span class="mw-stat-label">Completion Rate</span>
          </div>
          <button class="kpi-info-btn" @click.stop>i</button>
        </div>
        <div class="mw-rate-body">
          <div class="mw-rate-left">
            <div class="mw-rate-big">40%</div>
            <div class="mw-rate-trend">
              <span class="mw-rate-trend-val">↑ 8%</span>
              <span class="mw-rate-trend-lbl">this week</span>
            </div>
          </div>
          <div class="mw-rate-right">
            <div class="mw-rate-bar">
              <div class="mw-rate-seg" style="width:40%;background:#22C55E"/>
              <div class="mw-rate-seg" style="width:25%;background:oklch(60.6% 0.25 292.717)"/>
              <div class="mw-rate-seg" style="width:15%;background:#F59E0B"/>
            </div>
            <div class="mw-rate-stats">
              <div class="mw-rate-stat"><div class="mw-rate-snum green">8</div><div class="mw-rate-slbl">Done</div></div>
              <div class="mw-rate-stat"><div class="mw-rate-snum purple">5</div><div class="mw-rate-slbl">Active</div></div>
              <div class="mw-rate-stat"><div class="mw-rate-snum amber">3</div><div class="mw-rate-slbl">At Risk</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="mw-filterbar">
      <div class="mw-filterbar-left">
        <!-- Project dropdown -->
        <div class="mw-df-wrap" @click.stop="toggleDd($event, 'project')">
          <button class="mw-df-btn" :class="{ 'has-filter': projectFilter !== '' }">
            <span>{{ selectedProjectLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="mw-df-dd" :class="{ open: openDd === 'project' }">
            <div
              v-for="opt in projectOptions" :key="opt.value"
              class="mw-df-item" :class="{ 'active-item': projectFilter === opt.value }"
              @click="projectFilter = opt.value; openDd = ''"
            >
              {{ opt.label }}
            </div>
          </div>
        </div>

        <!-- Priority dropdown -->
        <div class="mw-df-wrap" @click.stop="toggleDd($event, 'priority')">
          <button class="mw-df-btn" :class="{ 'has-filter': priorityFilter !== '' }">
            <span>{{ selectedPriorityLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="mw-df-dd" :class="{ open: openDd === 'priority' }">
            <div
              v-for="opt in priorityOptions" :key="opt.value"
              class="mw-df-item" :class="{ 'active-item': priorityFilter === opt.value }"
              @click="priorityFilter = opt.value; openDd = ''"
            >
              {{ opt.label }}
            </div>
          </div>
        </div>

        <!-- Due date dropdown -->
        <div class="mw-df-wrap" @click.stop="toggleDd($event, 'due')">
          <button class="mw-df-btn" :class="{ 'has-filter': dueFilter !== 'all' }">
            <span>{{ selectedDueLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="mw-df-dd" :class="{ open: openDd === 'due' }">
            <div
              v-for="opt in dueOptions" :key="opt.value"
              class="mw-df-item" :class="{ 'active-item': dueFilter === opt.value }"
              @click="dueFilter = opt.value as DueFilter; openDd = ''"
            >
              {{ opt.label }}
            </div>
          </div>
        </div>

        <!-- Status dropdown -->
        <div class="mw-df-wrap" @click.stop="toggleDd($event, 'status')">
          <button class="mw-df-btn" :class="{ 'has-filter': statusFilter !== '' }">
            <span>{{ selectedStatusLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="mw-df-dd" :class="{ open: openDd === 'status' }">
            <div
              v-for="opt in statusOptions" :key="opt.value"
              class="mw-df-item" :class="{ 'active-item': statusFilter === opt.value }"
              @click="statusFilter = opt.value; openDd = ''"
            >
              {{ opt.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- List / Table toggle -->
      <div class="proj-view-switcher flex items-center gap-3">
        <button class="proj-view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">List</button>
        <button class="proj-view-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">Table</button>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div v-if="viewMode === 'list'" class="mw-table-wrap">
      <div
        v-for="group in filteredGroups" :key="group.id"
        class="task-group"
        :class="{ collapsed: collapsedGroups.has(group.id) }"
      >
        <div class="task-group-header" @click="toggleGroup(group.id)">
          <svg class="group-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition:transform .15s;flex-shrink:0;"><polyline points="6 9 12 15 18 9"/></svg>
          <span class="size-2 rounded-full" :class="statusDotClass(group.id)" />
          <h3 class="text-[14px] font-semibold text-gray-900">
            {{ group.label }}
          </h3>
          <span class="text-[12px] text-gray-500">
            ({{ group.tasks.length }})
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="task in group.tasks" :key="task.id"
            class="task-row flex cursor-pointer items-center gap-4 rounded-md border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-gray-300 hover:bg-gray-50"
            :data-project="task.project"
            :data-priority="task.priority"
            :data-due="task.dueType"
            @click="navigateToTask(task.id)"
          >
            <span
              :class="[
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                statusClass(group.id),
              ]"
            >
              <span class="size-1.5 rounded-full bg-current" />
              {{ group.statusInfo.label }}
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
              <p class="truncate text-[13px] font-semibold text-gray-900" :class="{ 'line-through text-gray-400': task.done }">
                {{ task.title }}
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <UAvatar
                :src="task.assignee?.avatar"
                :text="task.assignee?.initials"
                size="xs"
                :title="task.assignee?.name"
              />
            </div>

            <span
              class="hidden shrink-0 truncate rounded-sm border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 sm:block"
            >
              {{ task.project }}
            </span>

            <span
              class="shrink-0 text-[12px]"
              :class="{
                'font-medium text-red-600': task.dueType === 'overdue',
                'font-medium text-purple-600': task.dueType === 'today',
                'text-gray-500': task.dueType !== 'overdue' && task.dueType !== 'today',
              }"
            >
              {{ task.due }}
            </span>

            <div class="relative shrink-0" @click.stop>
              <button class="task-more-btn" @click="openActions($event, `list-${task.id}`)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
              </button>
              <div
                v-if="actionOpen === `list-${task.id}`"
                class="task-action-dd task-action-dd--right"
                @click.stop
              >
                <button class="task-action-item" @click.stop="viewTask(task, group.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <button class="task-action-item" @click.stop="editTask(task, group.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <div class="task-action-divider" />
                <button class="task-action-item danger" @click.stop="deleteTask(task.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredGroups.length === 0" class="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-8 text-center text-[13px] text-gray-500">
        No tasks match the selected filters.
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else class="mw-tbl-view" style="display:flex;flex:1;overflow-y:auto;">
      <div class="overflow-hidden rounded-lg border border-gray-200 bg-white" style="flex:1;">
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
                <th class="px-4 py-3 text-[12px] font-semibold text-gray-600" style="width:44px">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in paginatedTasks" :key="task.id"
                class="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
                :data-project="task.project"
                :data-priority="task.priority"
                :data-due="task.dueType"
                @click="navigateToTask(task.id)"
              >
                <td class="px-4 py-3">
                  <div class="min-w-0">
                    <p class="truncate text-[13px] font-semibold text-gray-900" :class="{ 'line-through text-gray-400': task.done }">
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
                      statusClass(task.groupId),
                    ]"
                  >
                    <span class="size-1.5 rounded-full bg-current" />
                    {{ task.statusInfo.label }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                      priorityClass(task.priority),
                    ]"
                  >
                    {{ task.priorityLabel }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <UAvatar
                      :src="task.assignee?.avatar"
                      :text="task.assignee?.initials"
                      size="xs"
                    />
                    <span class="truncate text-[13px] text-gray-700">
                      {{ task.assignee?.name }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="truncate text-[13px] text-gray-700">
                    {{ task.project }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="text-[13px]"
                    :class="{
                      'font-medium text-red-600': task.dueType === 'overdue',
                      'font-medium text-purple-600': task.dueType === 'today',
                      'text-gray-700': task.dueType !== 'overdue' && task.dueType !== 'today',
                    }"
                  >
                    {{ task.due }}
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
                        :class="progressColor(task.progress ?? 0)"
                        :style="{ width: (task.progress ?? 0) + '%' }"
                      />
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3" @click.stop>
                  <div class="relative">
                    <button class="task-more-btn" @click="openActions($event, `tbl-${task.id}`)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                    </button>
                    <div
                      v-if="actionOpen === `tbl-${task.id}`"
                      class="task-action-dd task-action-dd--right"
                      @click.stop
                    >
                      <button class="task-action-item" @click.stop="navigateToTask(task.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </button>
                      <button class="task-action-item" @click.stop="editTask(task, task.groupId)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <div class="task-action-divider" />
                      <button class="task-action-item danger" @click.stop="deleteTask(task.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedTasks.length === 0">
                <td colspan="8" class="px-4 py-10 text-center text-[14px] text-gray-400">
                  No tasks match the selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="allFilteredTasks.length > pageSize" class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
          <span class="text-[12px] text-gray-500">
            Showing {{ ((tablePage - 1) * pageSize) + 1 }}–{{ Math.min(tablePage * pageSize, allFilteredTasks.length) }} of {{ allFilteredTasks.length }} tasks
          </span>
          <div class="flex items-center gap-1">
            <button
              class="px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
              :disabled="tablePage <= 1"
              @click="goToPage(1)"
            >
              First
            </button>
            <button
              class="px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
              :disabled="tablePage <= 1"
              @click="goToPage(tablePage - 1)"
            >
              Prev
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              class="mx-0.5 flex h-7 w-7 items-center justify-center rounded text-[12px] font-medium transition-colors"
              :class="p === tablePage ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'"
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
            <button
              class="px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
              :disabled="tablePage >= totalPages"
              @click="goToPage(tablePage + 1)"
            >
              Next
            </button>
            <button
              class="px-2 py-1.5 text-[12px] font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
              :disabled="tablePage >= totalPages"
              @click="goToPage(totalPages)"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
