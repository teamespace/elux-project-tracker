<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'My Work' })

type DueFilter = 'all' | 'today' | 'week' | 'overdue' | 'none'
type GroupId = 'overdue' | 'inprogress' | 'todo' | 'inreview' | 'completed'

const activeStatCard = ref<GroupId | 'all'>('all')
const dueFilter = ref<DueFilter>('all')
const projectFilter = ref('')
const priorityFilter = ref('')

const collapsedGroups = ref<Set<GroupId>>(new Set(['completed']))

function toggleGroup(id: GroupId) {
  if (collapsedGroups.value.has(id)) collapsedGroups.value.delete(id)
  else collapsedGroups.value.add(id)
}

function setStatCard(id: GroupId | 'all') {
  activeStatCard.value = activeStatCard.value === id ? 'all' : id
}

function setDueFilter(f: DueFilter) { dueFilter.value = f }

interface Task {
  id: string; title: string; project: string; priority: 'high' | 'medium' | 'low'; priorityLabel: string
  due: string; dueType: DueFilter; labels: { text: string; color?: string }[]; done?: boolean
}

const groups: { id: GroupId; label: string; tasks: Task[] }[] = [
  { id: 'overdue', label: 'Overdue', tasks: [
    { id: 't1', title: 'Auth redesign implementation', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 10', dueType: 'overdue', labels: [{ text: 'UX' }, { text: 'Design', color: 'amber' }] },
    { id: 't2', title: 'Mobile checkout flow', project: 'Mobile App MVP', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 14', dueType: 'overdue', labels: [{ text: 'Mobile', color: 'green' }] },
    { id: 't3', title: 'Token naming inconsistency fix', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 18', dueType: 'overdue', labels: [{ text: 'Tokens', color: 'gray' }] },
  ]},
  { id: 'inprogress', label: 'In Progress', tasks: [
    { id: 't4', title: 'Produce high-fidelity mockups', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'UX' }, { text: 'Figma' }] },
    { id: 't5', title: 'API rate limit specification', project: 'Beta Launch', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'Backend', color: 'gray' }] },
    { id: 't6', title: 'Component library export', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 23', dueType: 'week', labels: [{ text: 'Components', color: 'green' }] },
    { id: 't7', title: 'Implement payment gateway', project: 'Mobile App MVP', priority: 'medium', priorityLabel: 'MED', due: 'Jun 24', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }, { text: 'Dev', color: 'gray' }] },
    { id: 't8', title: 'Write release notes draft', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: '—', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
  ]},
  { id: 'todo', label: 'To Do', tasks: [
    { id: 't9', title: 'Handoff to engineering', project: 'Alpha Project', priority: 'medium', priorityLabel: 'MED', due: 'Jul 15', dueType: 'none', labels: [{ text: 'Handoff', color: 'gray' }] },
    { id: 't10', title: 'Onboarding copy finalization', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: 'Jul 1', dueType: 'none', labels: [{ text: 'Copy', color: 'gray' }] },
    { id: 't11', title: 'App store submission checklist', project: 'Mobile App MVP', priority: 'low', priorityLabel: 'LOW', due: 'Jun 30', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }] },
  ]},
  { id: 'inreview', label: 'In Review', tasks: [
    { id: 't12', title: 'Draft information architecture', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 22', dueType: 'week', labels: [{ text: 'UX' }] },
    { id: 't13', title: 'Design system documentation', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 25', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
  ]},
  { id: 'completed', label: 'Completed', tasks: [
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

const filteredGroups = computed(() => {
  return groups.map(g => ({
    ...g,
    tasks: g.tasks.filter(t => {
      if (activeStatCard.value !== 'all' && g.id !== activeStatCard.value) return false
      if (dueFilter.value !== 'all' && t.dueType !== dueFilter.value) return false
      if (projectFilter.value && t.project !== projectFilter.value) return false
      if (priorityFilter.value && t.priority !== priorityFilter.value) return false
      return true
    }),
  })).filter(g => g.tasks.length > 0)
})

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
      <!-- In Progress -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'inprogress' }" @click="setStatCard('inprogress')">
        <div class="mw-stat-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          In Progress
        </div>
        <div class="mw-stat-num">5</div>
      </div>
      <!-- Due This Week -->
      <div class="mw-stat-card" @click="setStatCard('all')">
        <div class="mw-stat-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Due This Week
        </div>
        <div class="mw-stat-num amber">4</div>
      </div>
      <!-- Overdue -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'overdue' }" @click="setStatCard('overdue')">
        <div class="mw-stat-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Overdue
        </div>
        <div class="mw-stat-num red">3</div>
      </div>
      <!-- Completed -->
      <div class="mw-stat-card" :class="{ active: activeStatCard === 'completed' }" @click="setStatCard('completed')">
        <div class="mw-stat-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Completed
        </div>
        <div class="mw-stat-num green">8</div>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="mw-filterbar">
      <div class="mw-search">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        Search tasks…
      </div>
      <select v-model="projectFilter" class="mw-select">
        <option value="">All Projects</option>
        <option value="Alpha Project">Alpha Project</option>
        <option value="Beta Launch">Beta Launch</option>
        <option value="Mobile App MVP">Mobile App MVP</option>
        <option value="Design System v2">Design System v2</option>
      </select>
      <select v-model="priorityFilter" class="mw-select">
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button class="mw-due-chip" :class="{ active: dueFilter === 'all' }" @click="setDueFilter('all')">All</button>
      <button class="mw-due-chip" :class="{ active: dueFilter === 'today' }" @click="setDueFilter('today')">Today</button>
      <button class="mw-due-chip" :class="{ active: dueFilter === 'week' }" @click="setDueFilter('week')">This week</button>
      <button class="mw-due-chip" :class="{ active: dueFilter === 'overdue' }" @click="setDueFilter('overdue')">Overdue</button>
      <button class="mw-due-chip" :class="{ active: dueFilter === 'none' }" @click="setDueFilter('none')">No date</button>
    </div>

    <!-- Task table -->
    <div class="mw-table-wrap">
      <table class="mw-table">
        <thead>
          <tr>
            <th style="width:36px"/>
            <th>Task</th>
            <th style="width:150px">Project</th>
            <th style="width:90px">Priority</th>
            <th style="width:110px">Due Date</th>
            <th>Labels</th>
            <th style="width:72px"/>
          </tr>
        </thead>
        <template v-for="group in filteredGroups" :key="group.id">
          <tbody class="task-group" :class="{ collapsed: collapsedGroups.has(group.id) }">
            <tr class="task-group-header" @click="toggleGroup(group.id)">
              <td colspan="7">
                <span class="group-chevron">▾</span>{{ group.label }} · {{ group.tasks.length }}
              </td>
            </tr>
            <tr v-for="task in group.tasks" :key="task.id" class="task-row">
              <td><input type="checkbox" :checked="task.done" style="accent-color:oklch(60.6% 0.25 292.717)"></td>
              <td><span class="task-name" :class="{ done: task.done }">{{ task.title }}</span></td>
              <td><span class="task-project">{{ task.project }}</span></td>
              <td><span class="task-priority" :class="task.priority">{{ task.priorityLabel }}</span></td>
              <td><span class="task-due" :class="{ overdue: task.dueType === 'overdue', today: task.dueType === 'today' }">{{ task.due }}</span></td>
              <td>
                <span v-for="label in task.labels" :key="label.text" class="task-label-chip" :class="label.color">{{ label.text }}</span>
              </td>
              <td>
                <div class="task-actions">
                  <button class="add-today-btn" title="Add to My Day">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  </button>
                  <button class="task-more-btn" title="More options">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</template>
