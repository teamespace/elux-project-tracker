// styled: agent-4
<script setup lang="ts">
import { getAvatar } from '~/shared/avatar'

definePageMeta({
  layout: 'default',
  title: 'Dashboard',
})

interface StatCard {
  label: string
  value?: number
  percent?: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
  iconColor?: 'blue' | 'red' | 'amber' | 'green'
  valueColor?: string
  progress?: { pct: number; color: string; caption: string }
  miniBars?: { label: string; value: number; pct: number; color: string }[]
  chartType?: 'line' | 'bar' | 'donut'
  chartData?: number[]
  chartValue?: number
  chartColor?: string
  fullWidthChart?: boolean
  stacked?: { label: string; value: number; color: string; textColor?: string }[]
}

interface Project {
  id: string
  name: string
  status: 'on-track' | 'at-risk' | 'delayed' | 'not-started'
  statusLabel: string
  priority: 'high' | 'medium' | 'low'
  priorityLabel: string
  description: string
  progress: number
  openTasks: number
  atRiskTasks: number
  dueDate: string
  createdDate?: string
  assignees: { initials: string; name: string; avatar: string }[]
}

interface CriticalIssue {
  id: string
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  riskLabel: string
  title: string
  project: string
  assignee: string | null
  status: 'overdue' | 'at-risk' | 'not-started' | 'done'
  statusLabel: string
}

interface ActivityItem {
  id: string
  actor: { initials: string; name: string; avatar?: string }
  action: string
  target: string
  project?: string
  time: string
}

const stats: StatCard[] = [
  {
    label: 'Open Tasks',
    value: 42,
    sub: '12% vs last week',
    icon: 'ph:check-square',
    trend: 'up',
    iconColor: 'blue',
    progress: { pct: 68, color: 'bg-green-500', caption: '68% of weekly target complete' },
  },
  {
    label: 'At Risk',
    value: 7,
    sub: '3 fewer this week',
    icon: 'ph:warning',
    trend: 'down',
    iconColor: 'red',
    miniBars: [
      { label: 'Overdue', value: 5, pct: 71, color: 'bg-red-500' },
      { label: 'Blocked', value: 2, pct: 29, color: 'bg-amber-500' },
    ],
  },
  {
    label: 'Due This Week',
    value: 11,
    sub: '5% vs last month',
    icon: 'ph:calendar',
    trend: 'up',
    iconColor: 'amber',
    chartType: 'line',
    chartData: [2, 4, 6, 9, 11, 10, 8, 6, 4, 7, 11, 9, 5],
    chartColor: '#22C55E',
    fullWidthChart: true,
  },
  {
    label: 'Completion Rate',
    percent: 72,
    sub: '8% this week',
    icon: 'ph:activity',
    trend: 'up',
    iconColor: 'green',
    stacked: [
      { label: 'Done', value: 28, color: 'bg-green-500', textColor: 'text-green-600' },
      { label: 'Active', value: 9, color: 'bg-blue-500', textColor: 'text-blue-600' },
      { label: 'At Risk', value: 5, color: 'bg-amber-500', textColor: 'text-amber-600' },
    ],
  },
]

const projects: Project[] = [
  {
    id: 'proj-1', name: 'Alpha Project', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High',
    description: 'Redesigning core product UX', progress: 38, openTasks: 14, atRiskTasks: 2,
    dueDate: 'Aug 30, 2026', assignees: [
      { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') },
      { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') },
      { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') },
      { initials: 'R', name: 'Rara', avatar: getAvatar('Rara') },
      { initials: 'L', name: 'Lintang', avatar: getAvatar('Lintang') },
    ],
  },
  {
    id: 'proj-2', name: 'Beta Launch', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium',
    description: 'Public launch milestone Q3', progress: 65, openTasks: 9, atRiskTasks: 0,
    dueDate: 'Jul 15, 2026', assignees: [
      { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') },
      { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') },
      { initials: 'R', name: 'Rara', avatar: getAvatar('Rara') },
      { initials: 'L', name: 'Lintang', avatar: getAvatar('Lintang') },
    ],
  },
  {
    id: 'proj-3', name: 'Internal Tools', status: 'not-started', statusLabel: 'Not Started', priority: 'low', priorityLabel: 'Low',
    description: 'Tracker revamp, design system', progress: 8, openTasks: 0, atRiskTasks: 0,
    dueDate: 'Sep 10, 2026', createdDate: 'Jun 20, 2026', assignees: [
      { initials: 'R', name: 'Rara', avatar: getAvatar('Rara') },
    ],
  },
  {
    id: 'proj-4', name: 'Design System v2', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium',
    description: 'Updated tokens and components', progress: 52, openTasks: 6, atRiskTasks: 1,
    dueDate: 'Jul 28, 2026', assignees: [
      { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') },
      { initials: 'A', name: 'Aldo', avatar: getAvatar('Aldo') },
    ],
  },
  {
    id: 'proj-5', name: 'Mobile App MVP', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High',
    description: 'iOS and Android MVP launch', progress: 44, openTasks: 11, atRiskTasks: 3,
    dueDate: 'Jun 30, 2026', assignees: [
      { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') },
      { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') },
      { initials: 'L', name: 'Lintang', avatar: getAvatar('Lintang') },
    ],
  },
]

const criticalIssues: CriticalIssue[] = [
  { id: 'ci-1', riskLevel: 'HIGH', riskLabel: 'HIGH', title: 'Auth redesign implementation', project: 'Alpha Project', assignee: 'Dito', status: 'overdue', statusLabel: 'Overdue' },
  { id: 'ci-2', riskLevel: 'HIGH', riskLabel: 'HIGH', title: 'API rate limit specification', project: 'Beta Launch', assignee: null, status: 'at-risk', statusLabel: 'At Risk' },
  { id: 'ci-3', riskLevel: 'MEDIUM', riskLabel: 'MED', title: 'Onboarding copy finalization', project: 'Internal Tools', assignee: 'Rara', status: 'not-started', statusLabel: 'Not Started' },
]

const activity: ActivityItem[] = [
  { id: 'a-1', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'moved', target: '"Login flow" to In Review', project: 'Alpha Project', time: '10m ago' },
  { id: 'a-2', actor: { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') }, action: 'created epic', target: '"Analytics v2"', project: 'Analytics Dashboard', time: '1h ago' },
  { id: 'a-3', actor: { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') }, action: 'completed', target: '"DB schema review"', project: 'API Gateway', time: '2h ago' },
  { id: 'a-4', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'commented on', target: '"Figma export spec"', project: 'Design System v2', time: '3h ago' },
  { id: 'a-5', actor: { initials: 'R', name: 'Rara', avatar: getAvatar('Rara') }, action: 'assigned', target: '"Onboarding copy" to herself', project: 'Internal Tools', time: '5h ago' },
  { id: 'a-6', actor: { initials: 'L', name: 'Lintang', avatar: getAvatar('Lintang') }, action: 'created goal', target: '"Q3 Public Launch"', project: 'Beta Launch', time: 'Yesterday' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <DashboardStatCards :stats="stats" />

    <DashboardCriticalIssues :issues="criticalIssues" />

    <div class="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-[1fr_280px]">
      <DashboardProjectCards :projects="projects" />
      <div class="h-full min-h-0 overflow-hidden">
        <DashboardRecentActivity :activity="activity" />
      </div>
    </div>
  </div>
</template>
