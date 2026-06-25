<script setup lang="ts">
definePageMeta({ layout: false, title: 'Project' })

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

const showSide = ref(true)
const openDropdown = ref<string | null>(null)
const collapsedSections = ref(new Set<string>())
const showAddAssignee = ref(false)
const showAddLink = ref(false)
const newLinkLabel = ref('')
const newLinkUrl = ref('')
const editingInline = ref<string | null>(null)
const inlineValue = ref('')

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
  assignees: proj.value!.assignees.map(a => ({ ...a })),
  quickLinks: proj.value!.quickLinks.map(l => ({ ...l })),
})

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

const availableAssignees = computed(() =>
  userOptions.filter(u => !editState.assignees.find(a => a.name === u.name))
)

function toggleDropdown(field: string, e: MouseEvent) {
  e.stopPropagation()
  openDropdown.value = openDropdown.value === field ? null : field
  editingInline.value = null
}

function closeAll() {
  openDropdown.value = null
  if (editingInline.value) saveInline()
  showAddAssignee.value = false
  showAddLink.value = false
}

function toggleSection(id: string) {
  if (collapsedSections.value.has(id)) collapsedSections.value.delete(id)
  else collapsedSections.value.add(id)
}

function setStatus(opt: typeof statusOptions[0]) {
  editState.status = opt.label
  editState.statusClass = opt.cls
  openDropdown.value = null
}

function setPriority(opt: typeof priorityOptions[0]) {
  editState.priority = opt.label
  editState.priorityColor = opt.color
  openDropdown.value = null
}

function setOwner(u: typeof userOptions[0]) {
  editState.owner = u.name
  openDropdown.value = null
}

function ownerAvatar() {
  const u = userOptions.find(x => x.name === editState.owner)
  return u ? avatarUrl(u.seed, u.bg) : avatarUrl('Rasya', 'b6e3f4')
}

function startInline(field: string, current: string, e: MouseEvent) {
  e.stopPropagation()
  openDropdown.value = null
  editingInline.value = field
  inlineValue.value = field === 'labels' ? editState.labels.join(', ') : current
  nextTick(() => {
    const el = document.getElementById('inline-' + field) as HTMLInputElement | null
    el?.focus(); el?.select()
  })
}

function saveInline() {
  const field = editingInline.value
  if (!field) return
  if (field === 'labels') {
    editState.labels = inlineValue.value.split(',').map(s => s.trim()).filter(Boolean)
  } else if (field === 'startDate') {
    editState.startDate = inlineValue.value
  } else if (field === 'endDate') {
    editState.endDate = inlineValue.value
  } else if (field === 'category') {
    editState.category = inlineValue.value
  }
  editingInline.value = null
}

function addAssignee(u: typeof userOptions[0]) {
  editState.assignees.push({ seed: u.seed, bg: u.bg, name: u.name })
  showAddAssignee.value = false
}

function removeAssignee(name: string) {
  const idx = editState.assignees.findIndex(a => a.name === name)
  if (idx !== -1) editState.assignees.splice(idx, 1)
}

function submitLink() {
  const label = newLinkLabel.value.trim()
  if (!label) return
  const url = newLinkUrl.value.trim()
  const icon = url.includes('figma') ? 'figma' : url.includes('notion') ? 'notion' : 'file'
  editState.quickLinks.push({ label, url, icon })
  newLinkLabel.value = ''
  newLinkUrl.value = ''
  showAddLink.value = false
}

function removeLink(idx: number) {
  editState.quickLinks.splice(idx, 1)
}

