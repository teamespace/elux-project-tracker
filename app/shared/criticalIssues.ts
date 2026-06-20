// styled: agent-6
export type CriticalIssuePriority = 'High' | 'Medium'
export type CriticalIssueStatus = 'Overdue' | 'At Risk' | 'Not Started'

export interface CriticalIssue {
  id: string
  priority: CriticalIssuePriority
  priorityLabel: string
  title: string
  subtitle: string
  project: string
  assignee: string
  status: CriticalIssueStatus
  statusLabel: string
}

export const criticalIssues: CriticalIssue[] = [
  {
    id: 'ci-1',
    priority: 'High',
    priorityLabel: 'HIGH',
    title: 'Auth redesign implementation',
    subtitle: 'Blocking login flow for new users',
    project: 'Alpha Project',
    assignee: 'Dito',
    status: 'Overdue',
    statusLabel: 'Overdue',
  },
  {
    id: 'ci-2',
    priority: 'High',
    priorityLabel: 'HIGH',
    title: 'API rate limit specification',
    subtitle: 'Missing specs before dev handoff',
    project: 'Beta Launch',
    assignee: 'Unassigned',
    status: 'At Risk',
    statusLabel: 'At Risk',
  },
  {
    id: 'ci-3',
    priority: 'High',
    priorityLabel: 'HIGH',
    title: 'Mobile checkout flow blocked',
    subtitle: 'Payment gateway integration stalled',
    project: 'Mobile App MVP',
    assignee: 'Dito',
    status: 'Overdue',
    statusLabel: 'Overdue',
  },
  {
    id: 'ci-4',
    priority: 'Medium',
    priorityLabel: 'MED',
    title: 'Token naming inconsistency',
    subtitle: 'Affecting component library export',
    project: 'Design System v2',
    assignee: 'Rasya',
    status: 'At Risk',
    statusLabel: 'At Risk',
  },
  {
    id: 'ci-5',
    priority: 'Medium',
    priorityLabel: 'MED',
    title: 'Onboarding copy finalization',
    subtitle: 'Copy needed for QA sign-off',
    project: 'Internal Tools',
    assignee: 'Rara',
    status: 'Not Started',
    statusLabel: 'Not Started',
  },
]

export const issueStatusOptions: CriticalIssueStatus[] = ['Overdue', 'At Risk', 'Not Started']
export const issuePriorityOptions: CriticalIssuePriority[] = ['High', 'Medium']
