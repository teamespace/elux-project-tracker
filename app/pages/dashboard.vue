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
  chartType: 'line' | 'bar' | 'donut'
  chartData: number[] | { label: string; value: number; color: string }[]
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
  {
    label: 'Open Tasks',
    value: 42,
    sub: '+12% vs last week',
    icon: 'ph:check-square',
    trend: 'up',
    chartType: 'line',
    chartData: [32, 35, 38, 36, 40, 39, 42],
  },
  {
    label: 'At Risk',
    value: 7,
    sub: '-3% vs last week',
    icon: 'ph:warning',
    trend: 'down',
    chartType: 'bar',
    chartData: [12, 10, 9, 11, 8, 7, 7],
  },
  {
    label: 'Completed',
    value: 28,
    sub: '+8% vs last week',
    icon: 'ph:check-circle',
    trend: 'up',
    chartType: 'donut',
    chartData: [
      { label: 'Completed', value: 28, color: '#10B981' },
      { label: 'Remaining', value: 14, color: '#E5E7EB' },
    ],
  },
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
  { id: 'a-1', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'moved', target: '“Login flow” to In Review', time: '10m ago' },
  { id: 'a-2', actor: { initials: 'M', name: 'Maya', avatar: getAvatar('Maya') }, action: 'created epic', target: '“Analytics v2”', time: '1h ago' },
  { id: 'a-3', actor: { initials: 'D', name: 'Dito', avatar: getAvatar('Dito') }, action: 'completed', target: '“DB schema review”', time: '2h ago' },
  { id: 'a-4', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'commented on', target: '“Figma export spec”', time: '3h ago' },
  { id: 'a-5', actor: { initials: 'R', name: 'Rasya', avatar: getAvatar('Rasya') }, action: 'added comment on', target: '“Figma export spec”', time: '1d ago' },
  { id: 'a-6', actor: { initials: 'S', name: 'System' }, action: 'ended', target: 'Sprint 4', time: '1d ago' },
]

const completionData = [
  { label: 'Jan', value: 18 },
  { label: 'Feb', value: 22 },
  { label: 'Mar', value: 20 },
  { label: 'Apr', value: 26 },
  { label: 'May', value: 24 },
  { label: 'Jun', value: 30 },
  { label: 'Jul', value: 28 },
  { label: 'Aug', value: 35 },
  { label: 'Sep', value: 32 },
  { label: 'Oct', value: 38 },
  { label: 'Nov', value: 42 },
  { label: 'Dec', value: 48 },
]
</script>

<template>
  <div class="space-y-8">
    <!-- KPI Row -->
    <DashboardStatCards :stats="stats" />

    <!-- Hero Chart -->
    <DashboardAreaChart
      title="Completed tasks"
      subtitle="Last 12 months"
      :data="completionData"
    />

    <!-- Projects -->
    <DashboardProjectCards :projects="projects" />

    <!-- Critical Issues + Activity -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <DashboardCriticalIssues :issues="criticalIssues" class="lg:col-span-3" />
      <DashboardRecentActivity :activity="activity" class="lg:col-span-2" />
    </div>
  </div>
</template>
