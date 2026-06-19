<script setup lang="ts">
import { getAvatar } from '~/shared/avatar'

definePageMeta({
  layout: 'default',
  title: 'Dashboard',
})

interface StatCard {
  label: string
  value: number
  sub: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
}

interface Project {
  id: string
  name: string
  status: 'on-track' | 'at-risk' | 'delayed' | 'not-started'
  statusLabel: string
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
  time: string
}

const stats: StatCard[] = [
  { label: 'Open Tasks', value: 42, sub: '12% vs last week', icon: 'ph:check-square', trend: 'up' },
  { label: 'At Risk', value: 7, sub: '3% vs last week', icon: 'ph:warning', trend: 'down' },
  { label: 'Due This Week', value: 11, sub: '5% vs last week', icon: 'ph:calendar', trend: 'up' },
  { label: 'Completed', value: 28, sub: '8% vs last week', icon: 'ph:check-circle', trend: 'up' },
]

const projects: Project[] = [
  {
    id: 'proj-1', name: 'Alpha Project', status: 'at-risk', statusLabel: 'AT RISK',
    description: 'Redesigning core product UX', progress: 62, openTasks: 14, atRiskTasks: 2,
    dueDate: 'Aug 30, 2026', assignees: [
      { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') },
      { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') },
      { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') },
    ],
  },
  {
    id: 'proj-2', name: 'Beta Launch', status: 'on-track', statusLabel: 'ON TRACK',
    description: 'Public launch milestone Q3', progress: 78, openTasks: 9, atRiskTasks: 0,
    dueDate: 'Jul 15, 2026', assignees: [
      { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') },
      { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') },
    ],
  },
  {
    id: 'proj-3', name: 'Internal Tools', status: 'not-started', statusLabel: 'NOT STARTED',
    description: 'Tracker revamp, design system', progress: 0, openTasks: 0, atRiskTasks: 0,
    dueDate: 'Sep 10, 2026', createdDate: 'Jun 20, 2026', assignees: [],
  },
]

const criticalIssues: CriticalIssue[] = [
  { id: 'ci-1', riskLevel: 'HIGH', riskLabel: 'HIGH', title: 'Auth redesign implementation', project: 'Alpha Project', assignee: 'Dito', status: 'overdue', statusLabel: 'OVERDUE' },
  { id: 'ci-2', riskLevel: 'HIGH', riskLabel: 'HIGH', title: 'API rate limit specification', project: 'Beta Launch', assignee: null, status: 'at-risk', statusLabel: 'AT RISK' },
  { id: 'ci-3', riskLevel: 'MEDIUM', riskLabel: 'MED', title: 'Onboarding copy finalization', project: 'Internal Tools', assignee: 'Rara', status: 'not-started', statusLabel: 'NOT STARTED' },
]

const activity: ActivityItem[] = [
  { id: 'a-1', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'moved', target: '\u201CLogin flow\u201D to In Review', time: '10m ago' },
  { id: 'a-2', actor: { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') }, action: 'created epic', target: '\u201CAnalytics v2\u201D', time: '1h ago' },
  { id: 'a-3', actor: { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') }, action: 'completed', target: '\u201CDB schema review\u201D', time: '2h ago' },
  { id: 'a-4', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'commented on', target: '\u201CFigma export spec\u201D', time: '3h ago' },
  { id: 'a-5', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'added comment on', target: '\u201CFigma export spec\u201D', time: '1d ago' },
  { id: 'a-6', actor: { initials: 'S', name: 'System' }, action: 'ended', target: 'Sprint 4', time: '1d ago' },
]

</script>

<template>
  <div class="space-y-6">
    <DashboardStatCards :stats="stats" />

    <DashboardProjectCards :projects="projects" />

    <!-- Critical Issues + Activity -->
    <div class="flex gap-6">
      <DashboardCriticalIssues :issues="criticalIssues" class="flex-[3]" />
      <DashboardRecentActivity :activity="activity" class="flex-[2]" />
    </div>
  </div>
</template>
