<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Project' })

const route = useRoute()
const id = route.params.id as string
const activeTab = ref<'overview' | 'tasks' | 'activity' | 'comments' | 'attachments'>('overview')
const editingField = ref<string | null>(null)

interface PAssignee { seed: string; bg: string; name: string }
interface PTask { id: number; title: string; done: boolean; date: string; late?: boolean; assignee: string; aInit: string; aBg: string; aColor: string }
interface PComment { author: string; aInit: string; aBg: string; aColor: string; time: string; text: string }
interface PAttachment { id: number; name: string; size: string; type: 'figma' | 'notion' | 'file' }
interface PActivity { id: number; author: string; aInit: string; aBg: string; aColor: string; time: string; text: string; target?: string }
interface PProject {
  id: string; key: string; icon: string; name: string; subtitle: string; description: string
  owner: string; oInit: string; oSeed: string; oBg: string
  startDate: string; endDate: string; endDateRed?: boolean
  statusLabel: string; statusClass: string
  priority: string; priorityColor: string
  progress: number; doneT: number; totalT: number; daysOverdue?: number
  category: string; labels: string[]
  assignees: PAssignee[]
  quickLinks: { label: string; url: string; icon: 'figma' | 'notion' | 'file' }[]
  tasks: PTask[]
  comments: PComment[]
  attachments: PAttachment[]
  activity: PActivity[]
}

