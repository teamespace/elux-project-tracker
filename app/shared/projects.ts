export interface Person {
  initials: string
  name: string
}

export interface ProjectLinks {
  attach: string
  notion: string
  figma: string
}

export interface ProjectChildTask {
  id: string
  title: string
  done: boolean
  dueDate: string
  assignee: string
}

export interface ProjectComment {
  id: string
  author: Person
  text: string
  time: string
}

export interface ProjectActivity {
  id: string
  actor: Person
  text: string
  time: string
}

export interface ProjectAttachment {
  id: string
  name: string
  size: number
  type: string
}

export type ProjectStatus = 'on-track' | 'at-risk' | 'delayed' | 'not-started'
export type ProjectPriority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  key: string
  name: string
  status: ProjectStatus
  statusLabel: string
  description: string
  progress: number
  openTasks: number
  atRiskTasks: number
  dueDate: string
  startDate: string
  owner: Person
  assignees: Person[]
  color: string
  priority: ProjectPriority
  priorityLabel: string
  type: string
  team: string
  project: string
  labels: string
  links: ProjectLinks
  industry: string
  category: string
  childTasks: ProjectChildTask[]
  comments: ProjectComment[]
  activities: ProjectActivity[]
  attachments: ProjectAttachment[]
}

export const people: Person[] = [
  { initials: 'R', name: 'Rasya' },
  { initials: 'D', name: 'Dito' },
  { initials: 'M', name: 'Maya' },
  { initials: 'Ra', name: 'Rara' },
]

export const projectOptions: string[] = ['Alpha Project', 'Beta Launch', 'Internal Tools']