onMounted(() => document.addEventListener('click', closeAll))
onUnmounted(() => document.removeEventListener('click', closeAll))
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <AppHeader>
        <template #breadcrumb>
          <div class="pdh-crumb">
            <NuxtLink to="/projects" class="pdh-crumb-link">Projects</NuxtLink>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="pdh-crumb-cur">{{ proj.name }}</span>
          </div>
        </template>
      </AppHeader>
    </template>

    <!-- bleed out of layout px-6 py-5 -->
    <div style="margin:-20px -24px 0;display:flex;flex-direction:column;flex:1;min-height:0">

    <!-- ══ TWO-COLUMN LAYOUT ══ -->
    <div class="pd-layout" :class="{ 'pd-layout--collapsed': !showSide }">
    <div class="pd-left">

    <!-- ══ HEADER ══ -->
    <div class="pdh">

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
    </div><!-- /pd-body -->
    </div><!-- /pd-left -->

      <!-- ── RIGHT SIDE PANEL ── -->
      <div class="pd-side" v-show="showSide">
        <div class="pd-side-top">
          <button class="pd-side-toggle" @click="showSide = false" title="Hide panel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
              <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </button>
        </div>
        <div class="pd-side-card">

        <!-- ── PROPERTIES ── -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr" @click="toggleSection('props')">
            <div style="display:flex;align-items:center;gap:8px">
              <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('props') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="pd-panel-title">Properties</span>
            </div>
          </div>

          <div v-show="!collapsedSections.has('props')" class="pd-panel-body">
            <!-- STATUS -->
            <div class="pd-prop-row" @click.stop="toggleDropdown('status', $event)">
              <div class="pd-prop-lbl">Status</div>
              <div class="pd-prop-val pd-prop-dd-wrap">
                <span class="pdh-dot" :class="editState.statusClass + '-dot'"/>
                {{ editState.status }}
                <div v-if="openDropdown === 'status'" class="pd-float-dd" @click.stop>
                  <button v-for="opt in statusOptions" :key="opt.label" class="pd-dd-item" @click="setStatus(opt)">
                    <span class="pdh-dot" :class="opt.cls + '-dot'"/>
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- PRIORITY -->
            <div class="pd-prop-row" @click.stop="toggleDropdown('priority', $event)">
              <div class="pd-prop-lbl">Priority</div>
              <div class="pd-prop-val pd-prop-dd-wrap">
                <svg width="11" height="11" viewBox="0 0 16 16" :fill="editState.priorityColor"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
                <span :style="{ color: editState.priorityColor, fontWeight: 600 }">{{ editState.priority }}</span>
                <div v-if="openDropdown === 'priority'" class="pd-float-dd" @click.stop>
                  <button v-for="opt in priorityOptions" :key="opt.label" class="pd-dd-item" @click="setPriority(opt)">
                    <svg width="11" height="11" viewBox="0 0 16 16" :fill="opt.color"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
                    <span>{{ opt.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- OWNER -->
            <div class="pd-prop-row" @click.stop="toggleDropdown('owner', $event)">
              <div class="pd-prop-lbl">Owner</div>
              <div class="pd-prop-val pd-prop-dd-wrap">
                <img :src="ownerAvatar()" :alt="editState.owner" class="pd-owner-avatar">
                <span>{{ editState.owner }}</span>
                <div v-if="openDropdown === 'owner'" class="pd-float-dd" @click.stop>
                  <button v-for="u in userOptions" :key="u.name" class="pd-dd-item" @click="setOwner(u)">
                    <img :src="avatarUrl(u.seed, u.bg)" :alt="u.name" class="pd-owner-avatar">
                    {{ u.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- START -->
            <div class="pd-prop-row" @click.stop="startInline('startDate', editState.startDate, $event)">
              <div class="pd-prop-lbl">Start</div>
              <div class="pd-prop-val">
                <input v-if="editingInline === 'startDate'" :id="'inline-startDate'" v-model="inlineValue" class="pd-inline-input" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                <span v-else>{{ editState.startDate }}</span>
              </div>
            </div>

            <!-- DUE -->
            <div class="pd-prop-row" @click.stop="startInline('endDate', editState.endDate, $event)">
              <div class="pd-prop-lbl">Due</div>
              <div class="pd-prop-val">
                <input v-if="editingInline === 'endDate'" :id="'inline-endDate'" v-model="inlineValue" class="pd-inline-input pd-inline-input--red" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                <span v-else :class="{ 'pd-prop-val--red': proj.endDateRed }">{{ editState.endDate }}</span>
              </div>
            </div>

            <!-- CATEGORY -->
            <div class="pd-prop-row" @click.stop="startInline('category', editState.category, $event)">
              <div class="pd-prop-lbl">Category</div>
              <div class="pd-prop-val">
                <input v-if="editingInline === 'category'" :id="'inline-category'" v-model="inlineValue" class="pd-inline-input" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                <span v-else>{{ editState.category }}</span>
              </div>
            </div>

            <!-- LABELS -->
            <div class="pd-prop-row pd-prop-row--labels" @click.stop="startInline('labels', editState.labels.join(', '), $event)">
              <div class="pd-prop-lbl">Labels</div>
              <div class="pd-prop-val pd-prop-val--labels">
                <input v-if="editingInline === 'labels'" :id="'inline-labels'" v-model="inlineValue" class="pd-inline-input" placeholder="UX, Q3" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                <template v-else>
                  <span v-for="lb in editState.labels" :key="lb" class="pd-label">{{ lb }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- ── PROGRESS ── -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr" @click="toggleSection('prog')">
            <div style="display:flex;align-items:center;gap:8px">
              <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('prog') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="pd-panel-title">Progress</span>
            </div>
          </div>
          <div v-show="!collapsedSections.has('prog')" class="pd-panel-body">
            <div class="pd-prog-nums">
              <div class="pd-prog-num-item"><div class="pd-prog-num">{{ proj.doneT }}</div><div class="pd-prog-num-lbl">Done</div></div>
              <div class="pd-prog-num-item"><div class="pd-prog-num">{{ leftTasks }}</div><div class="pd-prog-num-lbl">Left</div></div>
              <div class="pd-prog-num-item"><div class="pd-prog-num pd-prog-num--blue">{{ proj.progress }}%</div><div class="pd-prog-num-lbl">Complete</div></div>
            </div>
            <div class="pd-prog-bar-wrap"><div class="pd-prog-bar"><div class="pd-prog-bar-fill" :style="{ width: proj.progress + '%' }"/></div></div>
          </div>
        </div>

        <!-- ── ASSIGNEES ── -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr" @click="toggleSection('assign')">
            <div style="display:flex;align-items:center;gap:8px">
              <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('assign') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="pd-panel-title">Assignees</span>
            </div>
            <div class="pd-panel-hdr-right pd-prop-dd-wrap" @click.stop>
              <button v-if="availableAssignees.length" class="pd-panel-btn" @click.stop="showAddAssignee = !showAddAssignee; showAddLink = false">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
              <div v-if="showAddAssignee" class="pd-float-dd pd-float-dd--left" @click.stop>
                <button v-for="u in availableAssignees" :key="u.name" class="pd-dd-item" @click="addAssignee(u)">
                  <img :src="avatarUrl(u.seed, u.bg)" :alt="u.name" class="pd-owner-avatar"> {{ u.name }}
                </button>
              </div>
            </div>
          </div>
          <div v-show="!collapsedSections.has('assign')" class="pd-panel-body">
            <div v-for="a in editState.assignees" :key="a.name" class="pd-assignee-row">
              <img :src="avatarUrl(a.seed, a.bg)" :alt="a.name" class="pd-av-lg">
              <span class="pd-assignee-name">{{ a.name }}</span>
              <button class="pd-assignee-remove" @click.stop="removeAssignee(a.name)" title="Remove">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ── QUICK LINKS ── -->
        <div class="pd-panel-sec">
          <div class="pd-panel-hdr" @click="toggleSection('ql')">
            <div style="display:flex;align-items:center;gap:8px">
              <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('ql') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="pd-panel-title">Quick links</span>
            </div>
            <button class="pd-panel-btn" @click.stop="showAddLink = !showAddLink; showAddAssignee = false">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div v-show="!collapsedSections.has('ql')" class="pd-panel-body">
            <div v-for="(ql, i) in editState.quickLinks" :key="ql.label" class="pd-ql-row group">
              <div class="pd-ql-icon">
                <svg v-if="ql.icon === 'figma'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#F24E1E"/><path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill="white"/></svg>
                <svg v-else-if="ql.icon === 'notion'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#111827"/><path d="M5 5h6M5 8h4" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="#9CA3AF" stroke-width="1.4"/></svg>
              </div>
              <span class="pd-ql-label">{{ ql.label }}</span>
              <button class="pd-ql-delete" @click.stop="removeLink(i)" title="Remove">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
              <a :href="ql.url" target="_blank" class="pd-ql-ext" @click.stop>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M12 4H4m8 0v8M4 12l8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
            <!-- Add link form -->
            <div v-if="showAddLink" class="pd-add-link-form" @click.stop>
              <input v-model="newLinkLabel" class="pd-add-link-input" placeholder="Label" @keydown.escape="showAddLink = false">
              <input v-model="newLinkUrl" class="pd-add-link-input" placeholder="URL" @keydown.enter="submitLink" @keydown.escape="showAddLink = false">
              <div class="pd-add-link-row">
                <button class="pd-add-link-submit" @click="submitLink">Add</button>
                <button class="pd-add-link-cancel" @click="showAddLink = false">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        </div><!-- /pd-side-card -->
      </div>

      <!-- reopen button when panel is hidden -->
      <button v-if="!showSide" class="pd-side-reopen" @click="showSide = true" title="Show panel">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4"/>
        </svg>
      </button>
    </div><!-- /pd-layout -->
  </div>
</NuxtLayout>
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
.pd-layout { flex:1; display:grid; grid-template-columns:1fr 300px; min-height:0; overflow:hidden; position:relative; background:#fff; }
.pd-layout--collapsed { grid-template-columns:1fr; }
.pd-left { display:flex; flex-direction:column; overflow:hidden; min-height:0; }
.pd-body { flex:1; overflow:hidden; display:flex; flex-direction:column; min-height:0; }
.pd-main { padding:24px 28px; overflow-y:auto; flex:1; }
.pd-side {
  padding: 18px 12px 16px;
  overflow-y: auto;
  background: #fff;
}
.pd-side-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.pd-side-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: #fff;
  color: #6B7280;
  cursor: pointer;
}
.pd-side-toggle:hover { background: #F3F4F6; color: #111827; }
.pd-side-card {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}
.pd-side-reopen {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: #fff;
  color: #6B7280;
  cursor: pointer;
}
.pd-side-reopen:hover { background: #F3F4F6; color: #111827; }

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
  padding: 14px 16px;
  border-top: 1px solid #E5E7EB;
}
.pd-panel-sec:first-child { border-top: none; }
.pd-panel-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.pd-panel-chevron { color:#6B7280; flex-shrink:0; }
.pd-panel-title { font-size:10.5px; font-weight:600; letter-spacing:0.06em; color:#9CA3AF; }
.pd-panel-btn { width:20px; height:20px; border-radius:4px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#6B7280; }
.pd-panel-btn:hover { background:#F3F4F6; color:#374151; }

.pd-prop-row { display:flex; align-items:center; justify-content:space-between; min-height:30px; border-radius:6px; padding:2px 4px; margin-bottom:1px; cursor:pointer; }
.pd-prop-row:hover { background:#F9FAFB; }
.pd-prop-row--labels { align-items:flex-start; padding-top:4px; }
.pd-prop-lbl { width:72px; flex-shrink:0; font-size:11.5px; font-weight:500; color:#9CA3AF; }
.pd-prop-row--labels .pd-prop-lbl { padding-top:4px; }
.pd-prop-val { font-size:12.5px; color:#111827; display:flex; align-items:center; }
.pd-prop-val--red { color:#EF4444; }
.pd-prop-val--priority { gap:5px; }
.pd-priority-icon { flex-shrink:0; }
.pd-priority-text { font-size:12.5px; font-weight:500; }
.pd-prop-val--owner { gap:7px; }
.pd-owner-avatar { width:20px; height:20px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.pd-owner-name { font-size:12.5px; color:#111827; }
.pd-prop-val--labels { gap:4px; flex-wrap:wrap; }
.pd-label { font-size:10.5px; background:#F3E8FF; color:#7C3AED; padding:2px 8px; border-radius:10px; font-weight:500; }

/* progress numbers */
.pd-prog-nums { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:8px; }
.pd-prog-num-item { text-align:center; }
.pd-prog-num { font-size:18px; font-weight:700; color:#111827; letter-spacing:-0.02em; }
.pd-prog-num--blue { color:#3B82F6; }
.pd-prog-num-lbl { font-size:10.5px; color:#9CA3AF; margin-top:1px; }
.pd-prog-bar-wrap { padding:0 2px; }
.pd-prog-bar { height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-prog-bar-fill { height:100%; border-radius:2px; transition:width .3s; background:#3B82F6; }

/* panel body spacing */
.pd-panel-body { display:flex; flex-direction:column; }

/* chevron collapse */
.pd-panel-chevron { color:#6B7280; flex-shrink:0; transition:transform .15s; }
.pd-panel-chevron.collapsed { transform:rotate(-90deg); }
.pd-panel-hdr { cursor:pointer; user-select:none; }
.pd-panel-hdr-right { position:relative; }

/* floating dropdown anchor */
.pd-prop-dd-wrap { position:relative; gap:6px; }
.pd-float-dd {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 160px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 4px;
  z-index: 100;
}
.pd-float-dd--left { right:auto; left:0; }

.pd-dd-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: #111827;
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
}
.pd-dd-item:hover { background: #F9FAFB; }

/* inline input */
.pd-inline-input {
  width: 100%;
  border: 1px solid oklch(60.6% 0.25 292.717);
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
  background: #fff;
  box-shadow: 0 0 0 2px oklch(96% 0.04 292.717);
}
.pd-inline-input--red { color:#EF4444; }

/* assignees */
.pd-assignees { display:flex; flex-direction:column; gap:10px; }
.pd-assignee-row { display:flex; align-items:center; gap:10px; position:relative; }
.pd-av-lg { width:30px; height:30px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 0 0 1px #E5E7EB; flex-shrink:0; }
.pd-assignee-name { flex:1; font-size:12.5px; color:#111827; }
.pd-assignee-remove {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
  padding: 0;
}
.pd-assignee-row:hover .pd-assignee-remove { display:flex; }
.pd-assignee-remove:hover { background:#FEE2E2; border-color:#FECACA; color:#DC2626; }

/* quick links */
.pd-ql-list { display:flex; flex-direction:column; gap:4px; }
.pd-ql-row { display:flex; align-items:center; gap:8px; padding:6px 4px; border-radius:6px; color:#111827; }
.pd-ql-row:hover { background:#F9FAFB; }
.pd-ql-icon { width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#F9FAFB; }
.pd-ql-label { flex:1; font-size:12.5px; color:#111827; }
.pd-ql-delete {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
  padding: 0;
}
.pd-ql-row:hover .pd-ql-delete { display:flex; }
.pd-ql-delete:hover { background:#FEE2E2; border-color:#FECACA; color:#DC2626; }
.pd-ql-ext { color:#9CA3AF; flex-shrink:0; text-decoration:none; display:flex; align-items:center; }
.pd-ql-ext:hover { color:#6B7280; }

/* add link form */
.pd-add-link-form { display:flex; flex-direction:column; gap:6px; padding:8px 4px 4px; border-top:1px solid #F3F4F6; margin-top:4px; }
.pd-add-link-input {
  width: 100%;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
.pd-add-link-input:focus { border-color:oklch(60.6% 0.25 292.717); box-shadow:0 0 0 2px oklch(96% 0.04 292.717); }
.pd-add-link-row { display:flex; gap:6px; }
.pd-add-link-submit { flex:1; padding:5px 0; background:oklch(60.6% 0.25 292.717); color:#fff; border:none; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; }
.pd-add-link-submit:hover { background:oklch(52% 0.27 292.717); }
.pd-add-link-cancel { flex:1; padding:5px 0; background:#F3F4F6; color:#4B5563; border:none; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; }
.pd-add-link-cancel:hover { background:#E5E7EB; }
</style>
