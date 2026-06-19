import { ref } from 'vue'

export type Status = 'on-track' | 'at-risk' | 'delayed' | 'not-started'

export interface Owner {
  initials: string
  name: string
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Kpi {
  id: string
  name: string
  current: string
  target: string
  progress: number
  status: Status
  statusLabel: string
  owner: Owner
  dueDate: string
}

export interface LinkedProject {
  id: string
  title: string
  project: string
  status: Status
  statusLabel: string
  progress: number
  taskCount: number
}

export interface ActivityItem {
  id: string
  actor: Owner
  action: string
  target: string
  time: string
}

export interface Goal {
  id: string
  title: string
  description: string
  status: Status
  statusLabel: string
  owner: Owner
  quarter: string
  dueDate: string
  progress: number
  kpis: Kpi[]
  linkedProjects: LinkedProject[]
  labels: Label[]
  activity: ActivityItem[]
}

export const goals = ref<Goal[]>([
  {
    id: 'goal-1',
    title: 'Q3 Ship Product Redesign',
    description: 'Deliver a complete redesign of the core product experience to improve user engagement, reduce churn, and modernize the visual language across all key user journeys.',
    status: 'on-track',
    statusLabel: 'ON TRACK',
    owner: { initials: 'R', name: 'Rasya' },
    quarter: 'Q3 2026',
    dueDate: 'Sep 30, 2026',
    progress: 58,
    labels: [
      { id: 'l-1', name: 'Product', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      { id: 'l-2', name: 'Q3', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    ],
    kpis: [
      { id: 'kpi-1', name: 'NPS Score ≥ 45', current: '38', target: '45', progress: 84, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'R', name: 'Rasya' }, dueDate: 'Sep 30' },
      { id: 'kpi-2', name: 'Reduce page load < 2s', current: '2.1s', target: '2.0s', progress: 95, status: 'on-track', statusLabel: 'ON TRACK', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Aug 15' },
      { id: 'kpi-3', name: 'Launch 3 core features', current: '1', target: '3', progress: 33, status: 'delayed', statusLabel: 'DELAYED', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Sep 30' },
    ],
    linkedProjects: [
      { id: 'epic-1', title: 'Auth & Onboarding Redesign', project: 'Alpha Project', status: 'at-risk', statusLabel: 'AT RISK', progress: 62, taskCount: 8 },
      { id: 'epic-2', title: 'Core Dashboard v2', project: 'Alpha Project', status: 'on-track', statusLabel: 'ON TRACK', progress: 78, taskCount: 5 },
    ],
    activity: [
      { id: 'a-1', actor: { initials: 'R', name: 'Rasya' }, action: 'updated progress to', target: '58%', time: '2h ago' },
      { id: 'a-2', actor: { initials: 'M', name: 'Maya' }, action: 'added KPI', target: 'Launch 3 core features', time: '1d ago' },
      { id: 'a-3', actor: { initials: 'D', name: 'Dito' }, action: 'linked project', target: 'Auth & Onboarding Redesign', time: '2d ago' },
    ],
  },
  {
    id: 'goal-2',
    title: 'Q3 Improve Dev Velocity',
    description: 'Increase the speed and quality of software delivery by improving CI/CD pipelines, reducing review times, and raising test coverage across all teams.',
    status: 'at-risk',
    statusLabel: 'AT RISK',
    owner: { initials: 'M', name: 'Maya' },
    quarter: 'Q3 2026',
    dueDate: 'Sep 30, 2026',
    progress: 28,
    labels: [
      { id: 'l-3', name: 'Engineering', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ],
    kpis: [
      { id: 'kpi-4', name: 'Deploy frequency ≥ 3x/week', current: '1.5', target: '3', progress: 50, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Sep 30' },
      { id: 'kpi-5', name: 'PR review time < 4h', current: '6h', target: '4h', progress: 67, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Aug 30' },
      { id: 'kpi-6', name: 'Test coverage ≥ 80%', current: '72%', target: '80%', progress: 90, status: 'on-track', statusLabel: 'ON TRACK', owner: { initials: 'R', name: 'Rara' }, dueDate: 'Sep 15' },
    ],
    linkedProjects: [
      { id: 'epic-3', title: 'API Documentation', project: 'Beta Launch', status: 'on-track', statusLabel: 'ON TRACK', progress: 80, taskCount: 3 },
    ],
    activity: [
      { id: 'a-4', actor: { initials: 'M', name: 'Maya' }, action: 'flagged as at risk', target: 'Deploy frequency KPI', time: '4h ago' },
      { id: 'a-5', actor: { initials: 'D', name: 'Dito' }, action: 'updated status to', target: 'At Risk', time: '1d ago' },
    ],
  },
  {
    id: 'goal-3',
    title: 'Q4 Launch Beta to 100 Users',
    description: 'Acquire and onboard the first 100 beta users, gather qualitative feedback, and achieve a healthy early retention rate before the public launch.',
    status: 'not-started',
    statusLabel: 'NOT STARTED',
    owner: { initials: 'D', name: 'Dito' },
    quarter: 'Q4 2026',
    dueDate: 'Dec 31, 2026',
    progress: 0,
    labels: [
      { id: 'l-4', name: 'Beta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
      { id: 'l-5', name: 'Growth', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    ],
    kpis: [
      { id: 'kpi-7', name: 'Beta user signups ≥ 100', current: '0', target: '100', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Dec 31' },
      { id: 'kpi-8', name: 'User retention ≥ 60%', current: '0%', target: '60%', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Dec 31' },
    ],
    linkedProjects: [],
    activity: [
      { id: 'a-6', actor: { initials: 'D', name: 'Dito' }, action: 'created goal', target: 'Q4 Launch Beta to 100 Users', time: '3d ago' },
    ],
  },
])

export const statusOptions: { value: Status; label: string }[] = [
  { value: 'on-track', label: 'On track' },
  { value: 'at-risk', label: 'At risk' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'not-started', label: 'Not started' },
]

export function goalById(id: string): Goal | undefined {
  return goals.value.find(goal => goal.id === id)
}

export function addGoal(goal: Goal) {
  goals.value.push(goal)
}

export function statusClasses(status: Status) {
  const map: Record<Status, string> = {
    'on-track': 'bg-green-50 text-green-600 border-green-200',
    'at-risk': 'bg-amber-50 text-amber-600 border-amber-200',
    delayed: 'bg-red-50 text-red-600 border-red-200',
    'not-started': 'bg-gray-50 text-gray-500 border-gray-200',
  }
  return map[status] ?? map['not-started']
}

export function progressBarColor(progress: number) {
  if (progress >= 75) return 'bg-green-600'
  if (progress >= 25) return 'bg-amber-600'
  return 'bg-gray-500'
}