export const projects: Project[] = [
  {
    id: 'proj-1',
    key: 'ALPHA',
    name: 'Alpha Project',
    status: 'at-risk',
    statusLabel: 'AT RISK',
    description: 'Redesigning core product UX to improve activation, retention, and time-to-value across the entire product surface.',
    progress: 62,
    openTasks: 14,
    atRiskTasks: 2,
    dueDate: '2026-08-30',
    startDate: '2026-06-01',
    owner: { initials: 'R', name: 'Rasya' },
    assignees: [
      { initials: 'R', name: 'Rasya' },
      { initials: 'D', name: 'Dito' },
      { initials: 'M', name: 'Maya' },
    ],
    color: 'bg-blue-500',
    priority: 'high',
    priorityLabel: 'High',
    type: 'Product redesign',
    team: 'Product & Engineering',
    project: 'Alpha Program',
    labels: 'UX, Q3',
    links: {
      attach: 'https://example.com/alpha-brief',
      notion: 'https://notion.so/alpha-brief',
      figma: 'https://figma.com/alpha',
    },
    industry: 'SaaS',
    category: 'Core product',
    childTasks: [
      { id: 'st-1', title: 'Finalize user research synthesis', done: true, dueDate: '2026-06-10', assignee: 'Rasya' },
      { id: 'st-2', title: 'Draft information architecture', done: true, dueDate: '2026-06-15', assignee: 'Dito' },
      { id: 'st-3', title: 'Produce high-fidelity mockups', done: false, dueDate: '2026-07-01', assignee: 'Maya' },
      { id: 'st-4', title: 'Handoff to engineering', done: false, dueDate: '2026-07-15', assignee: 'Rasya' },
    ],
    comments: [
      { id: 'c-1', author: { initials: 'R', name: 'Rasya' }, text: 'Let\'s keep scope tight for v1 and ship a research-backed MVP.', time: 'Jun 17, 10:30am' },
      { id: 'c-2', author: { initials: 'D', name: 'Dito' }, text: 'Agreed. I\'ll update the IA doc by EOD.', time: 'Jun 17, 11:05am' },
    ],
    activities: [
      { id: 'a-1', actor: { initials: 'R', name: 'Rasya' }, text: 'changed status to AT RISK', time: 'Jun 16, 4:00pm' },
      { id: 'a-2', actor: { initials: 'M', name: 'Maya' }, text: 'was assigned as PM Assignee', time: 'Jun 15, 9:00am' },
      { id: 'a-3', actor: { initials: 'D', name: 'Dito' }, text: 'added child task “Produce high-fidelity mockups”', time: 'Jun 14, 2:30pm' },
    ],
    attachments: [
      { id: 'f-1', name: 'alpha-research.pdf', size: 2457600, type: 'application/pdf' },
      { id: 'f-2', name: 'ia-v1.fig', size: 819200, type: 'application/figma' },
    ],
  },
  {
    id: 'proj-2',
    key: 'BETA',
    name: 'Beta Launch',
    status: 'on-track',
    statusLabel: 'ON TRACK',
    description: 'Public launch milestone for Q3, including marketing site, press kit, and early-access onboarding.',
    progress: 78,
    openTasks: 9,
    atRiskTasks: 0,
    dueDate: '2026-07-15',
    startDate: '2026-05-20',
    owner: { initials: 'M', name: 'Maya' },
    assignees: [
      { initials: 'M', name: 'Maya' },
      { initials: 'D', name: 'Dito' },
    ],
    color: 'bg-green-500',
    priority: 'medium',
    priorityLabel: 'Medium',
    type: 'Go-to-market',
    team: 'Marketing & Product',
    project: 'Beta Program',
    labels: 'Launch',
    links: {
      attach: '',
      notion: 'https://notion.so/beta-launch',
      figma: '',
    },
    industry: 'SaaS',
    category: 'Launch',
    childTasks: [
      { id: 'st-5', title: 'Publish press kit', done: true, dueDate: '2026-06-20', assignee: 'Maya' },
      { id: 'st-6', title: 'Finalize onboarding flow', done: false, dueDate: '2026-07-05', assignee: 'Dito' },
    ],
    comments: [
      { id: 'c-3', author: { initials: 'M', name: 'Maya' }, text: 'Press kit is ready for review.', time: 'Jun 17, 9:00am' },
    ],
    activities: [
      { id: 'a-4', actor: { initials: 'M', name: 'Maya' }, text: 'changed status to ON TRACK', time: 'Jun 16, 10:00am' },
      { id: 'a-5', actor: { initials: 'D', name: 'Dito' }, text: 'completed child task “Publish press kit”', time: 'Jun 15, 5:00pm' },
    ],
    attachments: [
      { id: 'f-3', name: 'press-kit.zip', size: 15728640, type: 'application/zip' },
    ],
  },
  {
    id: 'proj-3',
    key: 'INT',
    name: 'Internal Tools',
    status: 'not-started',
    statusLabel: 'NOT STARTED',
    description: 'Tracker revamp and design system rollout for the internal product team.',
    progress: 0,
    openTasks: 0,
    atRiskTasks: 0,
    dueDate: '2026-09-10',
    startDate: '2026-06-20',
    owner: { initials: 'D', name: 'Dito' },
    assignees: [],
    color: 'bg-purple-500',
    priority: 'low',
    priorityLabel: 'Low',
    type: 'Internal initiative',
    team: 'Internal Product',
    project: 'Operations',
    labels: '',
    links: {
      attach: '',
      notion: '',
      figma: '',
    },
    industry: 'SaaS',
    category: 'Operations',
    childTasks: [],
    comments: [],
    activities: [
      { id: 'a-6', actor: { initials: 'D', name: 'Dito' }, text: 'created this project', time: 'Jun 14, 9:00am' },
    ],
    attachments: [],
  },
]

export const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'on-track', label: 'On track' },
  { value: 'at-risk', label: 'At risk' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'not-started', label: 'Not started' },
]

export const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function projectById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}

export type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export function statusColor(status: ProjectStatus): BadgeColor {
  const map: Record<ProjectStatus, BadgeColor> = {
    'on-track': 'success',
    'at-risk': 'warning',
    delayed: 'error',
    'not-started': 'neutral',
  }
  return map[status] ?? 'neutral'
}

export function priorityColor(priority: ProjectPriority): BadgeColor {
  const map: Record<ProjectPriority, BadgeColor> = {
    high: 'error',
    medium: 'warning',
    low: 'neutral',
  }
  return map[priority] ?? 'neutral'
}

export function progressColor(pct: number): string {
  if (pct === 0) return 'bg-gray-400'
  if (pct <= 33) return 'bg-amber-500'
  if (pct <= 66) return 'bg-blue-500'
  if (pct < 100) return 'bg-green-500'
  return 'bg-blue-600'
}

export function avatarColor(index: number): string {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600', 'bg-teal-600'] as const
  return colors[index % colors.length] ?? 'bg-gray-400'
}

export function findPerson(name: string): Person | null {
  return people.find(p => p.name === name) ?? null
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}
