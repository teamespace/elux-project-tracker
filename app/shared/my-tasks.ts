export type DueFilter = 'all' | 'today' | 'week' | 'overdue' | 'none'
export type GroupId = 'overdue' | 'inprogress' | 'todo' | 'inreview' | 'completed'

export interface MyTaskLabel {
  text: string
  color?: string
}

export interface MyTask {
  id: string
  title: string
  project: string
  priority: 'high' | 'medium' | 'low'
  priorityLabel: string
  due: string
  dueType: DueFilter
  labels: MyTaskLabel[]
  done?: boolean
  description?: string
  progress?: number
  assignee?: { name: string; initials: string; avatar?: string }
}

export interface MyTaskGroup {
  id: GroupId
  label: string
  dotClass: string
  tasks: MyTask[]
}

export interface MyTaskComment {
  id: string
  author: { name: string; initials: string }
  text: string
  time: string
}

export interface MyTaskActivity {
  id: string
  actor: { name: string; initials: string }
  text: string
  time: string
}

export interface MyTaskAttachment {
  id: string
  name: string
  size: string
  type: 'file' | 'figma' | 'notion'
}

export interface MyTaskSubtask {
  id: string
  title: string
  done: boolean
  dueDate: string
  assignee: string
}

export interface MyTaskDetail extends MyTask {
  fullDescription: string
  subtasks: MyTaskSubtask[]
  comments: MyTaskComment[]
  activities: MyTaskActivity[]
  attachments: MyTaskAttachment[]
  startDate?: string
  type?: string
}

export const currentUser: { name: string; initials: string; avatar?: string } = { name: 'Rasya Ardiansyah', initials: 'RA' }

