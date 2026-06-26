<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Projects', middleware: 'auth' })

const openDd  = ref('')
const viewMode = ref<'card' | 'list'>('card')
const selectedStatuses   = ref<string[]>(['on-track', 'at-risk', 'not-started', 'delayed'])
const selectedPriorities = ref<string[]>(['high', 'medium', 'low'])
const selectedAssignees  = ref<string[]>(['Rasya', 'Maya', 'Dito', 'Rara', 'Lintang'])

function toggleDd(e: Event, id: string) { e.stopPropagation(); openDd.value = openDd.value === id ? '' : id }
function closeDd() { openDd.value = '' }

function toggle(arr: string[], v: string) {
  const i = arr.indexOf(v); if (i === -1) arr.push(v); else arr.splice(i, 1)
}

const statusHasFilter   = computed(() => selectedStatuses.value.length < 4)
const priorityHasFilter = computed(() => selectedPriorities.value.length < 3)
const assigneeHasFilter = computed(() => selectedAssignees.value.length < 5)

interface Proj {
  id: string; key: string; name: string; category: string; description: string
  status: 'on-track' | 'at-risk' | 'not-started' | 'delayed'; statusLabel: string
  priority: 'high' | 'medium' | 'low'; doneT: number; totalT: number; progress: number; barFill: string
  dueLabel: string; overdue?: boolean
  assignees: { seed: string; bg: string; name: string }[]
  attach: number; comments: number
}