const db: PProject[] = [
  {
    id: 'p1', key: 'ALPHA', icon: '🎨', name: 'Alpha Project',
    subtitle: 'UX Redesign · Core product',
    description: 'Redesigning core product UX to improve activation, retention, and time-to-value across the entire product surface.',
    owner: 'Rasya', oInit: 'R', oSeed: 'Rasya', oBg: 'b6e3f4',
    startDate: 'Jan 6, 2026', endDate: 'Aug 30, 2025', endDateRed: true,
    statusLabel: 'At Risk', statusClass: 'cs-risk',
    priority: 'High', priorityColor: '#D97706',
    progress: 62, doneT: 9, totalT: 14, daysOverdue: 22,
    category: 'Core product', labels: ['UX', 'Q3'],
    assignees: [
      { seed: 'Rasya', bg: 'b6e3f4', name: 'Rasya' },
      { seed: 'Maya', bg: 'ffd5dc', name: 'Maya' },
      { seed: 'Dito', bg: 'c0aede', name: 'Dito' },
    ],
    quickLinks: [
      { label: 'Figma mockups', url: 'https://figma.com/alpha', icon: 'figma' },
      { label: 'Notion brief', url: 'https://notion.so/alpha-brief', icon: 'notion' },
    ],
    tasks: [
      { id: 1, title: 'Finalize user research synthesis', done: true, date: 'Jun 10', assignee: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 2, title: 'Draft information architecture', done: true, date: 'Jun 15', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
      { id: 3, title: 'Produce high-fidelity mockups', done: false, date: 'Jul 1 · overdue', late: true, assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 4, title: 'Handoff to engineering', done: false, date: 'Jul 15', assignee: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB' },
    ],
    comments: [
      { author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 17 · 10:30am', text: "Let's keep scope tight for v1 and ship a research-backed MVP." },
      { author: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626', time: 'Jun 17 · 11:05am', text: "Agreed. I'll update the IA doc by EOD." },
    ],
    attachments: [
      { id: 1, name: 'Alpha Project Brief.pdf', size: '2.4 MB', type: 'file' },
      { id: 2, name: 'User Research Synthesis.pdf', size: '5.1 MB', type: 'file' },
      { id: 3, name: 'High-Fi Mockups', size: 'Figma', type: 'figma' },
    ],
    activity: [
      { id: 1, author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Today · 10:32 AM', text: 'Moved status to', target: 'At Risk' },
      { id: 2, author: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626', time: 'Yesterday · 4:15 PM', text: 'Completed', target: 'Draft information architecture' },
      { id: 3, author: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669', time: 'Jun 20 · 2:00 PM', text: 'Added task', target: 'Produce high-fidelity mockups' },
      { id: 4, author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 17 · 9:00 AM', text: 'Created project', target: 'Alpha Project' },
    ],
  },
  {
    id: 'p2', key: 'BETA', icon: '🚀', name: 'Beta Launch',
    subtitle: 'Q3 Milestone · Launch',
    description: 'Public launch milestone for Q3, including marketing site, press kit, and early-access onboarding.',
    owner: 'Maya', oInit: 'M', oSeed: 'Maya', oBg: 'ffd5dc',
    startDate: 'May 20, 2026', endDate: 'Jul 15, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Medium', priorityColor: 'oklch(60.6% 0.25 292.717)',
    progress: 78, doneT: 7, totalT: 9,
    category: 'Launch', labels: ['Launch', 'Q3'],
    assignees: [{ seed: 'Maya', bg: 'ffd5dc', name: 'Maya' }, { seed: 'Dito', bg: 'c0aede', name: 'Dito' }],
    quickLinks: [{ label: 'Notion brief', url: 'https://notion.so/beta-launch', icon: 'notion' }],
    tasks: [
      { id: 1, title: 'Publish press kit', done: true, date: 'Jun 20', assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 2, title: 'Finalize onboarding flow', done: false, date: 'Jul 5', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [{ author: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669', time: 'Jun 17 · 9:00am', text: 'Press kit is ready for review.' }],
    attachments: [],
    activity: [
      { id: 1, author: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669', time: 'Jun 20 · 3:00 PM', text: 'Completed', target: 'Publish press kit' },
    ],
  },
  {
    id: 'p3', key: 'MOB', icon: '📱', name: 'Mobile App MVP',
    subtitle: 'Product · Mobile',
    description: 'iOS + Android MVP covering core task management flows, notifications, and offline sync.',
    owner: 'Rasya', oInit: 'R', oSeed: 'Rasya', oBg: 'b6e3f4',
    startDate: 'Jun 1, 2026', endDate: 'Oct 1, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'High', priorityColor: '#D97706',
    progress: 45, doneT: 9, totalT: 20,
    category: 'Mobile', labels: ['iOS', 'Android', 'Q4'],
    assignees: [
      { seed: 'Rasya', bg: 'b6e3f4', name: 'Rasya' },
      { seed: 'Rara', bg: 'f9a8d4', name: 'Rara' },
    ],
    quickLinks: [],
    tasks: [
      { id: 1, title: 'Set up React Native repo', done: true, date: 'Jun 5', assignee: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 2, title: 'Auth screens', done: true, date: 'Jun 15', assignee: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 3, title: 'Task list & detail screens', done: false, date: 'Jul 10', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
      { id: 4, title: 'Offline sync', done: false, date: 'Aug 15', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
    ],
    comments: [],
    attachments: [],
    activity: [
      { id: 1, author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 15 · 2:15 PM', text: 'Completed', target: 'Auth screens' },
    ],
  },
  {
    id: 'p4', key: 'ANL', icon: '📊', name: 'Analytics Dashboard',
    subtitle: 'Data & Reporting · Q3',
    description: 'Data & reporting suite for internal and external use, covering KPIs, charts, and export.',
    owner: 'Maya', oInit: 'M', oSeed: 'Maya', oBg: 'ffd5dc',
    startDate: 'May 1, 2026', endDate: 'Jul 5, 2025', endDateRed: true,
    statusLabel: 'At Risk', statusClass: 'cs-risk',
    priority: 'High', priorityColor: '#D97706',
    progress: 30, doneT: 4, totalT: 13, daysOverdue: 5,
    category: 'Data & Reporting', labels: ['Data', 'Q3'],
    assignees: [{ seed: 'Maya', bg: 'ffd5dc', name: 'Maya' }, { seed: 'Dito', bg: 'c0aede', name: 'Dito' }],
    quickLinks: [],
    tasks: [
      { id: 1, title: 'Define KPI schema', done: true, date: 'May 20', assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 2, title: 'Build chart components', done: false, date: 'Jun 30 · overdue', late: true, assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [],
    attachments: [],
    activity: [
      { id: 1, author: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669', time: 'Jun 18 · 10:00 AM', text: 'Flagged as', target: 'At Risk' },
    ],
  },
  {
    id: 'p5', key: 'CUS', icon: '🏠', name: 'Customer Portal',
    subtitle: 'Self-serve · Portal',
    description: 'Self-serve billing, profile, and account management portal for end customers.',
    owner: 'Rara', oInit: 'RR', oSeed: 'Rara', oBg: 'f9a8d4',
    startDate: 'Apr 1, 2026', endDate: 'Aug 1, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Low', priorityColor: '#16A34A',
    progress: 90, doneT: 18, totalT: 20,
    category: 'Self-serve', labels: ['Portal', 'Q3'],
    assignees: [{ seed: 'Rara', bg: 'f9a8d4', name: 'Rara' }],
    quickLinks: [],
    tasks: [
      { id: 1, title: 'Billing integration', done: true, date: 'Jun 1', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
      { id: 2, title: 'Profile management', done: true, date: 'Jun 10', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
      { id: 3, title: 'Final QA pass', done: false, date: 'Jul 25', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
    ],
    comments: [],
    attachments: [],
    activity: [{ id: 1, author: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777', time: 'Jun 10 · 3:00 PM', text: 'Completed', target: 'Profile management' }],
  },
  {
    id: 'p6', key: 'API', icon: '⚙️', name: 'API Gateway v2',
    subtitle: 'Infrastructure · Backend',
    description: 'Rate limiting, auth middleware, and routing redesign for the public API layer.',
    owner: 'Dito', oInit: 'D', oSeed: 'Dito', oBg: 'c0aede',
    startDate: 'May 1, 2026', endDate: 'Jun 30, 2025', endDateRed: true,
    statusLabel: 'Delayed', statusClass: 'cs-delayed',
    priority: 'High', priorityColor: '#D97706',
    progress: 15, doneT: 2, totalT: 12, daysOverdue: 10,
    category: 'Infrastructure', labels: ['API', 'Backend'],
    assignees: [{ seed: 'Dito', bg: 'c0aede', name: 'Dito' }, { seed: 'Maya', bg: 'ffd5dc', name: 'Maya' }],
    quickLinks: [],
    tasks: [
      { id: 1, title: 'Auth middleware spike', done: true, date: 'May 25', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
      { id: 2, title: 'Rate limiting impl', done: false, date: 'Jun 15 · overdue', late: true, assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [],
    attachments: [],
    activity: [{ id: 1, author: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626', time: 'Jun 22 · 9:00 AM', text: 'Marked project as', target: 'Delayed' }],
  },
  {
    id: 'p7', key: 'DS2', icon: '🎯', name: 'Design System v2',
    subtitle: 'Design · Q3',
    description: 'Component library, tokens, and documentation rollout for the full design system.',
    owner: 'Rasya', oInit: 'R', oSeed: 'Rasya', oBg: 'b6e3f4',
    startDate: 'Jun 1, 2026', endDate: 'Sep 15, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Medium', priorityColor: 'oklch(60.6% 0.25 292.717)',
    progress: 55, doneT: 6, totalT: 11,
    category: 'Design', labels: ['Design', 'Q4'],
    assignees: [
      { seed: 'Rasya', bg: 'b6e3f4', name: 'Rasya' },
      { seed: 'Rara', bg: 'f9a8d4', name: 'Rara' },
    ],
    quickLinks: [],
    tasks: [
      { id: 1, title: 'Token system setup', done: true, date: 'Jun 10', assignee: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 2, title: 'Core component library', done: false, date: 'Jul 30', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
    ],
    comments: [],
    attachments: [],
    activity: [{ id: 1, author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 10 · 11:00 AM', text: 'Completed', target: 'Token system setup' }],
  },
  {
    id: 'p8', key: 'INT', icon: '🔧', name: 'Internal Tools',
    subtitle: 'Operations · Design System',
    description: 'Tracker revamp and design system rollout for the internal product team.',
    owner: 'Rasya', oInit: 'R', oSeed: 'Rasya', oBg: 'b6e3f4',
    startDate: 'Jun 20, 2026', endDate: 'Sep 10, 2026',
    statusLabel: 'Not Started', statusClass: 'cs-new',
    priority: 'Low', priorityColor: '#16A34A',
    progress: 0, doneT: 0, totalT: 0,
    category: 'Operations', labels: [],
    assignees: [{ seed: 'Rasya', bg: 'b6e3f4', name: 'Rasya' }],
    quickLinks: [],
    tasks: [],
    comments: [],
    attachments: [],
    activity: [{ id: 1, author: 'Rasya', aInit: 'R', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 20 · 9:00 AM', text: 'Created project', target: 'Internal Tools' }],
  },
]

const proj = computed(() => db.find(p => p.id === id) ?? db[0])
const doneTasks = computed(() => proj.value.tasks.filter(t => t.done).length)
const leftTasks = computed(() => proj.value.totalT - proj.value.doneT)
const recentActivity = computed(() => proj.value.activity.slice(0, 2))
const avatarUrl = (seed: string, bg: string) =>
  `https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}&backgroundColor=${bg}&backgroundType=solid`

function progFillColor(sc: string) {
  if (sc === 'cs-track') return '#22C55E'
  if (sc === 'cs-risk') return '#F59E0B'
  if (sc === 'cs-delayed') return '#EF4444'
  if (sc === 'cs-medium') return 'oklch(60.6% 0.25 292.717)'
  return '#D1D5DB'
}

const editState = reactive({
  status: proj.value!.statusLabel,
  statusClass: proj.value!.statusClass,
  priority: proj.value!.priority,
  priorityColor: proj.value!.priorityColor,
  owner: proj.value!.owner,
  startDate: proj.value!.startDate,
  endDate: proj.value!.endDate,
  category: proj.value!.category,
  labels: [...proj.value!.labels],
})

function toggleEdit(field: string) {
  editingField.value = editingField.value === field ? null : field
}

function closeEdit() {
  editingField.value = null
}

const statusOptions = [
  { label: 'On Track',    cls: 'cs-track',   color: '#059669' },
  { label: 'At Risk',     cls: 'cs-risk',    color: '#DC2626' },
  { label: 'Delayed',     cls: 'cs-delayed', color: '#991B1B' },
  { label: 'Not Started', cls: 'cs-new',     color: '#6B7280' },
]

const priorityOptions = [
  { label: 'High',   color: '#D97706' },
  { label: 'Medium', color: 'oklch(60.6% 0.25 292.717)' },
  { label: 'Low',    color: '#16A34A' },
]

const userOptions = [
  { name: 'Rasya', seed: 'Rasya', bg: 'b6e3f4' },
  { name: 'Maya',  seed: 'Maya',  bg: 'ffd5dc' },
  { name: 'Dito',  seed: 'Dito',  bg: 'c0aede' },
  { name: 'Rara',  seed: 'Rara',  bg: 'f9a8d4' },
]

function setStatus(opt: typeof statusOptions[0]) {
  editState.status = opt.label
  editState.statusClass = opt.cls
  closeEdit()
}

function setPriority(opt: typeof priorityOptions[0]) {
  editState.priority = opt.label
  editState.priorityColor = opt.color
  closeEdit()
}

function setOwner(u: typeof userOptions[0]) {
  editState.owner = u.name
  closeEdit()
}

function ownerAvatar() {
  const u = userOptions.find(x => x.name === editState.owner)
  return u ? avatarUrl(u.seed, u.bg) : avatarUrl('Rasya', 'b6e3f4')
}

function handleOutsideClick() {
  editingField.value = null
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <!-- bleed out of layout px-6 py-5 -->
  <div style="margin:-20px -24px 0;display:flex;flex-direction:column;flex:1;min-height:0">

    <!-- ══ HEADER ══ -->
    <div class="pdh">

      <!-- crumb + actions -->
      <div class="pdh-top-row">
        <div class="pdh-crumb">
          <NuxtLink to="/projects" class="pdh-crumb-link">Projects</NuxtLink>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="pdh-crumb-cur">{{ proj.name }}</span>
        </div>
        <div class="pdh-actions">
          <button class="pdh-btn-ghost">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.5" fill="currentColor"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="13" r="1.5" fill="currentColor"/></svg>
          </button>
          <button class="pdh-btn-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
        </div>
      </div>

      <!-- title row: icon + name + subtitle -->
      <div class="pdh-title-row">
        <div class="pdh-icon">{{ proj.icon }}</div>
        <div>
          <div class="pdh-title">{{ proj.name }}</div>
          <div class="pdh-subtitle">{{ proj.subtitle }}</div>
        </div>
      </div>

      <!-- meta chips row -->
      <div class="pdh-meta">
        <span class="pdh-chip" :class="proj.statusClass">
          <span class="pdh-dot" :class="proj.statusClass + '-dot'"/>
          {{ proj.statusLabel }}
        </span>
        <span class="pdh-chip pdh-chip-priority" :style="{ color: proj.priorityColor, background: proj.priorityColor + '18' }">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
          {{ proj.priority }}
        </span>
        <span v-if="proj.labels.length" class="pdh-chip pdh-chip-labels">{{ proj.labels.join(', ') }}</span>
        <div class="pdh-prog-inline">
          <div class="pdh-prog-track">
            <div class="pdh-prog-fill" :style="{ width: proj.progress + '%', background: progFillColor(proj.statusClass) }"/>
          </div>
          <span class="pdh-prog-pct">{{ proj.progress }}%</span>
        </div>
        <div class="pdh-meta-date" :class="{ red: proj.endDateRed }">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          {{ proj.endDate }}
        </div>
        <div class="pdh-assignees-row">
          <div v-for="a in proj.assignees.slice(0, 4)" :key="a.seed" class="pdh-av-wrap">
            <img :src="avatarUrl(a.seed, a.bg)" :alt="a.name" class="pdh-av-img" :title="a.name">
          </div>
        </div>
      </div>

      <!-- tabs -->
      <div class="pdh-tabs">
        <button class="pdh-tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          Overview
        </button>
        <button class="pdh-tab" :class="{ active: activeTab === 'tasks' }" @click="activeTab = 'tasks'">
          Task
          <span class="pdh-tab-badge">{{ proj.tasks.length }}</span>
        </button>
        <button class="pdh-tab" :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">
          Activity
        </button>
        <button class="pdh-tab" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
          Comment
          <span class="pdh-tab-badge">{{ proj.comments.length }}</span>
        </button>
        <button class="pdh-tab" :class="{ active: activeTab === 'attachments' }" @click="activeTab = 'attachments'">
          Attachment
          <span class="pdh-tab-badge">{{ proj.attachments.length }}</span>
        </button>
      </div>
    </div>

    <!-- ══ BODY ══ -->
    <div class="pd-body">

      <!-- ── LEFT MAIN ── -->
      <div class="pd-main">

        <!-- ── OVERVIEW TAB ── -->
        <template v-if="activeTab === 'overview'">

          <!-- Description -->
          <div class="pd-section">
            <div class="pd-slabel">Description</div>
            <div class="pd-desc">{{ proj.description }}</div>
          </div>

          <!-- Quick Stats -->
          <div class="pd-section">
            <div class="pd-slabel">Quick Stats</div>
            <div class="pd-qs-grid">
              <!-- Tasks done -->
              <div class="pd-qs-card">
                <div class="pd-qs-num">{{ proj.doneT }}<span class="pd-qs-denom">/{{ proj.totalT }}</span></div>
                <div class="pd-qs-label">Tasks done</div>
              </div>
              <!-- Days overdue -->
              <div class="pd-qs-card pd-qs-card--danger" v-if="proj.daysOverdue">
                <div class="pd-qs-num danger">{{ proj.daysOverdue }}</div>
                <div class="pd-qs-label danger">Days overdue</div>
              </div>
              <div class="pd-qs-card" v-else>
                <div class="pd-qs-num green">On time</div>
                <div class="pd-qs-label">Schedule</div>
              </div>
              <!-- Complete % -->
              <div class="pd-qs-card">
                <div class="pd-qs-num purple">{{ proj.progress }}%</div>
                <div class="pd-qs-label">Complete</div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="pd-section">
            <div class="pd-act-hdr">
              <div class="pd-slabel" style="margin:0">Recent Activity</div>
              <button class="pd-see-all" @click="activeTab = 'activity'">See all</button>
            </div>
            <div v-if="recentActivity.length" class="pd-act-list">
              <div v-for="a in recentActivity" :key="a.id" class="pd-act-row">
                <img :src="avatarUrl(a.aInit === 'R' ? proj.assignees[0]?.seed ?? a.author : a.author, a.aBg.replace('#',''))" :alt="a.author" class="pd-act-av">
                <div class="pd-act-body">
                  <span class="pd-act-name">{{ a.author }}</span>
                  <span class="pd-act-time">· {{ a.time }}</span>
                  <div class="pd-act-text">
                    {{ a.text }}
                    <span v-if="a.target" class="pd-act-target">{{ a.target }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="pd-empty">No activity yet.</div>
          </div>

        </template>

        <!-- ── TASKS TAB ── -->
        <template v-if="activeTab === 'tasks'">
          <div class="pd-section">
            <div class="pd-task-hdr">
              <div class="pd-slabel" style="margin:0">Tasks</div>
              <div class="pd-task-prog">
                <div class="pd-tp-track"><div class="pd-tp-fill" :style="{ width: (proj.totalT ? Math.round(proj.doneT / proj.totalT * 100) : 0) + '%' }"/></div>
                <span class="pd-tp-txt">{{ proj.doneT }} / {{ proj.totalT }} done</span>
              </div>
            </div>
            <div class="pd-tasklist" v-if="proj.tasks.length">
              <div v-for="t in proj.tasks" :key="t.id" class="pd-task" :class="{ done: t.done }">
                <div class="pd-check" :class="{ checked: t.done }">
                  <svg v-if="t.done" width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="pd-tname">{{ t.title }}</span>
                <div class="pd-tmeta">
                  <span class="pd-tdate" :class="{ late: t.late }">{{ t.date }}</span>
                  <div class="pd-tassignee">
                    <div class="pd-tav" :style="{ background: t.aBg, color: t.aColor }">{{ t.aInit }}</div>
                    {{ t.assignee }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="pd-empty">No tasks yet.</div>
            <div class="pd-add-task">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              Add task
            </div>
          </div>
        </template>

        <!-- ── ACTIVITY TAB ── -->
        <template v-if="activeTab === 'activity'">
          <div class="pd-section">
            <div class="pd-slabel">Activity</div>
            <div v-if="proj.activity.length" class="pd-act-list">
              <div v-for="a in proj.activity" :key="a.id" class="pd-act-row">
                <div class="pd-act-av-init" :style="{ background: a.aBg, color: a.aColor }">{{ a.aInit }}</div>
                <div class="pd-act-body">
                  <span class="pd-act-name">{{ a.author }}</span>
                  <span class="pd-act-time">· {{ a.time }}</span>
                  <div class="pd-act-text">
                    {{ a.text }}
                    <span v-if="a.target" class="pd-act-target">{{ a.target }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="pd-empty">No activity yet.</div>
          </div>
        </template>

        <!-- ── COMMENTS TAB ── -->
        <template v-if="activeTab === 'comments'">
          <div class="pd-section">
            <div class="pd-slabel">Comments</div>
            <div v-for="(c, i) in proj.comments" :key="i" class="pd-comment">
              <div class="pd-cav" :style="{ background: c.aBg, color: c.aColor }">{{ c.aInit }}</div>
              <div class="pd-cbody">
                <div class="pd-chead">
                  <span class="pd-cauthor">{{ c.author }}</span>
                  <span class="pd-ctime">{{ c.time }}</span>
                </div>
                <div class="pd-ctext">{{ c.text }}</div>
              </div>
            </div>
            <div v-if="!proj.comments.length" class="pd-empty">No comments yet.</div>
            <div class="pd-cinput-row">
              <div class="pd-cav" style="background:#DBEAFE;color:#2563EB">R</div>
              <div class="pd-cinput">Add a comment…</div>
              <button class="pd-send">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-5 12-2-5-5-1z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </template>

        <!-- ── ATTACHMENTS TAB ── -->
        <template v-if="activeTab === 'attachments'">
          <div class="pd-section">
            <div class="pd-slabel">Attachments</div>
            <div v-if="proj.attachments.length" class="pd-attach-list">
              <div v-for="att in proj.attachments" :key="att.id" class="pd-attach-row">
                <div class="pd-attach-icon">
                  <svg v-if="att.type === 'figma'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#F24E1E"/><path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill="white"/></svg>
                  <svg v-else-if="att.type === 'notion'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#111"/><path d="M5 5h6M5 8h4M5 11h3" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="#9CA3AF" stroke-width="1.4"/><path d="M9 2v4h4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>
                </div>
                <div class="pd-attach-info">
                  <div class="pd-attach-name">{{ att.name }}</div>
                  <div class="pd-attach-size">{{ att.size }}</div>
                </div>
                <button class="pd-attach-dl">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v8M5 8l3 3 3-3M3 13h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
            <div v-else class="pd-empty">No attachments yet.</div>
            <div class="pd-add-task">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              Add attachment
            </div>
          </div>
        </template>

      </div>

      <!-- ── RIGHT SIDE PANEL ── -->
      <div class="pd-side">

        <!-- Properties Card -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr">
            <span class="pd-panel-title">Properties</span>
            <button class="pd-panel-btn">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- STATUS -->
          <div class="pd-prop-row" @click.stop="toggleEdit('status')">
            <div class="pd-prop-lbl">Status</div>
            <div class="pd-prop-val">
              <span class="pdh-chip" :class="editState.statusClass">
                <span class="pdh-dot" :class="editState.statusClass + '-dot'"/>
                {{ editState.status }}
              </span>
            </div>
          </div>
          <div v-if="editingField === 'status'" class="pd-dropdown">
            <div
              v-for="opt in statusOptions" :key="opt.label"
              class="pd-dd-item"
              @click.stop="setStatus(opt)"
            >
              <span class="pdh-chip" :class="opt.cls">
                <span class="pdh-dot" :class="opt.cls + '-dot'"/>
                {{ opt.label }}
              </span>
            </div>
          </div>

          <!-- PRIORITY -->
          <div class="pd-prop-row" @click.stop="toggleEdit('priority')">
            <div class="pd-prop-lbl">Priority</div>
            <div class="pd-prop-val" style="display:flex;align-items:center;gap:5px">
              <svg width="12" height="12" viewBox="0 0 16 16" :fill="editState.priorityColor">
                <path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/>
              </svg>
              <span style="font-size:12.5px;color:#111827">{{ editState.priority }}</span>
            </div>
          </div>
          <div v-if="editingField === 'priority'" class="pd-dropdown">
            <div
              v-for="opt in priorityOptions" :key="opt.label"
              class="pd-dd-item"
              @click.stop="setPriority(opt)"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" :fill="opt.color"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
              <span style="font-size:12.5px">{{ opt.label }}</span>
            </div>
          </div>

          <!-- OWNER -->
          <div class="pd-prop-row" @click.stop="toggleEdit('owner')">
            <div class="pd-prop-lbl">Owner</div>
            <div class="pd-prop-val" style="display:flex;align-items:center;gap:7px">
              <img :src="ownerAvatar()" :alt="editState.owner" style="width:20px;height:20px;border-radius:50%;object-fit:cover">
              <span style="font-size:12.5px;color:#111827">{{ editState.owner }}</span>
            </div>
          </div>
          <div v-if="editingField === 'owner'" class="pd-dropdown">
            <div
              v-for="u in userOptions" :key="u.name"
              class="pd-dd-item"
              @click.stop="setOwner(u)"
            >
              <img :src="avatarUrl(u.seed, u.bg)" :alt="u.name" style="width:20px;height:20px;border-radius:50%;object-fit:cover">
              <span style="font-size:12.5px">{{ u.name }}</span>
            </div>
          </div>

          <!-- START DATE -->
          <div class="pd-prop-row" @click.stop="toggleEdit('startDate')">
            <div class="pd-prop-lbl">Start</div>
            <div class="pd-prop-val" style="font-size:12.5px;color:#111827">
              {{ editState.startDate }}
            </div>
          </div>
          <div v-if="editingField === 'startDate'" class="pd-dropdown pd-dropdown--input">
            <input
              v-model="editState.startDate"
              type="text"
              placeholder="e.g. Jan 6, 2026"
              class="pd-dd-input"
              @keydown.enter="closeEdit"
              @keydown.escape="closeEdit"
              @click.stop
            >
            <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
          </div>

          <!-- DUE DATE -->
          <div class="pd-prop-row" @click.stop="toggleEdit('endDate')">
            <div class="pd-prop-lbl">Due</div>
            <div class="pd-prop-val" style="font-size:12.5px" :style="{ color: proj.endDateRed ? '#EF4444' : '#111827' }">
              {{ editState.endDate }}
            </div>
          </div>
          <div v-if="editingField === 'endDate'" class="pd-dropdown pd-dropdown--input">
            <input
              v-model="editState.endDate"
              type="text"
              placeholder="e.g. Aug 30, 2025"
              class="pd-dd-input"
              @keydown.enter="closeEdit"
              @keydown.escape="closeEdit"
              @click.stop
            >
            <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
          </div>

          <!-- CATEGORY -->
          <div class="pd-prop-row" @click.stop="toggleEdit('category')">
            <div class="pd-prop-lbl">Category</div>
            <div class="pd-prop-val" style="font-size:12.5px;color:#111827">{{ editState.category }}</div>
          </div>
          <div v-if="editingField === 'category'" class="pd-dropdown pd-dropdown--input">
            <input
              v-model="editState.category"
              type="text"
              placeholder="e.g. Core product"
              class="pd-dd-input"
              @keydown.enter="closeEdit"
              @keydown.escape="closeEdit"
              @click.stop
            >
            <button class="pd-dd-save" @click.stop="closeEdit">Save</button>
          </div>

          <!-- LABELS -->
          <div v-if="editState.labels.length" class="pd-prop-row" style="align-items:flex-start;padding-top:4px">
            <div class="pd-prop-lbl" style="padding-top:4px">Labels</div>
            <div class="pd-prop-val" style="display:flex;gap:4px;flex-wrap:wrap">
              <span v-for="lb in editState.labels" :key="lb" class="pd-label">{{ lb }}</span>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr">
            <span class="pd-panel-title">Progress</span>
          </div>
          <div class="pd-prog-nums">
            <div class="pd-prog-num-item">
              <div class="pd-prog-num">{{ proj.doneT }}</div>
              <div class="pd-prog-num-lbl">Done</div>
            </div>
            <div class="pd-prog-num-item">
              <div class="pd-prog-num">{{ leftTasks }}</div>
              <div class="pd-prog-num-lbl">Left</div>
            </div>
            <div class="pd-prog-num-item">
              <div class="pd-prog-num purple">{{ proj.progress }}%</div>
              <div class="pd-prog-num-lbl">Complete</div>
            </div>
          </div>
          <div class="pd-prog-bar-wrap">
            <div class="pd-prog-bar">
              <div class="pd-prog-bar-fill" :style="{ width: proj.progress + '%', background: progFillColor(proj.statusClass) }"/>
            </div>
          </div>
        </div>

        <!-- Assignees -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr">
            <span class="pd-panel-title">Assignees</span>
            <button class="pd-panel-btn">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="pd-assignees">
            <img
              v-for="a in proj.assignees"
              :key="a.seed"
              :src="avatarUrl(a.seed, a.bg)"
              :alt="a.name"
              :title="a.name"
              class="pd-av-lg"
            >
          </div>
        </div>

        <!-- Quick Links -->
        <div v-if="proj.quickLinks.length" class="pd-panel-sec">
          <div class="pd-panel-hdr">
            <span class="pd-panel-title">Quick links</span>
            <button class="pd-panel-btn">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="pd-ql-list">
            <a v-for="ql in proj.quickLinks" :key="ql.label" :href="ql.url" target="_blank" class="pd-ql-row">
              <div class="pd-ql-icon">
                <svg v-if="ql.icon === 'figma'" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="3" fill="#F24E1E"/><path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill="white"/></svg>
                <svg v-else-if="ql.icon === 'notion'" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="3" fill="#111"/><path d="M5 5h6M5 8h4" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="#9CA3AF" stroke-width="1.4"/></svg>
              </div>
              <span class="pd-ql-label">{{ ql.label }}</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" class="pd-ql-ext"><path d="M9 3H3m6 0v6M3 9l6-6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── HEADER ── */
.pdh { background:#fff; border-bottom:1px solid #E5E7EB; padding:18px 28px 0; flex-shrink:0; }

.pdh-top-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.pdh-crumb { display:flex; align-items:center; gap:6px; font-size:12px; color:#9CA3AF; }
.pdh-crumb-link { color:#6B7280; text-decoration:none; }
.pdh-crumb-link:hover { color:#111827; }
.pdh-crumb-cur { color:#111827; font-weight:500; }
.pdh-actions { display:flex; align-items:center; gap:6px; }
.pdh-btn-ghost { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px; border:1px solid #E5E7EB; background:transparent; color:#4B5563; cursor:pointer; }
.pdh-btn-ghost:hover { background:#F9FAFB; }
.pdh-btn-icon { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px; border:1px solid #E5E7EB; background:transparent; color:#4B5563; cursor:pointer; }
.pdh-btn-icon:hover { background:#F9FAFB; }

.pdh-title-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.pdh-icon { width:40px; height:40px; border-radius:10px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.pdh-title { font-size:19px; font-weight:600; letter-spacing:-0.02em; color:#111827; line-height:1.2; }
.pdh-subtitle { font-size:12px; color:#9CA3AF; margin-top:2px; }

/* meta chips */
.pdh-meta { display:flex; align-items:center; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
.pdh-chip { font-size:11px; font-weight:600; padding:3px 9px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; letter-spacing:0.01em; }
.cs-risk    { background:#FEF2F2; color:#DC2626; }
.cs-track   { background:#ECFDF5; color:#059669; }
.cs-high    { background:#FEF3C7; color:#D97706; }
.cs-medium  { background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); }
.cs-low     { background:#F0FDF4; color:#16A34A; }
.cs-delayed { background:#FEF2F2; color:#991B1B; }
.cs-new     { background:#F9FAFB; color:#6B7280; }
.pdh-chip-priority { font-weight:500; }
.pdh-chip-labels { background:#F3F4F6; color:#4B5563; font-weight:500; }

/* status dot */
.pdh-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.cs-risk-dot    { background:#DC2626; }
.cs-track-dot   { background:#059669; }
.cs-delayed-dot { background:#EF4444; }
.cs-new-dot     { background:#9CA3AF; }
.cs-high-dot    { background:#D97706; }
.cs-medium-dot  { background:oklch(60.6% 0.25 292.717); }
.cs-low-dot     { background:#16A34A; }

/* progress inline */
.pdh-prog-inline { display:flex; align-items:center; gap:7px; }
.pdh-prog-track { width:80px; height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pdh-prog-fill { height:100%; border-radius:2px; }
.pdh-prog-pct { font-size:12px; font-weight:500; color:#4B5563; }

.pdh-meta-date { display:flex; align-items:center; gap:5px; font-size:12px; color:#4B5563; }
.pdh-meta-date.red { color:#EF4444; font-weight:500; }
.pdh-meta-date svg { flex-shrink:0; }

.pdh-assignees-row { display:flex; align-items:center; }
.pdh-av-wrap { width:24px; height:24px; border-radius:50%; border:2px solid #fff; overflow:hidden; margin-left:-6px; }
.pdh-av-wrap:first-child { margin-left:0; }
.pdh-av-img { width:100%; height:100%; object-fit:cover; }

/* tabs */
.pdh-tabs { display:flex; align-items:center; gap:0; }
.pdh-tab { display:inline-flex; align-items:center; gap:5px; padding:0 4px; height:40px; margin-right:18px; background:transparent; border:none; border-bottom:2px solid transparent; font-size:13px; font-weight:500; color:#9CA3AF; cursor:pointer; font-family:inherit; transition:color .15s; white-space:nowrap; }
.pdh-tab:hover { color:#4B5563; }
.pdh-tab.active { color:oklch(60.6% 0.25 292.717); border-bottom-color:oklch(60.6% 0.25 292.717); }
.pdh-tab-badge { font-size:10px; font-weight:600; background:#F3F4F6; color:#9CA3AF; padding:1px 5px; border-radius:10px; }
.pdh-tab.active .pdh-tab-badge { background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); }

/* ── BODY LAYOUT ── */
.pd-body { flex:1; display:grid; grid-template-columns:1fr 260px; background:#F9FAFB; min-height:0; overflow:hidden; }
.pd-main { padding:24px 28px; overflow-y:auto; background:#fff; border-right:1px solid #E5E7EB; }
.pd-side {
  padding: 16px;
  overflow-y: auto;
  background: #F9FAFB;
}

/* section */
.pd-section { margin-bottom:28px; }
.pd-slabel { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; }

/* description */
.pd-desc { font-size:13.5px; line-height:1.7; color:#374151; }

/* quick stats */
.pd-qs-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; }
.pd-qs-card { border:1px solid #E5E7EB; border-radius:10px; padding:14px 16px; background:#fff; }
.pd-qs-card--danger { background:#FFF5F5; border-color:#FEE2E2; }
.pd-qs-num { font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.03em; line-height:1.2; }
.pd-qs-denom { font-size:14px; font-weight:500; color:#9CA3AF; }
.pd-qs-num.danger { color:#EF4444; }
.pd-qs-num.green  { font-size:16px; color:#22C55E; }
.pd-qs-num.purple { color:oklch(60.6% 0.25 292.717); }
.pd-qs-label { font-size:12px; color:#6B7280; margin-top:3px; }
.pd-qs-label.danger { color:#EF4444; }

/* recent activity header */
.pd-act-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pd-see-all { font-size:12px; font-weight:500; color:oklch(60.6% 0.25 292.717); background:none; border:none; cursor:pointer; padding:0; }
.pd-see-all:hover { text-decoration:underline; }

/* activity list */
.pd-act-list { display:flex; flex-direction:column; gap:14px; }
.pd-act-row { display:flex; align-items:flex-start; gap:10px; }
.pd-act-av { width:28px; height:28px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.pd-act-av-init { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-act-body { flex:1; }
.pd-act-name { font-size:12.5px; font-weight:600; color:#111827; }
.pd-act-time { font-size:11px; color:#9CA3AF; margin-left:5px; }
.pd-act-text { font-size:12.5px; color:#4B5563; margin-top:1px; }
.pd-act-target { font-style:italic; color:#111827; }

/* tasks */
.pd-task-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pd-task-prog { display:flex; align-items:center; gap:8px; }
.pd-tp-track { width:80px; height:3px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-tp-fill { height:100%; border-radius:2px; background:oklch(60.6% 0.25 292.717); }
.pd-tp-txt { font-size:11.5px; color:#9CA3AF; }
.pd-tasklist { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.pd-task { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #F3F4F6; cursor:pointer; }
.pd-task:last-child { border-bottom:none; }
.pd-task:hover { background:#F9FAFB; }
.pd-task.done { opacity:.5; }
.pd-check { width:16px; height:16px; border:1.5px solid #E5E7EB; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:#fff; }
.pd-check.checked { background:oklch(60.6% 0.25 292.717); border-color:oklch(60.6% 0.25 292.717); }
.pd-tname { flex:1; font-size:13px; color:#111827; }
.pd-task.done .pd-tname { text-decoration:line-through; color:#9CA3AF; }
.pd-tmeta { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.pd-tdate { font-size:11.5px; color:#9CA3AF; }
.pd-tdate.late { color:#DC2626; }
.pd-tassignee { display:flex; align-items:center; gap:5px; font-size:11.5px; color:#4B5563; }
.pd-tav { width:20px; height:20px; border-radius:50%; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-add-task { display:flex; align-items:center; gap:8px; padding:9px 14px; color:#9CA3AF; font-size:12.5px; cursor:pointer; border:1px solid #E5E7EB; border-top:none; border-radius:0 0 8px 8px; margin-top:-1px; }
.pd-add-task:hover { color:oklch(60.6% 0.25 292.717); background:oklch(96% 0.04 292.717); }

/* comments */
.pd-comment { display:flex; gap:10px; margin-bottom:14px; }
.pd-cav { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-cbody { flex:1; background:#F9FAFB; border:1px solid #F3F4F6; border-radius:8px; padding:10px 14px; }
.pd-chead { display:flex; align-items:baseline; gap:6px; margin-bottom:4px; }
.pd-cauthor { font-size:12.5px; font-weight:600; color:#111827; }
.pd-ctime { font-size:11px; color:#9CA3AF; }
.pd-ctext { font-size:13px; color:#4B5563; line-height:1.5; }
.pd-cinput-row { display:flex; gap:10px; align-items:center; margin-top:14px; }
.pd-cinput { flex:1; border:1px solid #E5E7EB; border-radius:8px; padding:9px 14px; font-size:13px; color:#9CA3AF; cursor:text; }
.pd-cinput:hover { border-color:#D1D5DB; }
.pd-send { width:32px; height:32px; background:oklch(60.6% 0.25 292.717); border:none; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.pd-send:hover { background:oklch(52% 0.27 292.717); }

/* attachments */
.pd-attach-list { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.pd-attach-row { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #F3F4F6; }
.pd-attach-row:last-child { border-bottom:none; }
.pd-attach-icon { width:28px; height:28px; border-radius:6px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-attach-info { flex:1; }
.pd-attach-name { font-size:12.5px; color:#111827; font-weight:500; }
.pd-attach-size { font-size:11px; color:#9CA3AF; }
.pd-attach-dl { width:24px; height:24px; border-radius:5px; border:1px solid #E5E7EB; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#6B7280; }
.pd-attach-dl:hover { background:#F3F4F6; }

/* empty state */
.pd-empty { font-size:13px; color:#9CA3AF; padding:12px 0; }

/* ── SIDE PANEL ── */
.pd-panel-sec {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.pd-panel-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.pd-panel-title { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#9CA3AF; }
.pd-panel-btn { width:20px; height:20px; border-radius:4px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#9CA3AF; }
.pd-panel-btn:hover { background:#F3F4F6; color:#4B5563; }

.pd-prop-row { display:flex; align-items:center; min-height:30px; border-radius:6px; padding:2px 4px; margin-bottom:1px; cursor:pointer; }
.pd-prop-row:hover { background:#F9FAFB; }
.pd-prop-lbl { width:72px; flex-shrink:0; font-size:11.5px; color:#9CA3AF; }
.pd-prop-val { flex:1; font-size:12.5px; color:#111827; padding:2px 6px; border-radius:4px; }
.pd-label { font-size:10.5px; background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); padding:2px 8px; border-radius:10px; font-weight:500; }

/* progress numbers */
.pd-prog-nums { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:8px; }
.pd-prog-num-item { text-align:center; }
.pd-prog-num { font-size:18px; font-weight:700; color:#111827; letter-spacing:-0.02em; }
.pd-prog-num.purple { color:oklch(60.6% 0.25 292.717); }
.pd-prog-num-lbl { font-size:10.5px; color:#9CA3AF; margin-top:1px; }
.pd-prog-bar-wrap { padding:0 2px; }
.pd-prog-bar { height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-prog-bar-fill { height:100%; border-radius:2px; transition:width .3s; }

/* assignees */
.pd-assignees { display:flex; gap:6px; flex-wrap:wrap; }
.pd-av-lg { width:30px; height:30px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 0 0 1px #E5E7EB; }

/* quick links */
.pd-ql-list { display:flex; flex-direction:column; gap:2px; }
.pd-ql-row { display:flex; align-items:center; gap:9px; padding:7px 8px; border-radius:7px; text-decoration:none; color:#111827; border:1px solid #F3F4F6; }
.pd-ql-row:hover { background:#F9FAFB; border-color:#E5E7EB; }
.pd-ql-icon { width:24px; height:24px; border-radius:5px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#F9FAFB; }
.pd-ql-label { flex:1; font-size:12.5px; color:#111827; }
.pd-ql-ext { color:#9CA3AF; flex-shrink:0; }
.pd-ql-row:hover .pd-ql-ext { color:oklch(60.6% 0.25 292.717); }

/* dropdown panel */
.pd-dropdown {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 4px;
  margin: 0 4px 8px;
  z-index: 10;
  position: relative;
}

.pd-dd-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: #111827;
}

.pd-dd-item:hover {
  background: #F9FAFB;
}

/* text input variant */
.pd-dropdown--input {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 8px;
}

.pd-dd-input {
  flex: 1;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
}

.pd-dd-input:focus {
  border-color: oklch(60.6% 0.25 292.717);
  box-shadow: 0 0 0 2px oklch(96% 0.04 292.717);
}

.pd-dd-save {
  padding: 5px 10px;
  background: oklch(60.6% 0.25 292.717);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.pd-dd-save:hover {
  background: oklch(52% 0.27 292.717);
}
</style>
