<script setup lang="ts">
import type { Kpi, Label, Owner } from '~/shared/goals'

definePageMeta({ layout: 'default', title: 'Goals', middleware: 'auth' })

const openDd = ref('')
const selectedStatuses = ref<string[]>(['on-track', 'at-risk', 'completed', 'not-started'])
const selectedPeriods  = ref<string[]>(['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'])
const viewMode = ref<'card' | 'list'>('card')

function toggleDd(e: Event, id: string) { e.stopPropagation(); openDd.value = openDd.value === id ? '' : id }
function closeDd() { openDd.value = '' }
onMounted(() => document.addEventListener('click', closeDd))
onUnmounted(() => document.removeEventListener('click', closeDd))

function toggleStatus(v: string) {
  const i = selectedStatuses.value.indexOf(v)
  if (i === -1) selectedStatuses.value.push(v)
  else selectedStatuses.value.splice(i, 1)
}
function togglePeriod(v: string) {
  const i = selectedPeriods.value.indexOf(v)
  if (i === -1) selectedPeriods.value.push(v)
  else selectedPeriods.value.splice(i, 1)
}

const statusHasFilter = computed(() => selectedStatuses.value.length < 4)
const periodHasFilter = computed(() => selectedPeriods.value.length < 4)

interface GoalData {
  id: string; title: string; description: string
  category: string; categoryIcon: string
  status: 'on-track' | 'at-risk' | 'completed' | 'not-started'
  statusLabel: string; period: string; dueDate: string; overdueDate?: boolean
  current: number; total: number; progress: number
  progressHint: string; barColor: string
  projects: { key: string; name: string }[]
  members: { seed: string; bg: string }[]
  memberCount: number
  owner: Owner
  kpis: Kpi[]
  labels: Label[]
}

