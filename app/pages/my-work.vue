<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'My Work' })

type DueFilter = 'all' | 'today' | 'week' | 'overdue' | 'none'
type GroupId = 'overdue' | 'inprogress' | 'todo' | 'inreview' | 'completed'

const activeStatCard = ref<GroupId | 'all'>('all')
const dueFilter = ref<DueFilter>('all')
const projectFilter = ref('')
const priorityFilter = ref('')
const viewMode = ref<'list' | 'table'>('list')
const openDd = ref('')

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
  { label: 'All Projects',    value: '' },
  { label: 'Alpha Project',   value: 'Alpha Project' },
  { label: 'Beta Launch',     value: 'Beta Launch' },
  { label: 'Mobile App MVP',  value: 'Mobile App MVP' },
  { label: 'Design System v2', value: 'Design System v2' },
]
const priorityOptions = [
  { label: 'All Priorities', value: '' },
  { label: 'High',   value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low',    value: 'low' },
]

const selectedDueLabel = computed(() =>
  dueOptions.find(o => o.value === dueFilter.value)?.label ?? 'Due date'
)
const selectedProjectLabel = computed(() =>
  projectOptions.find(o => o.value === projectFilter.value)?.label ?? 'All Projects'
)
const selectedPriorityLabel = computed(() =>
  priorityOptions.find(o => o.value === priorityFilter.value)?.label ?? 'All Priorities'
)

interface Task {
  id: string; title: string; project: string; priority: 'high' | 'medium' | 'low'; priorityLabel: string
  due: string; dueType: DueFilter; labels: { text: string; color?: string }[]; done?: boolean
}

const groups: { id: GroupId; label: string; dotClass: string; tasks: Task[] }[] = [
  { id: 'overdue', label: 'Overdue', dotClass: 'overdue', tasks: [
    { id: 't1', title: 'Auth redesign implementation', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 10', dueType: 'overdue', labels: [{ text: 'UX' }, { text: 'Design', color: 'amber' }] },
    { id: 't2', title: 'Mobile checkout flow', project: 'Mobile App MVP', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 14', dueType: 'overdue', labels: [{ text: 'Mobile', color: 'green' }] },
    { id: 't3', title: 'Token naming inconsistency fix', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 18', dueType: 'overdue', labels: [{ text: 'Tokens', color: 'gray' }] },
  ]},
  { id: 'inprogress', label: 'In Progress', dotClass: 'inprogress', tasks: [
    { id: 't4', title: 'Produce high-fidelity mockups', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'UX' }, { text: 'Figma' }] },
    { id: 't5', title: 'API rate limit specification', project: 'Beta Launch', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'Backend', color: 'gray' }] },
    { id: 't6', title: 'Component library export', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 23', dueType: 'week', labels: [{ text: 'Components', color: 'green' }] },
    { id: 't7', title: 'Implement payment gateway', project: 'Mobile App MVP', priority: 'medium', priorityLabel: 'MED', due: 'Jun 24', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }, { text: 'Dev', color: 'gray' }] },
    { id: 't8', title: 'Write release notes draft', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: '—', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
  ]},
  { id: 'todo', label: 'To Do', dotClass: 'todo', tasks: [
    { id: 't9', title: 'Handoff to engineering', project: 'Alpha Project', priority: 'medium', priorityLabel: 'MED', due: 'Jul 15', dueType: 'none', labels: [{ text: 'Handoff', color: 'gray' }] },
    { id: 't10', title: 'Onboarding copy finalization', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: 'Jul 1', dueType: 'none', labels: [{ text: 'Copy', color: 'gray' }] },
    { id: 't11', title: 'App store submission checklist', project: 'Mobile App MVP', priority: 'low', priorityLabel: 'LOW', due: 'Jun 30', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }] },
  ]},
  { id: 'inreview', label: 'In Review', dotClass: 'inreview', tasks: [
    { id: 't12', title: 'Draft information architecture', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 22', dueType: 'week', labels: [{ text: 'UX' }] },
    { id: 't13', title: 'Design system documentation', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 25', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
  ]},
  { id: 'completed', label: 'Completed', dotClass: 'completed', tasks: [
    { id: 't14', title: 'Finalize user research synthesis', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 10', dueType: 'none', labels: [{ text: 'Research' }], done: true },
    { id: 't15', title: 'Audit existing components', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 12', dueType: 'none', labels: [{ text: 'Components', color: 'green' }], done: true },
    { id: 't16', title: 'Set up CI/CD pipeline', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: 'Jun 15', dueType: 'none', labels: [{ text: 'Dev', color: 'gray' }], done: true },
    { id: 't17', title: 'Finalize screen flows', project: 'Mobile App MVP', priority: 'high', priorityLabel: 'HIGH', due: 'May 15', dueType: 'none', labels: [{ text: 'Mobile', color: 'green' }], done: true },
    { id: 't18', title: 'User interview synthesis', project: 'Alpha Project', priority: 'medium', priorityLabel: 'MED', due: 'May 20', dueType: 'none', labels: [{ text: 'Research' }], done: true },
    { id: 't19', title: 'Typography scale definition', project: 'Design System v2', priority: 'low', priorityLabel: 'LOW', due: 'May 28', dueType: 'none', labels: [{ text: 'Tokens', color: 'gray' }], done: true },
    { id: 't20', title: 'Competitor feature analysis', project: 'Beta Launch', priority: 'medium', priorityLabel: 'MED', due: 'Jun 5', dueType: 'none', labels: [{ text: 'Research' }], done: true },
    { id: 't21', title: 'Stakeholder alignment deck', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 8', dueType: 'none', labels: [{ text: 'Strategy', color: 'amber' }], done: true },
  ]},
]

const filteredGroups = computed(() =>
  groups.map(g => ({
    ...g,
    tasks: g.tasks.filter(t => {
      if (activeStatCard.value !== 'all' && g.id !== activeStatCard.value) return false
      if (dueFilter.value !== 'all' && t.dueType !== dueFilter.value) return false
      if (projectFilter.value && t.project !== projectFilter.value) return false
      if (priorityFilter.value && t.priority !== priorityFilter.value) return false
      return true
    }),
  })).filter(g => g.tasks.length > 0)
)

const allFilteredTasks = computed(() =>
  filteredGroups.value.flatMap(g => g.tasks.map(t => ({ ...t, groupId: g.id, groupLabel: g.label })))
)

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <!-- Header -->
    <div class="mw-header">
      <div>
        <div class="mw-title">My Work</div>
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
      </div>

      <!-- List / Table toggle -->
      <div class="proj-view-switcher">
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
          <span class="mw-group-dot" :class="group.dotClass" />
          <span class="mw-group-label">{{ group.label }}</span>
          <span class="mw-group-count">· {{ group.tasks.length }}</span>
        </div>
        <div
          v-for="task in group.tasks" :key="task.id"
          class="task-row"
          :data-project="task.project"
          :data-priority="task.priority"
          :data-due="task.dueType"
        >
          <div class="mw-row-main">
            <input type="checkbox" :checked="task.done" style="accent-color:oklch(60.6% 0.25 292.717);flex-shrink:0;">
            <span class="task-status-pill" :class="group.id === 'completed' ? 'done' : group.id">
              {{ group.id === 'inprogress' ? 'In Progress' : group.id === 'inreview' ? 'In Review' : group.label }}
            </span>
            <span class="task-name" :class="{ done: task.done }">{{ task.title }}</span>
          </div>
          <div class="mw-row-right">
            <span v-for="label in task.labels" :key="label.text" class="task-label-chip" :class="label.color">{{ label.text }}</span>
            <span class="task-priority" :class="task.priority">{{ task.priorityLabel }}</span>
            <span class="task-due" :class="{ overdue: task.dueType === 'overdue', today: task.dueType === 'today' }">{{ task.due }}</span>
            <button class="task-more-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else class="mw-tbl-view" style="display:flex;flex:1;overflow-y:auto;">
      <table class="mw-tbl" style="width:100%;">
        <thead>
          <tr>
            <th style="width:36px;"></th>
            <th>Task</th>
            <th style="width:140px">Project</th>
            <th style="width:110px">Status</th>
            <th style="width:90px">Priority</th>
            <th style="width:100px">Due</th>
            <th style="width:120px">Labels</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in allFilteredTasks" :key="task.id"
            :data-project="task.project"
            :data-priority="task.priority"
            :data-due="task.dueType"
          >
            <td><input type="checkbox" :checked="task.done" style="accent-color:oklch(60.6% 0.25 292.717)"></td>
            <td class="td-task" :class="{ done: task.done }">{{ task.title }}</td>
            <td class="td-proj">{{ task.project }}</td>
            <td>
              <span class="task-status-pill" :class="task.groupId === 'completed' ? 'done' : task.groupId">
                {{ task.groupId === 'inprogress' ? 'In Progress' : task.groupId === 'inreview' ? 'In Review' : task.groupLabel }}
              </span>
            </td>
            <td><span class="task-priority" :class="task.priority">{{ task.priorityLabel }}</span></td>
            <td class="td-due" :class="{ overdue: task.dueType === 'overdue', today: task.dueType === 'today' }">{{ task.due }}</td>
            <td>
              <span v-for="label in task.labels" :key="label.text" class="task-label-chip" :class="label.color">{{ label.text }}</span>
            </td>
          </tr>
          <tr v-if="allFilteredTasks.length === 0">
            <td colspan="7" style="padding:40px;text-align:center;color:#9CA3AF;font-size:14px;">No tasks match the selected filters.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