export const groups: MyTaskGroup[] = [
  {
    id: 'overdue',
    label: 'Overdue',
    dotClass: 'overdue',
    tasks: [
      { id: 't1', title: 'Auth redesign implementation', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 10', dueType: 'overdue', labels: [{ text: 'UX' }, { text: 'Design', color: 'amber' }] },
      { id: 't2', title: 'Mobile checkout flow', project: 'Mobile App MVP', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 14', dueType: 'overdue', labels: [{ text: 'Mobile', color: 'green' }] },
      { id: 't3', title: 'Token naming inconsistency fix', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 18', dueType: 'overdue', labels: [{ text: 'Tokens', color: 'gray' }] },
    ],
  },
  {
    id: 'inprogress',
    label: 'In Progress',
    dotClass: 'inprogress',
    tasks: [
      { id: 't4', title: 'Produce high-fidelity mockups', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'UX' }, { text: 'Figma' }] },
      { id: 't5', title: 'API rate limit specification', project: 'Beta Launch', priority: 'high', priorityLabel: 'HIGH', due: 'Today', dueType: 'today', labels: [{ text: 'Backend', color: 'gray' }] },
      { id: 't6', title: 'Component library export', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 23', dueType: 'week', labels: [{ text: 'Components', color: 'green' }] },
      { id: 't7', title: 'Implement payment gateway', project: 'Mobile App MVP', priority: 'medium', priorityLabel: 'MED', due: 'Jun 24', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }, { text: 'Dev', color: 'gray' }] },
      { id: 't8', title: 'Write release notes draft', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: '—', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
    ],
  },
  {
    id: 'todo',
    label: 'To Do',
    dotClass: 'todo',
    tasks: [
      { id: 't9', title: 'Handoff to engineering', project: 'Alpha Project', priority: 'medium', priorityLabel: 'MED', due: 'Jul 15', dueType: 'none', labels: [{ text: 'Handoff', color: 'gray' }] },
      { id: 't10', title: 'Onboarding copy finalization', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: 'Jul 1', dueType: 'none', labels: [{ text: 'Copy', color: 'gray' }] },
      { id: 't11', title: 'App store submission checklist', project: 'Mobile App MVP', priority: 'low', priorityLabel: 'LOW', due: 'Jun 30', dueType: 'week', labels: [{ text: 'Mobile', color: 'green' }] },
    ],
  },
  {
    id: 'inreview',
    label: 'In Review',
    dotClass: 'inreview',
    tasks: [
      { id: 't12', title: 'Draft information architecture', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 22', dueType: 'week', labels: [{ text: 'UX' }] },
      { id: 't13', title: 'Design system documentation', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 25', dueType: 'none', labels: [{ text: 'Docs', color: 'gray' }] },
    ],
  },
  {
    id: 'completed',
    label: 'Completed',
    dotClass: 'completed',
    tasks: [
      { id: 't14', title: 'Finalize user research synthesis', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 10', dueType: 'none', labels: [{ text: 'Research' }], done: true },
      { id: 't15', title: 'Audit existing components', project: 'Design System v2', priority: 'medium', priorityLabel: 'MED', due: 'Jun 12', dueType: 'none', labels: [{ text: 'Components', color: 'green' }], done: true },
      { id: 't16', title: 'Set up CI/CD pipeline', project: 'Beta Launch', priority: 'low', priorityLabel: 'LOW', due: 'Jun 15', dueType: 'none', labels: [{ text: 'Dev', color: 'gray' }], done: true },
      { id: 't17', title: 'Finalize screen flows', project: 'Mobile App MVP', priority: 'high', priorityLabel: 'HIGH', due: 'May 15', dueType: 'none', labels: [{ text: 'Mobile', color: 'green' }], done: true },
      { id: 't18', title: 'User interview synthesis', project: 'Alpha Project', priority: 'medium', priorityLabel: 'MED', due: 'May 20', dueType: 'none', labels: [{ text: 'Research' }], done: true },
      { id: 't19', title: 'Typography scale definition', project: 'Design System v2', priority: 'low', priorityLabel: 'LOW', due: 'May 28', dueType: 'none', labels: [{ text: 'Tokens', color: 'gray' }], done: true },
      { id: 't20', title: 'Competitor feature analysis', project: 'Beta Launch', priority: 'medium', priorityLabel: 'MED', due: 'Jun 5', dueType: 'none', labels: [{ text: 'Research' }], done: true },
      { id: 't21', title: 'Stakeholder alignment deck', project: 'Alpha Project', priority: 'high', priorityLabel: 'HIGH', due: 'Jun 8', dueType: 'none', labels: [{ text: 'Strategy', color: 'amber' }], done: true },
    ],
  },
]

export function statusFromGroup(groupId: GroupId): { id: string; label: string } {
  switch (groupId) {
    case 'overdue': return { id: 'in-progress', label: 'Overdue' }
    case 'inprogress': return { id: 'in-progress', label: 'In Progress' }
    case 'todo': return { id: 'todo', label: 'To Do' }
    case 'inreview': return { id: 'in-review', label: 'In Review' }
    case 'completed': return { id: 'done', label: 'Done' }
  }
}

export function statusClass(groupId: GroupId): string {
  switch (groupId) {
    case 'overdue': return 'text-red-700 bg-red-50 border-red-200'
    case 'inprogress': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'todo': return 'text-gray-700 bg-gray-100 border-gray-200'
    case 'inreview': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'completed': return 'text-green-700 bg-green-50 border-green-200'
  }
}

export function statusDotClass(groupId: GroupId): string {
  switch (groupId) {
    case 'overdue': return 'bg-red-500'
    case 'inprogress': return 'bg-amber-500'
    case 'todo': return 'bg-gray-400'
    case 'inreview': return 'bg-blue-500'
    case 'completed': return 'bg-green-500'
  }
}

export function priorityClass(priority: MyTask['priority']): string {
  switch (priority) {
    case 'high': return 'text-red-700 bg-red-50 border-red-200'
    case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'low': return 'text-green-700 bg-green-50 border-green-200'
  }
}

export function progressFor(groupId: GroupId): number {
  switch (groupId) {
    case 'completed': return 100
    case 'inreview': return 75
    case 'inprogress': return 50
    case 'overdue': return 25
    case 'todo': return 0
  }
}

export function progressColor(progress: number): string {
  if (progress === 0) return 'bg-gray-300'
  if (progress <= 33) return 'bg-amber-500'
  if (progress <= 66) return 'bg-blue-500'
  if (progress < 100) return 'bg-green-500'
  return 'bg-green-600'
}

function baseDetailFor(task: MyTask, groupId: GroupId): MyTaskDetail {
  return {
    ...task,
    description: task.labels.map(l => l.text).join(' · ') || undefined,
    progress: task.progress ?? progressFor(groupId),
    assignee: task.assignee ?? currentUser,
    fullDescription: '',
    subtasks: [],
    comments: [],
    activities: [],
    attachments: [],
  }
}

export const taskDetails: Record<string, MyTaskDetail> = {}

for (const group of groups) {
  for (const task of group.tasks) {
    taskDetails[task.id] = baseDetailFor(task, group.id)
  }
}

// Enrich specific tasks with realistic detail content
taskDetails['t1'].fullDescription = 'Redesign the authentication flow to support social login, passwordless email magic links, and improved error messaging. The new flow should reduce login friction and improve conversion.'
taskDetails['t1'].subtasks = [
  { id: 'st-t1-1', title: 'Audit current auth screens', done: true, dueDate: '2026-06-05', assignee: 'Rasya' },
  { id: 'st-t1-2', title: 'Draft passwordless flow', done: false, dueDate: '2026-06-12', assignee: 'Dito' },
  { id: 'st-t1-3', title: 'Social login provider comparison', done: false, dueDate: '2026-06-15', assignee: 'Rasya' },
]
taskDetails['t1'].comments = [
  { id: 'c-t1-1', author: { name: 'Rasya', initials: 'R' }, text: 'Security team wants MFA considered in the first release.', time: 'Jun 16, 10:30am' },
  { id: 'c-t1-2', author: { name: 'Dito', initials: 'D' }, text: 'Magic link expiry policy is 15 minutes for now.', time: 'Jun 15, 3:15pm' },
]
taskDetails['t1'].activities = [
  { id: 'a-t1-1', actor: { name: 'Rasya', initials: 'R' }, text: 'changed status to In Progress', time: 'Jun 14, 9:00am' },
  { id: 'a-t1-2', actor: { name: 'Rasya', initials: 'R' }, text: 'set priority to High', time: 'Jun 10, 9:00am' },
]
taskDetails['t1'].attachments = [
  { id: 'a-t1-1', name: 'auth-audit.pdf', size: '2.4 MB', type: 'file' },
]
taskDetails['t1'].startDate = '2026-06-01'
taskDetails['t1'].type = 'Task'

taskDetails['t4'].fullDescription = 'Produce final high-fidelity mockups for the Alpha Project redesign, covering mobile and desktop breakpoints. Deliverables include component specs and redlines.'
taskDetails['t4'].subtasks = [
  { id: 'st-t4-1', title: 'Mobile breakpoint mockups', done: true, dueDate: '2026-06-20', assignee: 'Rasya' },
  { id: 'st-t4-2', title: 'Desktop breakpoint mockups', done: true, dueDate: '2026-06-21', assignee: 'Rasya' },
  { id: 'st-t4-3', title: 'Component spec handoff', done: false, dueDate: '2026-06-25', assignee: 'Maya' },
]
taskDetails['t4'].comments = [
  { id: 'c-t4-1', author: { name: 'Maya', initials: 'M' }, text: 'Spacing on the dashboard card feels tight on 1366px.', time: 'Jun 20, 11:00am' },
]
taskDetails['t4'].activities = [
  { id: 'a-t4-1', actor: { name: 'Rasya', initials: 'R' }, text: 'added attachment mockups-v2.fig', time: 'Jun 19, 4:00pm' },
  { id: 'a-t4-2', actor: { name: 'Rasya', initials: 'R' }, text: 'moved to In Progress', time: 'Jun 18, 10:00am' },
]
taskDetails['t4'].attachments = [
  { id: 'a-t4-1', name: 'mockups-v2.fig', size: 'Figma', type: 'figma' },
]
taskDetails['t4'].startDate = '2026-06-15'
taskDetails['t4'].type = 'Task'

taskDetails['t12'].fullDescription = 'Draft the information architecture for the new documentation site. The IA should support onboarding, API reference, and design system content.'
taskDetails['t12'].subtasks = [
  { id: 'st-t12-1', title: 'Content audit', done: true, dueDate: '2026-06-18', assignee: 'Rasya' },
  { id: 'st-t12-2', title: 'Sitemap draft', done: true, dueDate: '2026-06-20', assignee: 'Rasya' },
  { id: 'st-t12-3', title: 'Stakeholder review', done: false, dueDate: '2026-06-24', assignee: 'Maya' },
]
taskDetails['t12'].comments = [
  { id: 'c-t12-1', author: { name: 'Rasya', initials: 'R' }, text: 'Review scheduled for Friday with the docs team.', time: 'Jun 21, 9:00am' },
]
taskDetails['t12'].activities = [
  { id: 'a-t12-1', actor: { name: 'Rasya', initials: 'R' }, text: 'moved to In Review', time: 'Jun 21, 9:30am' },
]
taskDetails['t12'].attachments = []
taskDetails['t12'].startDate = '2026-06-14'
taskDetails['t12'].type = 'Task'

taskDetails['t14'].fullDescription = 'Synthesize findings from 12 user interviews into themes, quotes, and opportunity areas for the Alpha Project redesign.'
taskDetails['t14'].subtasks = [
  { id: 'st-t14-1', title: 'Transcribe interviews', done: true, dueDate: '2026-06-05', assignee: 'Rasya' },
  { id: 'st-t14-2', title: 'Tag insights', done: true, dueDate: '2026-06-08', assignee: 'Rasya' },
  { id: 'st-t14-3', title: 'Write synthesis report', done: true, dueDate: '2026-06-10', assignee: 'Rasya' },
]
taskDetails['t14'].comments = [
  { id: 'c-t14-1', author: { name: 'Dito', initials: 'D' }, text: 'Great report — the activation insight is already shaping the roadmap.', time: 'Jun 11, 2:00pm' },
]
taskDetails['t14'].activities = [
  { id: 'a-t14-1', actor: { name: 'Rasya', initials: 'R' }, text: 'marked as Done', time: 'Jun 10, 5:00pm' },
]
taskDetails['t14'].attachments = [
  { id: 'a-t14-1', name: 'research-synthesis.pdf', size: '5.1 MB', type: 'file' },
]
taskDetails['t14'].startDate = '2026-06-01'
taskDetails['t14'].type = 'Task'

// Generic fallback detail for remaining tasks
for (const group of groups) {
  for (const task of group.tasks) {
    const detail = taskDetails[task.id]
    if (!detail.fullDescription) {
      detail.fullDescription = `${task.title}. Part of ${task.project}. Assigned to ${detail.assignee?.name ?? 'you'}.`
    }
    if (detail.subtasks.length === 0) {
      detail.subtasks = [
        { id: `st-${task.id}-1`, title: 'Initial scoping', done: task.done ?? false, dueDate: '', assignee: detail.assignee?.name ?? 'Rasya' },
        { id: `st-${task.id}-2`, title: 'Review and finalize', done: task.done ?? false, dueDate: '', assignee: detail.assignee?.name ?? 'Rasya' },
      ]
    }
    if (detail.activities.length === 0) {
      detail.activities = [
        { id: `a-${task.id}-1`, actor: { name: detail.assignee?.name ?? 'Rasya', initials: detail.assignee?.initials ?? 'R' }, text: `created task ${task.title}`, time: 'Just now' },
      ]
    }
  }
}

export function findTaskById(id: string): MyTask | undefined {
  for (const group of groups) {
    const task = group.tasks.find(t => t.id === id)
    if (task) return task
  }
  return undefined
}

export function findTaskDetailById(id: string): MyTaskDetail | undefined {
  return taskDetails[id]
}
