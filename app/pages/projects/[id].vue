// styled: agent-2
<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Project', middleware: 'auth' })

const route = useRoute()
const id = route.params.id as string
const activeTab = ref('overview')

interface PTask { id: number; title: string; done: boolean; date: string; late?: boolean; assignee: string; aInit: string; aBg: string; aColor: string }
interface PComment { author: string; aInit: string; aBg: string; aColor: string; time: string; text: string }
interface PProject {
  id: string; key: string; name: string; description: string
  owner: string; oInit: string; oBg: string; oColor: string
  dateRange: string; endDate: string; createdDate: string
  statusLabel: string; statusClass: string
  priority: string; priorityClass: string
  progress: number; openTasks: number; doneTasksCount: number
  category: string; labels: string[]
  figma?: string; notion?: string
  tasks: PTask[]; comments: PComment[]
}

const db: PProject[] = [
  {
    id: 'p1', key: 'ALPHA', name: 'Alpha Project',
    description: 'Redesigning core product UX to improve activation, retention, and time-to-value across the entire product surface.',
    owner: 'Dito', oInit: 'D', oBg: '#FEE2E2', oColor: '#DC2626',
    dateRange: 'Jun 1 – Aug 30', endDate: 'Aug 30, 2026', createdDate: 'Jun 1, 2026',
    statusLabel: 'At Risk', statusClass: 'cs-risk',
    priority: 'High', priorityClass: 'cs-high',
    progress: 62, openTasks: 14, doneTasksCount: 9,
    category: 'Core product', labels: ['UX', 'Q3'],
    figma: 'figma.com/alpha', notion: 'notion.so/alpha-brief',
    tasks: [
      { id: 1, title: 'Finalize user research synthesis', done: false, date: 'Oct 6', assignee: 'Rasya', aInit: 'RA', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 2, title: 'Draft information architecture', done: false, date: 'Jun 15', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
      { id: 3, title: 'Produce high-fidelity mockups', done: false, date: 'Jul 1 · overdue', late: true, assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 4, title: 'Handoff to engineering', done: true, date: 'Jul 15', assignee: 'Rasya', aInit: 'RA', aBg: '#DBEAFE', aColor: '#2563EB' },
    ],
    comments: [
      { author: 'Rasya', aInit: 'RA', aBg: '#DBEAFE', aColor: '#2563EB', time: 'Jun 17 · 10:30am', text: "Let's keep scope tight for v1 and ship a research-backed MVP." },
      { author: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626', time: 'Jun 17 · 11:05am', text: "Agreed. I'll update the IA doc by EOD." },
    ],
  },
  {
    id: 'p2', key: 'BETA', name: 'Beta Launch',
    description: 'Public launch milestone for Q3, including marketing site, press kit, and early-access onboarding.',
    owner: 'Maya', oInit: 'M', oBg: '#D1FAE5', oColor: '#059669',
    dateRange: 'May 20 – Jul 15', endDate: 'Jul 15, 2026', createdDate: 'May 20, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Medium', priorityClass: 'cs-medium',
    progress: 78, openTasks: 9, doneTasksCount: 7,
    category: 'Launch', labels: ['Launch', 'Q3'],
    notion: 'notion.so/beta-launch',
    tasks: [
      { id: 1, title: 'Publish press kit', done: true, date: 'Jun 20', assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 2, title: 'Finalize onboarding flow', done: false, date: 'Jul 5', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [
      { author: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669', time: 'Jun 17 · 9:00am', text: 'Press kit is ready for review.' },
    ],
  },
  {
    id: 'p3', key: 'MOB', name: 'Mobile App MVP',
    description: 'iOS + Android MVP covering core task management flows, notifications, and offline sync.',
    owner: 'Lintang', oInit: 'LN', oBg: '#a5f3fc', oColor: '#0891B2',
    dateRange: 'Jun 1 – Oct 1', endDate: 'Oct 1, 2026', createdDate: 'Jun 1, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'High', priorityClass: 'cs-high',
    progress: 45, openTasks: 20, doneTasksCount: 9,
    category: 'Mobile', labels: ['iOS', 'Android', 'Q4'],
    tasks: [
      { id: 1, title: 'Set up React Native repo', done: true, date: 'Jun 5', assignee: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2' },
      { id: 2, title: 'Auth screens', done: true, date: 'Jun 15', assignee: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2' },
      { id: 3, title: 'Task list & detail screens', done: false, date: 'Jul 10', assignee: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2' },
      { id: 4, title: 'Offline sync', done: false, date: 'Aug 15', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [
      { author: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2', time: 'Jun 22 · 2:15pm', text: 'Auth screens done. Moving to task list view this week.' },
    ],
  },
  {
    id: 'p4', key: 'ANL', name: 'Analytics Dashboard',
    description: 'Data & reporting suite for internal and external use, covering KPIs, charts, and export.',
    owner: 'Maya', oInit: 'M', oBg: '#D1FAE5', oColor: '#059669',
    dateRange: 'May 1 – Jul 5', endDate: 'Jul 5, 2026', createdDate: 'May 1, 2026',
    statusLabel: 'At Risk', statusClass: 'cs-risk',
    priority: 'High', priorityClass: 'cs-high',
    progress: 30, openTasks: 13, doneTasksCount: 4,
    category: 'Data & Reporting', labels: ['Data', 'Q3'],
    tasks: [
      { id: 1, title: 'Define KPI schema', done: true, date: 'May 20', assignee: 'Maya', aInit: 'M', aBg: '#D1FAE5', aColor: '#059669' },
      { id: 2, title: 'Build chart components', done: false, date: 'Jun 30 · overdue', late: true, assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [],
  },
  {
    id: 'p5', key: 'CUS', name: 'Customer Portal',
    description: 'Self-serve billing, profile, and account management portal for end customers.',
    owner: 'Lintang', oInit: 'LN', oBg: '#a5f3fc', oColor: '#0891B2',
    dateRange: 'Apr 1 – Aug 1', endDate: 'Aug 1, 2026', createdDate: 'Apr 1, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Low', priorityClass: 'cs-low',
    progress: 90, openTasks: 20, doneTasksCount: 18,
    category: 'Self-serve', labels: ['Portal', 'Q3'],
    tasks: [
      { id: 1, title: 'Billing integration', done: true, date: 'Jun 1', assignee: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2' },
      { id: 2, title: 'Profile management', done: true, date: 'Jun 10', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
      { id: 3, title: 'Final QA pass', done: false, date: 'Jul 25', assignee: 'Rara', aInit: 'RR', aBg: '#f9a8d4', aColor: '#DB2777' },
    ],
    comments: [],
  },
  {
    id: 'p6', key: 'API', name: 'API Gateway v2',
    description: 'Rate limiting, auth middleware, and routing redesign for the public API layer.',
    owner: 'Dito', oInit: 'D', oBg: '#FEE2E2', oColor: '#DC2626',
    dateRange: 'May 1 – Jun 30', endDate: 'Jun 30, 2026', createdDate: 'May 1, 2026',
    statusLabel: 'Delayed', statusClass: 'cs-delayed',
    priority: 'High', priorityClass: 'cs-high',
    progress: 15, openTasks: 12, doneTasksCount: 2,
    category: 'Infrastructure', labels: ['API', 'Backend'],
    tasks: [
      { id: 1, title: 'Auth middleware spike', done: true, date: 'May 25', assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
      { id: 2, title: 'Rate limiting impl', done: false, date: 'Jun 15 · overdue', late: true, assignee: 'Dito', aInit: 'D', aBg: '#FEE2E2', aColor: '#DC2626' },
    ],
    comments: [],
  },
  {
    id: 'p7', key: 'DS2', name: 'Design System v2',
    description: 'Component library, tokens, and documentation rollout for the full design system.',
    owner: 'Rasya', oInit: 'RA', oBg: '#DBEAFE', oColor: '#2563EB',
    dateRange: 'Jun 1 – Sep 15', endDate: 'Sep 15, 2026', createdDate: 'Jun 1, 2026',
    statusLabel: 'On Track', statusClass: 'cs-track',
    priority: 'Medium', priorityClass: 'cs-medium',
    progress: 55, openTasks: 11, doneTasksCount: 6,
    category: 'Design', labels: ['Design', 'Q4'],
    tasks: [
      { id: 1, title: 'Token system setup', done: true, date: 'Jun 10', assignee: 'Rasya', aInit: 'RA', aBg: '#DBEAFE', aColor: '#2563EB' },
      { id: 2, title: 'Core component library', done: false, date: 'Jul 30', assignee: 'Lintang', aInit: 'LN', aBg: '#a5f3fc', aColor: '#0891B2' },
    ],
    comments: [],
  },
  {
    id: 'p8', key: 'INT', name: 'Internal Tools',
    description: 'Tracker revamp and design system rollout for the internal product team.',
    owner: 'Rasya', oInit: 'RA', oBg: '#DBEAFE', oColor: '#2563EB',
    dateRange: 'Sep 10, 2026', endDate: 'Sep 10, 2026', createdDate: 'Jun 20, 2026',
    statusLabel: 'Not Started', statusClass: 'cs-new',
    priority: 'Low', priorityClass: 'cs-low',
    progress: 0, openTasks: 0, doneTasksCount: 0,
    category: 'Operations', labels: [],
    tasks: [],
    comments: [],
  },
]

const proj = computed(() => db.find(p => p.id === id) ?? db[0])
const doneTasks = computed(() => proj.value.tasks.filter(t => t.done).length)
const taskPct = computed(() => proj.value.tasks.length ? Math.round((doneTasks.value / proj.value.tasks.length) * 100) : 0)
</script>

<template>
  <!-- bleed out of layout px-6 py-5 -->
  <div style="margin:-20px -24px 0;display:flex;flex-direction:column;flex:1">

    <!-- PROJECT HEADER -->
    <div class="pdh">
      <div class="pdh-title-row">
        <div>
          <div class="pdh-crumb">
            <NuxtLink to="/projects" class="pdh-crumb-link">Projects</NuxtLink>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="pdh-crumb-cur">{{ proj.name }}</span>
          </div>
          <div class="pdh-title">{{ proj.name }}</div>
        </div>
        <div class="pdh-actions">
          <button class="pdh-btn-ghost">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.5" fill="currentColor"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="13" r="1.5" fill="currentColor"/></svg>
            More
          </button>
          <button class="pdh-btn-primary">Save changes</button>
        </div>
      </div>

      <div class="pdh-meta">
        <div class="pdh-meta-item">
          <div class="pdh-av" :style="{ background: proj.oBg, color: proj.oColor }">{{ proj.oInit }}</div>
          <span>{{ proj.owner }}</span>
        </div>
        <div class="pdh-meta-item">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>
          {{ proj.dateRange }}
        </div>
        <span class="pdh-chip" :class="proj.statusClass">{{ proj.statusLabel }}</span>
        <span class="pdh-chip" :class="proj.priorityClass">{{ proj.priority }} Priority</span>
        <div class="pdh-prog-row">
          <div class="pdh-prog-track"><div class="pdh-prog-fill" :class="proj.statusClass" :style="{ width: proj.progress + '%' }"/></div>
          <span class="pdh-prog-pct">{{ proj.progress }}%</span>
        </div>
      </div>

      <!-- TABS -->
      <div class="pdh-tabs">
        <div class="pdh-tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 8h6M5 5.5h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Overview
        </div>
        <div class="pdh-tab" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 5 6-5M2 4h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" stroke="currentColor" stroke-width="1.4"/></svg>
          Comments
          <span class="pdh-tab-badge">{{ proj.comments.length }}</span>
        </div>
        <div class="pdh-tab" :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3.5l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Activity
        </div>
        <div class="pdh-tab" :class="{ active: activeTab === 'attachments' }" @click="activeTab = 'attachments'">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="currentColor" stroke-width="1.4"/><path d="M9 2v4h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Attachments
          <span class="pdh-tab-badge">2</span>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="pd-body">

      <!-- LEFT -->
      <div class="pd-main">

        <!-- Description -->
        <div class="pd-section">
          <div class="pd-slabel">Description</div>
          <div class="pd-desc">{{ proj.description }}</div>
        </div>

        <!-- Sub Tasks -->
        <div class="pd-section">
          <div class="pd-task-hdr">
            <div class="pd-slabel" style="margin-bottom:0">Sub Tasks</div>
            <div class="pd-task-prog">
              <div class="pd-tp-track"><div class="pd-tp-fill" :style="{ width: taskPct + '%' }"/></div>
              <span class="pd-tp-txt">{{ doneTasks }} / {{ proj.tasks.length }} done · {{ taskPct }}%</span>
            </div>
          </div>

          <div class="pd-tasklist">
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
            <div v-if="proj.tasks.length === 0" class="pd-task-empty">No tasks yet.</div>
          </div>
          <div class="pd-add-task">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            Add sub task
          </div>
        </div>

        <!-- Comments -->
        <div class="pd-section">
          <div class="pd-slabel">Comments</div>
          <div v-for="(c, i) in proj.comments" :key="i" class="pd-comment">
            <div class="pd-cav" :style="{ background: c.aBg, color: c.aColor }">{{ c.aInit }}</div>
            <div class="pd-cbody">
              <div class="pd-chead"><span class="pd-cauthor">{{ c.author }}</span><span class="pd-ctime">{{ c.time }}</span></div>
              <div class="pd-ctext">{{ c.text }}</div>
            </div>
          </div>
          <div v-if="proj.comments.length === 0" class="pd-comment-empty">No comments yet.</div>
          <div class="pd-cinput-row">
            <div class="pd-cav" style="background:#DBEAFE;color:#2563EB">RA</div>
            <div class="pd-cinput">Add a comment...</div>
            <div class="pd-send">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-5 12-2-5-5-1z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT: PROPERTIES -->
      <div class="pd-side">
        <div class="pd-prop-sec-lbl">Properties</div>

        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 8l2 2 4-4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Status</div>
          <div class="pd-prop-val"><span class="pdh-chip" :class="proj.statusClass">{{ proj.statusLabel }}</span></div>
        </div>
        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4h4.5l-3.5 2.5 1 4L8 10l-3.5 2.5 1-4L2 6h4.5L8 2z" stroke="#9CA3AF" stroke-width="1.4" stroke-linejoin="round"/></svg>Priority</div>
          <div class="pd-prop-val"><span class="pdh-chip" :class="proj.priorityClass">{{ proj.priority }}</span></div>
        </div>
        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5.5" r="2.5" stroke="#9CA3AF" stroke-width="1.4"/><path d="M1 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>Owner</div>
          <div class="pd-prop-val" style="display:flex;align-items:center;gap:6px">
            <div class="pd-tav" :style="{ background: proj.oBg, color: proj.oColor }">{{ proj.oInit }}</div>
            {{ proj.owner }}
          </div>
        </div>
        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>End Date</div>
          <div class="pd-prop-val">{{ proj.endDate }}</div>
        </div>
        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>Created</div>
          <div class="pd-prop-val muted">{{ proj.createdDate }}</div>
        </div>
        <div class="pd-prop-row">
          <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h6" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>Category</div>
          <div class="pd-prop-val">{{ proj.category }}</div>
        </div>
        <div v-if="proj.labels.length" class="pd-prop-row" style="align-items:flex-start">
          <div class="pd-prop-lbl" style="padding-top:8px"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8h10M9 5l3 3-3 3" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Labels</div>
          <div class="pd-prop-val" style="display:flex;gap:4px;flex-wrap:wrap;padding-top:6px">
            <span v-for="lb in proj.labels" :key="lb" class="pd-label">{{ lb }}</span>
          </div>
        </div>

        <div class="pd-divider"/>

        <div class="pd-prop-sec-lbl">Progress</div>
        <div class="pd-prop-row" style="cursor:default">
          <div class="pd-progress-block">
            <div class="pd-prog-bar"><div class="pd-prog-bar-fill" :style="{ width: proj.progress + '%' }"/></div>
            <div class="pd-prog-lbl">{{ proj.progress }}% complete · {{ proj.openTasks - proj.doneTasksCount }} open tasks</div>
          </div>
        </div>

        <template v-if="proj.figma || proj.notion">
          <div class="pd-divider"/>
          <div class="pd-prop-sec-lbl">Links</div>
          <div v-if="proj.figma" class="pd-prop-row">
            <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M7 9a3 3 0 0 0 4.12.12l2-2a3 3 0 0 0-4.24-4.24l-1.12 1.12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/><path d="M9 7a3 3 0 0 0-4.12-.12l-2 2a3 3 0 0 0 4.24 4.24l1.12-1.12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>Figma</div>
            <div class="pd-prop-val pd-link" style="display:flex;align-items:center;gap:4px;font-size:12px">
              {{ proj.figma }}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M9 3H3m6 0v6M3 9l6-6" stroke="oklch(60.6% 0.25 292.717)" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
          </div>
          <div v-if="proj.notion" class="pd-prop-row">
            <div class="pd-prop-lbl"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 6h6M5 9h4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>Notion</div>
            <div class="pd-prop-val pd-link" style="display:flex;align-items:center;gap:4px;font-size:12px">
              {{ proj.notion }}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M9 3H3m6 0v6M3 9l6-6" stroke="oklch(60.6% 0.25 292.717)" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── HEADER ── */
.pdh { background:#fff; border-bottom:1px solid #E5E7EB; padding:20px 32px 0; flex-shrink:0; }
.pdh-crumb { display:flex; align-items:center; gap:6px; font-size:12px; color:#9CA3AF; margin-bottom:8px; }
.pdh-crumb-link { color:#6B7280; text-decoration:none; }
.pdh-crumb-link:hover { color:#111827; }
.pdh-crumb-cur { color:#111827; font-weight:500; }
.pdh-title-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
.pdh-title { font-size:20px; font-weight:600; letter-spacing:-0.025em; color:#111827; line-height:1.2; }
.pdh-actions { display:flex; align-items:center; gap:8px; }
.pdh-btn-ghost { display:inline-flex; align-items:center; gap:5px; padding:0 12px; height:30px; border-radius:6px; font-size:12.5px; font-weight:500; cursor:pointer; border:1px solid #E5E7EB; background:transparent; color:#4B5563; font-family:inherit; }
.pdh-btn-ghost:hover { background:#F9FAFB; }
.pdh-btn-primary { display:inline-flex; align-items:center; gap:5px; padding:0 12px; height:30px; border-radius:6px; font-size:12.5px; font-weight:500; cursor:pointer; border:none; background:oklch(60.6% 0.25 292.717); color:#fff; font-family:inherit; }
.pdh-btn-primary:hover { background:oklch(52% 0.27 292.717); }

/* meta row */
.pdh-meta { display:flex; align-items:center; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
.pdh-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#4B5563; }
.pdh-av { width:20px; height:20px; border-radius:50%; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* chips */
.pdh-chip { font-size:11px; font-weight:600; padding:2px 8px; border-radius:5px; letter-spacing:0.01em; }
.cs-risk    { background:#FEF2F2; color:#DC2626; }
.cs-track   { background:#ECFDF5; color:#059669; }
.cs-high    { background:#FEF3C7; color:#D97706; }
.cs-medium  { background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); }
.cs-low     { background:#F0FDF4; color:#16A34A; }
.cs-delayed { background:#FEF2F2; color:#991B1B; }
.cs-new     { background:#F9FAFB; color:#6B7280; }

/* progress inline */
.pdh-prog-row { display:flex; align-items:center; gap:8px; }
.pdh-prog-track { width:80px; height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pdh-prog-fill { height:100%; border-radius:2px; }
.pdh-prog-fill.cs-risk { background:#DC2626; }
.pdh-prog-fill.cs-track { background:#22C55E; }
.pdh-prog-fill.cs-delayed { background:#EF4444; }
.pdh-prog-fill.cs-new { background:#D1D5DB; }
.pdh-prog-fill.cs-medium { background:oklch(60.6% 0.25 292.717); }
.pdh-prog-pct { font-size:12px; font-weight:500; color:#4B5563; }

/* tabs */
.pdh-tabs { display:flex; align-items:center; border-top:1px solid #F3F4F6; margin-top:4px; }
.pdh-tab { display:flex; align-items:center; gap:5px; padding:0 2px; height:38px; margin-right:20px; font-size:12.5px; font-weight:500; color:#9CA3AF; cursor:pointer; border-bottom:2px solid transparent; user-select:none; }
.pdh-tab:hover { color:#4B5563; }
.pdh-tab.active { color:oklch(60.6% 0.25 292.717); border-bottom-color:oklch(60.6% 0.25 292.717); }
.pdh-tab-badge { font-size:10px; font-weight:600; background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); padding:1px 5px; border-radius:10px; }
.pdh-tab:not(.active) .pdh-tab-badge { background:#F3F4F6; color:#9CA3AF; }

/* ── BODY ── */
.pd-body { flex:1; display:grid; grid-template-columns:1fr 280px; background:#F9FAFB; }
.pd-main { padding:24px 32px; border-right:1px solid #E5E7EB; background:#fff; }
.pd-side { padding:20px; background:#fff; }

/* sections */
.pd-section { margin-bottom:28px; }
.pd-slabel { font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#9CA3AF; margin-bottom:12px; }

/* description */
.pd-desc { font-size:13.5px; line-height:1.65; color:#4B5563; padding:14px 16px; border:1px solid #E5E7EB; border-radius:8px; min-height:80px; cursor:text; }
.pd-desc:hover { border-color:#D1D5DB; }

/* task sub-header */
.pd-task-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.pd-task-prog { display:flex; align-items:center; gap:8px; }
.pd-tp-track { width:100px; height:3px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-tp-fill { height:100%; border-radius:2px; background:oklch(60.6% 0.25 292.717); }
.pd-tp-txt { font-size:11.5px; color:#9CA3AF; }

/* task list */
.pd-tasklist { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.pd-task { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #F3F4F6; cursor:pointer; }
.pd-task:last-child { border-bottom:none; }
.pd-task:hover { background:#F9FAFB; }
.pd-task.done { opacity:.55; }
.pd-task-empty { padding:16px 14px; color:#9CA3AF; font-size:13px; }
.pd-check { width:16px; height:16px; border:1.5px solid #E5E7EB; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer; background:#fff; }
.pd-check:hover { border-color:oklch(60.6% 0.25 292.717); }
.pd-check.checked { background:oklch(60.6% 0.25 292.717); border-color:oklch(60.6% 0.25 292.717); }
.pd-tname { flex:1; font-size:13px; color:#111827; }
.pd-task.done .pd-tname { text-decoration:line-through; color:#9CA3AF; }
.pd-tmeta { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.pd-tdate { font-size:11.5px; color:#9CA3AF; }
.pd-tdate.late { color:#DC2626; }
.pd-tassignee { display:flex; align-items:center; gap:5px; font-size:11.5px; color:#4B5563; }
.pd-tav { width:20px; height:20px; border-radius:50%; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-add-task { display:flex; align-items:center; gap:8px; padding:9px 14px; color:#9CA3AF; font-size:12.5px; cursor:pointer; border:1px solid #E5E7EB; border-top:none; border-radius:0 0 8px 8px; }
.pd-add-task:hover { color:oklch(60.6% 0.25 292.717); background:oklch(96% 0.04 292.717); }

/* comments */
.pd-comment { display:flex; gap:10px; margin-bottom:16px; }
.pd-comment-empty { color:#9CA3AF; font-size:13px; margin-bottom:16px; }
.pd-cav { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-cbody { flex:1; background:#fff; border:1px solid #E5E7EB; border-radius:8px; padding:10px 14px; }
.pd-chead { display:flex; align-items:baseline; gap:6px; margin-bottom:5px; }
.pd-cauthor { font-size:12.5px; font-weight:600; }
.pd-ctime { font-size:11px; color:#9CA3AF; }
.pd-ctext { font-size:13px; color:#4B5563; line-height:1.5; }
.pd-cinput-row { display:flex; gap:10px; align-items:flex-start; margin-top:16px; }
.pd-cinput { flex:1; border:1px solid #E5E7EB; border-radius:8px; padding:9px 14px; font-size:13px; color:#9CA3AF; cursor:text; min-height:40px; }
.pd-cinput:hover { border-color:#D1D5DB; }
.pd-send { width:32px; height:32px; background:oklch(60.6% 0.25 292.717); border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; margin-top:1px; }
.pd-send:hover { background:oklch(52% 0.27 292.717); }

/* ── PROPERTIES ── */
.pd-prop-sec-lbl { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#9CA3AF; margin-bottom:8px; }
.pd-prop-row { display:flex; align-items:center; min-height:32px; border-radius:6px; padding:0 4px; margin-bottom:2px; cursor:pointer; }
.pd-prop-row:hover { background:#F9FAFB; }
.pd-prop-lbl { width:90px; flex-shrink:0; display:flex; align-items:center; gap:6px; font-size:12px; color:#9CA3AF; padding:4px; }
.pd-prop-val { flex:1; font-size:12.5px; color:#111827; padding:4px 8px; border-radius:5px; }
.pd-prop-row:hover .pd-prop-val { background:#F3F4F6; }
.pd-prop-val.muted { color:#9CA3AF; }
.pd-link { color:oklch(60.6% 0.25 292.717); }
.pd-divider { height:1px; background:#F3F4F6; margin:10px 4px; }
.pd-progress-block { flex:1; padding:4px 8px; }
.pd-prog-bar { height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; margin-bottom:3px; }
.pd-prog-bar-fill { height:100%; border-radius:2px; background:oklch(60.6% 0.25 292.717); }
.pd-prog-lbl { font-size:11px; color:#9CA3AF; }
.pd-label { font-size:10.5px; background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); padding:1px 7px; border-radius:10px; font-weight:500; }
</style>