const goalData = ref<GoalData[]>([
  {
    id: 'goal-1', title: '1000 Dribbble Shots', description: 'Publish 1000 design shots to Dribbble by end of year',
    category: 'Design', categoryIcon: 'clock', status: 'on-track', statusLabel: 'On Track', period: 'Q4 2025',
    dueDate: 'Dec 31, 2025', current: 900, total: 1000, progress: 90,
    progressHint: '90% · 100 tasks remaining', barColor: 'green',
    projects: [{ key: 'DRIB', name: 'Dribbble Shot' }],
    members: [{ seed: 'Rasya', bg: 'b6e3f4' }, { seed: 'Maya', bg: 'ffd5dc' }], memberCount: 5,
    owner: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
    kpis: [
      { id: 'kpi-g1-1', name: 'Total shots published', current: '900', target: '1000', progress: 90, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' }, dueDate: 'Dec 31' },
      { id: 'kpi-g1-2', name: 'Avg likes per shot', current: '320', target: '500', progress: 64, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, dueDate: 'Dec 31' },
      { id: 'kpi-g1-3', name: 'Featured shots', current: '12', target: '20', progress: 60, status: 'at-risk', statusLabel: 'At Risk', owner: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' }, dueDate: 'Dec 15' },
    ],
    labels: [
      { id: 'l-g1-1', name: 'Design', color: 'bg-purple-50 text-purple-600 border-purple-200' },
      { id: 'l-g1-2', name: 'Q4', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    ],
  },
  {
    id: 'goal-2', title: '50 Blog Posts Published', description: 'Publish 50 technical blog posts across product & engineering',
    category: 'Content', categoryIcon: 'file', status: 'at-risk', statusLabel: 'At Risk', period: 'Q3 2025',
    dueDate: 'Sep 30, 2025', overdueDate: true, current: 23, total: 50, progress: 46,
    progressHint: '46% · deadline Sep 30', barColor: 'amber',
    projects: [{ key: 'BLOG', name: 'Blog Series' }, { key: 'DS2', name: 'Design System v2' }],
    members: [{ seed: 'Dito', bg: 'c0aede' }, { seed: 'Aldo', bg: 'd1f0c2' }], memberCount: 3,
    owner: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' },
    kpis: [
      { id: 'kpi-g2-1', name: 'Posts published', current: '23', target: '50', progress: 46, status: 'at-risk', statusLabel: 'At Risk', owner: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, dueDate: 'Sep 30' },
      { id: 'kpi-g2-2', name: 'Avg read time (min)', current: '4.2', target: '5', progress: 84, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'A', name: 'Aldo', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Aldo' }, dueDate: 'Sep 30' },
      { id: 'kpi-g2-3', name: 'Newsletter subscribers', current: '1200', target: '2000', progress: 60, status: 'at-risk', statusLabel: 'At Risk', owner: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, dueDate: 'Sep 30' },
    ],
    labels: [
      { id: 'l-g2-1', name: 'Content', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
      { id: 'l-g2-2', name: 'Q3', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    ],
  },
  {
    id: 'goal-3', title: '100 API Endpoints Documented', description: 'Document all public API endpoints with examples and schemas',
    category: 'Engineering', categoryIcon: 'code', status: 'on-track', statusLabel: 'On Track', period: 'Q4 2025',
    dueDate: 'Oct 31, 2025', current: 67, total: 100, progress: 67,
    progressHint: '67% · 33 tasks remaining', barColor: 'blue',
    projects: [{ key: 'API', name: 'API Gateway v2' }],
    members: [{ seed: 'Rasya', bg: 'b6e3f4' }, { seed: 'Dito', bg: 'c0aede' }, { seed: 'Lintang', bg: 'a5f3fc' }], memberCount: 3,
    owner: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' },
    kpis: [
      { id: 'kpi-g3-1', name: 'Endpoints documented', current: '67', target: '100', progress: 67, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'R', name: 'Rasya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya' }, dueDate: 'Oct 31' },
      { id: 'kpi-g3-2', name: 'Schema coverage', current: '85%', target: '100%', progress: 85, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'L', name: 'Lintang', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Lintang' }, dueDate: 'Oct 31' },
      { id: 'kpi-g3-3', name: 'Example requests', current: '40', target: '60', progress: 67, status: 'on-track', statusLabel: 'On Track', owner: { initials: 'D', name: 'Dito', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito' }, dueDate: 'Oct 15' },
    ],
    labels: [
      { id: 'l-g3-1', name: 'Engineering', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      { id: 'l-g3-2', name: 'API', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    ],
  },
  {
    id: 'goal-4', title: 'Beta Launch Checklist', description: 'Complete all pre-launch tasks for Beta product release',
    category: 'Product', categoryIcon: 'bolt', status: 'completed', statusLabel: 'Completed', period: 'Q2 2025',
    dueDate: 'Jun 30, 2025', current: 48, total: 48, progress: 100,
    progressHint: '100% · Completed Jun 28, 2025', barColor: 'complete',
    projects: [{ key: 'BETA', name: 'Beta Launch' }, { key: 'CUS', name: 'Customer Portal' }],
    members: [{ seed: 'Maya', bg: 'ffd5dc' }, { seed: 'Rara', bg: 'f9a8d4' }], memberCount: 4,
    owner: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' },
    kpis: [
      { id: 'kpi-g4-1', name: 'Pre-launch tasks', current: '48', target: '48', progress: 100, status: 'completed', statusLabel: 'Completed', owner: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, dueDate: 'Jun 30' },
      { id: 'kpi-g4-2', name: 'Beta signups', current: '120', target: '100', progress: 100, status: 'completed', statusLabel: 'Completed', owner: { initials: 'R', name: 'Rara', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara' }, dueDate: 'Jun 30' },
      { id: 'kpi-g4-3', name: 'NPS score', current: '52', target: '45', progress: 100, status: 'completed', statusLabel: 'Completed', owner: { initials: 'M', name: 'Maya', avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya' }, dueDate: 'Jun 30' },
    ],
    labels: [
      { id: 'l-g4-1', name: 'Product', color: 'bg-rose-50 text-rose-600 border-rose-200' },
      { id: 'l-g4-2', name: 'Beta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    ],
  },
])

const filteredGoals = computed(() =>
  goalData.value.filter(g => selectedStatuses.value.includes(g.status))
)

const goalSlideOver = useGoalSlideOver()
const actionOpen = ref<string | null>(null)

function openActions(e: Event, id: string) {
  e.stopPropagation()
  e.preventDefault()
  actionOpen.value = actionOpen.value === id ? null : id
}
function closeActions() { actionOpen.value = null }

function viewGoal(id: string) {
  closeActions()
  navigateTo(`/goals/${id}`)
}

function editGoal(g: GoalData) {
  closeActions()
  goalSlideOver.openEdit(g.id, {
    id: g.id,
    title: g.title,
    description: g.description,
    status: g.status,
    statusLabel: g.statusLabel,
    owner: g.owner,
    quarter: g.period,
    dueDate: g.dueDate,
    progress: g.progress,
    labels: g.labels,
    kpis: g.kpis,
    linkedProjects: g.projects.map(p => ({ id: p.key, title: p.name, project: p.name, status: g.status, statusLabel: g.statusLabel, progress: g.progress, taskCount: 0 })),
    activity: [],
  })
}

function deleteGoal(id: string) {
  closeActions()
  goalData.value = goalData.value.filter(g => g.id !== id)
}

onMounted(() => document.addEventListener('click', closeActions))
onUnmounted(() => document.removeEventListener('click', closeActions))
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="page-toolbar">
      <div style="display:flex;align-items:center;gap:8px">
        <!-- Status filter -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'status')">
          <button class="df-btn" :class="{ 'has-filter': statusHasFilter }">
            Status
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'status' }">
            <div v-for="opt in [
              { v: 'on-track',    dot: '#22C55E', label: 'On Track' },
              { v: 'at-risk',     dot: '#F59E0B', label: 'At Risk' },
              { v: 'completed',   dot: 'oklch(60.6% 0.25 292.717)', label: 'Completed' },
              { v: 'not-started', dot: '#9CA3AF', label: 'Not Started' },
            ]" :key="opt.v"
              class="df-item" :class="{ checked: selectedStatuses.includes(opt.v) }"
              @click.stop="toggleStatus(opt.v)"
            >
              <div class="df-checkbox" />
              <span class="df-dot" :style="{ background: opt.dot }" />
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
            <div class="df-footer"><button class="df-clear" @click.stop="selectedStatuses = ['on-track','at-risk','completed','not-started']; openDd = ''">Clear</button></div>
          </div>
        </div>

        <!-- Period filter -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'period')">
          <button class="df-btn" :class="{ 'has-filter': periodHasFilter }">
            Period
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'period' }">
            <div v-for="p in ['Q1 2025','Q2 2025','Q3 2025','Q4 2025']" :key="p"
              class="df-item" :class="{ checked: selectedPeriods.includes(p) }"
              @click.stop="togglePeriod(p)"
            >
              <div class="df-checkbox" />
              <span class="df-item-label">{{ p }}</span>
            </div>
            <div class="df-footer"><button class="df-clear" @click.stop="selectedPeriods = ['Q1 2025','Q2 2025','Q3 2025','Q4 2025']; openDd = ''">Clear</button></div>
          </div>
        </div>
      </div>

      <div class="proj-view-switcher">
        <button class="proj-view-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Card
        </button>
        <button class="proj-view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          List
        </button>
      </div>
    </div>

    <!-- ── CARD VIEW ── -->
    <div v-if="viewMode === 'card'" class="goals-grid">
      <div
        v-for="g in filteredGoals" :key="g.id"
        class="goal-card"
        :style="g.status === 'completed' ? 'opacity:.85' : ''"
      >
        <NuxtLink :to="`/goals/${g.id}`" class="goal-card-link">
          <div class="goal-card-top">
            <span class="goal-status-pill" :class="g.status">
              <template v-if="g.status === 'completed'">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </template>
              <template v-else>
                <span :style="{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', background: g.status === 'on-track' ? '#22C55E' : g.status === 'at-risk' ? '#F59E0B' : '#9CA3AF' }" />
              </template>
              {{ g.statusLabel }}
            </span>
            <div class="goal-card-actions" @click.stop>
              <button class="goal-card-more" @click.stop="openActions($event, g.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
              </button>
              <div
                v-if="actionOpen === g.id"
                class="goal-action-dd"
                @click.stop
              >
                <button class="goal-action-item" @click.prevent.stop="viewGoal(g.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <button class="goal-action-item" @click.prevent.stop="editGoal(g)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <div class="goal-action-divider" />
                <button class="goal-action-item danger" @click.prevent.stop="deleteGoal(g.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="goal-card-title">{{ g.title }}</div>
          <div class="goal-card-desc">{{ g.description }}</div>

          <div class="goal-progress-section">
            <div class="goal-progress-row">
              <span class="goal-progress-label">Tasks completed</span>
              <span class="goal-progress-count" :style="g.status === 'completed' ? 'color:oklch(52% 0.27 292.717)' : ''">
                {{ g.current }} <span>/ {{ g.total }}</span>
              </span>
            </div>
            <div class="goal-bar-track">
              <div class="goal-bar-fill" :class="g.barColor" :style="{ width: `${g.progress}%` }" />
            </div>
            <div class="goal-progress-hint" :style="g.status === 'at-risk' ? 'color:#92400E' : g.status === 'completed' ? 'color:oklch(52% 0.27 292.717);font-weight:500' : ''">
              {{ g.progressHint }}
            </div>
          </div>

          <div class="goal-linked">
            <span class="goal-linked-label">Projects</span>
            <span v-for="p in g.projects" :key="p.key" class="goal-proj-chip">
              <span class="goal-proj-chip-key">{{ p.key }}</span> {{ p.name }}
            </span>
          </div>

          <div class="goal-card-footer">
            <span class="goal-due" :class="{ overdue: g.overdueDate }">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ g.dueDate }}
            </span>
            <div class="goal-members">
              <div class="av-stack">
                <img v-for="m in g.members" :key="m.seed" class="av-circle"
                  :src="`https://api.dicebear.com/9.x/open-peeps/svg?seed=${m.seed}&backgroundColor=${m.bg}&backgroundType=solid`"
                  :alt="m.seed">
              </div>
              <span class="goal-member-count">{{ g.memberCount }} members</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- ── LIST VIEW ── -->
    <div v-else style="flex:1;overflow-y:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <th class="list-th">Goal</th>
            <th class="list-th">Status</th>
            <th class="list-th">Progress</th>
            <th class="list-th">Linked projects</th>
            <th class="list-th">Deadline</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in filteredGoals" :key="g.id"
            style="cursor:pointer;border-bottom:1px solid #F3F4F6;transition:background .1s"
            :style="g.status === 'completed' ? 'opacity:.75' : ''"
            @mouseenter="($event.currentTarget as HTMLElement).style.background = '#F9FAFB'"
            @mouseleave="($event.currentTarget as HTMLElement).style.background = ''"
            @click="navigateTo(`/goals/${g.id}`)"
          >
            <td style="padding:12px;">
              <div style="font-size:13.5px;font-weight:600;color:#111827;">{{ g.title }}</div>
              <div style="font-size:12px;color:#9CA3AF;margin-top:2px">{{ g.category }}</div>
            </td>
            <td style="padding:12px;">
              <span class="goal-status-pill" :class="g.status">
                <template v-if="g.status === 'completed'"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></template>
                <template v-else><span :style="{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', background: g.status === 'on-track' ? '#22C55E' : '#F59E0B' }" /></template>
                {{ g.statusLabel }}
              </span>
            </td>
            <td style="padding:12px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="flex:1;height:6px;background:#F3F4F6;border-radius:10px;overflow:hidden;min-width:80px;">
                  <div :style="{ height: '100%', width: `${g.progress}%`, background: g.barColor === 'green' ? '#22C55E' : g.barColor === 'amber' ? '#F59E0B' : g.barColor === 'blue' || g.barColor === 'complete' ? 'oklch(60.6% 0.25 292.717)' : '#9CA3AF', borderRadius: '10px' }" />
                </div>
                <span style="font-size:12.5px;font-weight:600;color:#374151;white-space:nowrap;" :style="g.status === 'completed' ? 'color:oklch(52% 0.27 292.717)' : ''">{{ g.current }} / {{ g.total }}</span>
              </div>
            </td>
            <td style="padding:12px;display:flex;gap:5px;flex-wrap:wrap;">
              <span v-for="p in g.projects" :key="p.key" class="goal-proj-chip">
                <span class="goal-proj-chip-key">{{ p.key }}</span> {{ p.name }}
              </span>
            </td>
            <td style="padding:12px;font-size:12.5px;" :style="g.overdueDate ? 'color:#EF4444;font-weight:500' : 'color:#6B7280'">{{ g.dueDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
