// styled: agent-4
<script setup lang="ts">
import { getAvatar } from '~/shared/avatar'

definePageMeta({
  layout: 'default',
  title: 'Dashboard',
  middleware: 'auth',
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

const { data: dash, pending: loading } = await useAsyncData('dashboard', () => $fetch('/api/dashboard'))

const { data: projectsData } = await useAsyncData('projects', () => $fetch('/api/projects'))

const projects = ref<Project[]>([])
watchEffect(() => {
  if (projectsData.value) {
    projects.value = projectsData.value as Project[]
  }
})

function deleteProject(id: string) {
  projects.value = projects.value.filter(p => p.id !== id)
}

const stats = computed<StatCard[]>(() => {
  if (!dash.value) return []
  const s = dash.value.stats
  return [
    {
      label: 'Open Tasks',
      value: s.total,
      sub: `${s.done} done this week`,
      icon: 'ph:check-square',
      trend: 'up',
      iconColor: 'blue',
      progress: { pct: s.total > 0 ? Math.round((s.done / s.total) * 100) : 0, color: 'bg-green-500', caption: `${Math.round((s.done / s.total) * 100)}% of weekly target complete` },
    },
    {
      label: 'At Risk',
      value: s.atRisk,
      sub: `${s.overdue} overdue tasks`,
      icon: 'ph:warning',
      trend: 'down',
      iconColor: 'red',
      miniBars: [
        { label: 'Overdue', value: s.overdue, pct: s.atRisk > 0 ? Math.round((s.overdue / s.atRisk) * 100) : 0, color: 'bg-red-500' },
        { label: 'Blocked', value: s.inProgress, pct: s.atRisk > 0 ? Math.round((s.inProgress / s.atRisk) * 100) : 0, color: 'bg-amber-500' },
      ],
    },
    {
      label: 'Due This Week',
      value: s.total - s.done,
      sub: `${s.totalProjects} active projects`,
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
      percent: s.total > 0 ? Math.round((s.done / s.total) * 100) : 0,
      sub: `${Math.round((s.done / s.total) * 100)}% this week`,
      icon: 'ph:activity',
      trend: 'up',
      iconColor: 'green',
      stacked: [
        { label: 'Done', value: s.done, color: 'bg-green-500', textColor: 'text-green-600' },
        { label: 'Active', value: s.inProgress, color: 'bg-blue-500', textColor: 'text-blue-600' },
        { label: 'At Risk', value: s.atRisk, color: 'bg-amber-500', textColor: 'text-amber-600' },
      ],
    },
  ]
})

const criticalIssues = computed<CriticalIssue[]>(() => dash.value?.criticalIssues ?? [])

const activity = computed<ActivityItem[]>(() => dash.value?.activity ?? [])
</script>

<template>
  <div class="flex flex-col gap-4">
    <DashboardStatCards :stats="stats" />

    <DashboardCriticalIssues :issues="criticalIssues" />

    <div class="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-[1fr_280px]">
      <DashboardProjectCards :projects="projects" @delete="deleteProject" />
      <div class="h-full min-h-0 overflow-hidden">
        <DashboardRecentActivity :activity="activity" />
      </div>
    </div>
  </div>
</template>