const allProjects = ref<Proj[]>([
  { id: 'p1', key: 'ALPHA', name: 'Alpha Project', category: 'UX Redesign', description: 'Redesigning core product UX to improve activation…', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', doneT: 9, totalT: 14, progress: 62, barFill: 'pfill-amber', dueLabel: 'Aug 30, 2025', overdue: true, assignees: [{seed:'Rasya',bg:'b6e3f4',name:'Rasya'},{seed:'Maya',bg:'ffd5dc',name:'Maya'},{seed:'Dito',bg:'c0aede',name:'Dito'}], attach: 3, comments: 7 },
  { id: 'p2', key: 'BETA', name: 'Beta Launch', category: 'Q3 Milestone', description: 'Public launch milestone for Q3, marketing site…', status: 'on-track', statusLabel: 'On Track', priority: 'medium', doneT: 7, totalT: 9, progress: 78, barFill: 'pfill-green', dueLabel: 'Jul 15, 2025', assignees: [{seed:'Leo',bg:'d1f0c2',name:'Leo'},{seed:'Ayu',bg:'fde68a',name:'Ayu'}], attach: 5, comments: 12 },
  { id: 'p3', key: 'MOB', name: 'Mobile App MVP', category: 'Product', description: 'iOS + Android MVP, core flows and onboarding…', status: 'on-track', statusLabel: 'On Track', priority: 'high', doneT: 9, totalT: 20, progress: 45, barFill: 'pfill-blue', dueLabel: 'Oct 1, 2025', assignees: [{seed:'Rasya',bg:'b6e3f4',name:'Rasya'},{seed:'Rara',bg:'f9a8d4',name:'Rara'},{seed:'Lintang',bg:'a5f3fc',name:'Lintang'}], attach: 8, comments: 4 },
  { id: 'p4', key: 'ANL', name: 'Analytics Dashboard', category: 'Data & Reporting', description: 'Data & reporting suite for internal and external use…', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', doneT: 4, totalT: 13, progress: 30, barFill: 'pfill-amber', dueLabel: 'Jul 5, 2025', overdue: true, assignees: [{seed:'Maya',bg:'ffd5dc',name:'Maya'},{seed:'Ayu',bg:'fde68a',name:'Ayu'}], attach: 2, comments: 9 },
  { id: 'p5', key: 'CUS', name: 'Customer Portal', category: 'Self-serve', description: 'Self-serve billing, profile, and account management…', status: 'on-track', statusLabel: 'On Track', priority: 'low', doneT: 18, totalT: 20, progress: 90, barFill: 'pfill-green', dueLabel: 'Aug 1, 2025', assignees: [{seed:'Lintang',bg:'a5f3fc',name:'Lintang'},{seed:'Rara',bg:'f9a8d4',name:'Rara'}], attach: 11, comments: 3 },
  { id: 'p6', key: 'API', name: 'API Gateway v2', category: 'Infrastructure', description: 'Rate limiting, auth middleware, and routing redesign…', status: 'delayed', statusLabel: 'Delayed', priority: 'high', doneT: 2, totalT: 12, progress: 15, barFill: 'pfill-red', dueLabel: 'Jun 30, 2025', overdue: true, assignees: [{seed:'Dito',bg:'c0aede',name:'Dito'},{seed:'Maya',bg:'ffd5dc',name:'Maya'}], attach: 0, comments: 14 },
  { id: 'p7', key: 'DS2', name: 'Design System v2', category: 'Design', description: 'Component library, tokens, and documentation rollout…', status: 'on-track', statusLabel: 'On Track', priority: 'medium', doneT: 6, totalT: 11, progress: 55, barFill: 'pfill-blue', dueLabel: 'Sep 15, 2025', assignees: [{seed:'Rasya',bg:'b6e3f4',name:'Rasya'},{seed:'Lintang',bg:'a5f3fc',name:'Lintang'},{seed:'Rara',bg:'f9a8d4',name:'Rara'}], attach: 6, comments: 8 },
  { id: 'p8', key: 'INT', name: 'Internal Tools', category: 'Design System', description: 'Tracker revamp and design system rollout for internal team…', status: 'not-started', statusLabel: 'Not Started', priority: 'low', doneT: 0, totalT: 0, progress: 0, barFill: 'pfill-gray', dueLabel: 'Sep 10, 2025', assignees: [{seed:'Rasya',bg:'b6e3f4',name:'Rasya'}], attach: 0, comments: 0 },
])

const filteredProjects = computed(() =>
  allProjects.value.filter(p =>
    selectedStatuses.value.includes(p.status) &&
    selectedPriorities.value.includes(p.priority)
  )
)

const projectSlideOver = useProjectSlideOver()
const actionOpen = ref<string | null>(null)

function openActions(e: Event, id: string) {
  e.stopPropagation()
  e.preventDefault()
  actionOpen.value = actionOpen.value === id ? null : id
}
function closeActions() { actionOpen.value = null }

function viewProject(p: Proj) {
  closeActions()
  projectSlideOver.openPeek(p.id, {
    id: p.id,
    name: p.name,
    status: p.status,
    priority: p.priority,
    description: p.description,
    category: p.category,
    dueLabel: p.dueLabel,
    assignees: p.assignees.map(a => ({ name: a.name, initials: a.name.charAt(0), avatar: avatarUrl(a.seed, a.bg) })),
  })
}

function editProject(p: Proj) {
  closeActions()
  projectSlideOver.openEdit(p.id, {
    id: p.id,
    name: p.name,
    status: p.status,
    priority: p.priority,
    description: p.description,
    category: p.category,
    startDate: '',
    endDate: p.dueLabel,
    labels: '',
    figma: '',
    notion: '',
    assignees: p.assignees.map(a => ({ name: a.name, initials: a.seed.charAt(0), avatar: avatarUrl(a.seed, a.bg) })),
  })
}

function deleteProject(id: string) {
  closeActions()
  allProjects.value = allProjects.value.filter(p => p.id !== id)
}

onMounted(() => {
  document.addEventListener('click', closeDd)
  document.addEventListener('click', closeActions)
})
onUnmounted(() => {
  document.removeEventListener('click', closeDd)
  document.removeEventListener('click', closeActions)
})

const avatarUrl = (seed: string, bg: string) =>
  `https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}&backgroundColor=${bg}&backgroundType=solid`

const progIcon = (p: Proj) => p.status === 'on-track' && p.progress >= 50
  ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
  : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="18" r="1" fill="currentColor"/></svg>`
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="page-toolbar">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">

        <!-- Status -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'status')">
          <button class="df-btn" :class="{ 'has-filter': statusHasFilter }">
            Status
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'status' }">
            <div v-for="opt in [
              { v: 'on-track',    dot: '#22C55E', label: 'On Track' },
              { v: 'at-risk',     dot: '#F59E0B', label: 'At Risk' },
              { v: 'not-started', dot: '#9CA3AF', label: 'Not Started' },
              { v: 'delayed',     dot: '#EF4444', label: 'Delayed' },
            ]" :key="opt.v"
              class="df-item" :class="{ checked: selectedStatuses.includes(opt.v) }"
              @click.stop="toggle(selectedStatuses, opt.v)"
            >
              <div class="df-checkbox" />
              <span class="df-dot" :style="{ background: opt.dot }" />
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
            <div class="df-footer"><button class="df-clear" @click.stop="selectedStatuses = ['on-track','at-risk','not-started','delayed']; openDd = ''">Clear</button></div>
          </div>
        </div>

        <!-- Priority -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'priority')">
          <button class="df-btn" :class="{ 'has-filter': priorityHasFilter }">
            Priority
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'priority' }">
            <div v-for="opt in [
              { v: 'high',   dot: '#EF4444', label: 'High' },
              { v: 'medium', dot: '#F59E0B', label: 'Medium' },
              { v: 'low',    dot: '#22C55E', label: 'Low' },
            ]" :key="opt.v"
              class="df-item" :class="{ checked: selectedPriorities.includes(opt.v) }"
              @click.stop="toggle(selectedPriorities, opt.v)"
            >
              <div class="df-checkbox" />
              <span class="df-dot" :style="{ background: opt.dot }" />
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
            <div class="df-footer"><button class="df-clear" @click.stop="selectedPriorities = ['high','medium','low']; openDd = ''">Clear</button></div>
          </div>
        </div>

        <!-- Assignee -->
        <div class="df-wrap" @click.stop="toggleDd($event, 'assignee')">
          <button class="df-btn" :class="{ 'has-filter': assigneeHasFilter }">
            Assignee
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'assignee' }">
            <div v-for="a in [
              { name: 'Rasya',   bg: 'b6e3f4' },
              { name: 'Maya',    bg: 'ffd5dc' },
              { name: 'Dito',    bg: 'c0aede' },
              { name: 'Rara',    bg: 'f9a8d4' },
              { name: 'Lintang', bg: 'a5f3fc' },
            ]" :key="a.name"
              class="df-item" :class="{ checked: selectedAssignees.includes(a.name) }"
              @click.stop="toggle(selectedAssignees, a.name)"
            >
              <div class="df-checkbox" />
              <img :src="avatarUrl(a.name, a.bg)" style="width:18px;height:18px;border-radius:50%;flex-shrink:0">
              <span class="df-item-label">{{ a.name }}</span>
            </div>
            <div class="df-footer"><button class="df-clear" @click.stop="selectedAssignees = ['Rasya','Maya','Dito','Rara','Lintang']; openDd = ''">Clear</button></div>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;">
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
    </div>

    <!-- ── CARD VIEW ── -->
    <div v-if="viewMode === 'card'" class="proj-card-grid" style="overflow-y:auto;">
      <NuxtLink v-for="p in filteredProjects" :key="p.id" :to="`/projects/${p.id}`" class="proj-card">
        <div class="proj-card-header">
          <span class="proj-priority-tag" :class="p.priority">
            <svg class="proj-flag" viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V4h1l7 3 7-3v11l-7 3-7-3v6H4z"/></svg>
            {{ p.priority.charAt(0).toUpperCase() + p.priority.slice(1) }}
          </span>
          <div class="relative">
            <button class="proj-card-more" @click.prevent="openActions($event, `card-${p.id}`)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
            </button>
            <div
              v-if="actionOpen === `card-${p.id}`"
              class="proj-action-dd"
              @click.stop
            >
              <button class="proj-action-item" @click.stop="viewProject(p)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View
              </button>
              <button class="proj-action-item" @click.stop="editProject(p)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="proj-action-item proj-action-item--danger" @click.stop="deleteProject(p.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="proj-card-title">{{ p.name }}</div>
        <div class="proj-card-cat">{{ p.category }}</div>
        <div class="proj-prog-section">
          <div class="proj-prog-row">
            <div class="proj-prog-label"><span v-html="progIcon(p)" /> Progress</div>
            <span class="proj-task-count" :style="p.status === 'not-started' ? 'color:#9CA3AF' : ''">{{ p.doneT }} / {{ p.totalT }}</span>
          </div>
          <div class="proj-prog-bar"><div class="proj-prog-fill" :class="p.barFill" :style="{ width: `${p.progress}%` }" /></div>
        </div>
        <div class="proj-due" :class="{ overdue: p.overdue }">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Due to: <strong>{{ p.dueLabel }}</strong>
        </div>
        <div class="proj-card-footer">
          <div class="av-stack">
            <img v-for="a in p.assignees" :key="a.name" class="av-circle" :src="avatarUrl(a.seed, a.bg)" :title="a.name">
          </div>
          <div class="proj-card-meta">
            <div class="proj-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              {{ p.attach }}
            </div>
            <div class="proj-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {{ p.comments }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- ── LIST VIEW ── -->
    <div v-else style="flex:1;overflow-y:auto;">
      <table class="proj-tbl">
        <thead>
          <tr>
            <th><input type="checkbox" style="width:14px;height:14px;accent-color:oklch(60.6% 0.25 292.717);cursor:pointer"></th>
            <th class="srt">Project ↕</th>
            <th>Status</th>
            <th class="srt">Progress ↕</th>
            <th class="srt">Due Date ↕</th>
            <th>Assignees</th>
            <th>Priority</th>
            <th style="width:36px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProjects" :key="p.id" @click="navigateTo(`/projects/${p.id}`)">
            <td><input type="checkbox" style="width:14px;height:14px;accent-color:oklch(60.6% 0.25 292.717);cursor:pointer" @click.stop></td>
            <td>
              <div class="tbl-pname"><span class="proj-key">{{ p.key }}</span>{{ p.name }}</div>
              <div class="tbl-pdesc">{{ p.description }}</div>
            </td>
            <td><span class="sstatus" :class="p.status">{{ p.statusLabel }}</span></td>
            <td>
              <div class="tbl-prog">
                <div class="tbl-prog-track"><div class="tbl-prog-fill" :class="p.barFill" :style="{ width: `${p.progress}%` }" /></div>
                <div class="tbl-prog-lbl" :style="p.status === 'not-started' ? 'color:#9CA3AF' : ''">{{ p.progress }}%</div>
              </div>
            </td>
            <td>
              <span class="tbl-due-pill" :class="{ overdue: p.overdue }">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ p.dueLabel.split(',')[0] }}
              </span>
            </td>
            <td>
              <div class="av-stack">
                <img v-for="a in p.assignees" :key="a.name" class="av-circle" :src="avatarUrl(a.seed, a.bg)" :title="a.name" style="width:26px;height:26px;">
              </div>
            </td>
            <td><span class="spill" :class="`spill-${p.priority}`">{{ p.priority.charAt(0).toUpperCase() + p.priority.slice(1) }}</span></td>
            <td>
              <div class="relative">
                <button class="tbl-more" @click.stop="openActions($event, `tbl-${p.id}`)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                </button>
                <div
                  v-if="actionOpen === `tbl-${p.id}`"
                  class="proj-action-dd proj-action-dd--right"
                  @click.stop
                >
                  <button class="proj-action-item" @click.stop="viewProject(p)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View
                  </button>
                  <button class="proj-action-item" @click.stop="editProject(p)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="proj-action-item proj-action-item--danger" @click.stop="deleteProject(p.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.proj-action-dd {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  min-width: 140px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.proj-action-dd--right {
  left: auto;
  right: 0;
}
.proj-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.proj-action-item:hover {
  background: #F9FAFB;
  color: #111827;
}
.proj-action-item--danger {
  color: #DC2626;
}
.proj-action-item--danger:hover {
  background: #FEF2F2;
  color: #B91C1C;
}
</style>
