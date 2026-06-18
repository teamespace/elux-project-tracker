export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Assignee {
  id: string
  initials: string
  name: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  statusLabel: string
  priority: TaskPriority
  priorityLabel: string
  assignee: Assignee
  epicId: string
  epicName: string
  projectId: string
  projectName: string
  dueDate: string
  dueDateLabel: string
  progress: number
  comments: number
  attachments: number
}

export interface Status {
  id: TaskStatus
  label: string
  color: string
  dotColor: string
  headerText: string
  bg: string
}

export const statuses: Status[] = [
  { id: 'todo', label: 'To Do', color: 'gray', dotColor: 'bg-gray-400', headerText: 'text-gray-500', bg: 'bg-gray-50' },
  { id: 'in-progress', label: 'In Progress', color: 'blue', dotColor: 'bg-blue-500', headerText: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'in-review', label: 'In Review', color: 'amber', dotColor: 'bg-amber-500', headerText: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'done', label: 'Done', color: 'green', dotColor: 'bg-green-500', headerText: 'text-green-600', bg: 'bg-green-50' },
]

export const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'done', label: 'Done' },
]

export const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const assigneeOptions = ['Rasya', 'Dito', 'Maya', 'Rara']
export const projectOptions = ['Auth', 'Settings', 'API', 'Core']

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Login page redesign',
    description: 'Redesign the login page to align with the new brand identity and improve conversion.',
    status: 'in-review',
    statusLabel: 'In Review',
    priority: 'high',
    priorityLabel: 'High',
    assignee: { id: 'user-1', initials: 'R', name: 'Rasya' },
    epicId: 'epic-1',
    epicName: 'Auth',
    projectId: 'project-1',
    projectName: 'Auth',
    dueDate: '2026-07-10',
    dueDateLabel: 'Jul 10',
    progress: 80,
    comments: 4,
    attachments: 2,
  },
  {
    id: 'task-2',
    title: 'Signup form validation',
    description: 'Add client-side and server-side validation rules to the signup form.',
    status: 'in-progress',
    statusLabel: 'In Progress',
    priority: 'high',
    priorityLabel: 'High',
    assignee: { id: 'user-2', initials: 'D', name: 'Dito' },
    epicId: 'epic-1',
    epicName: 'Auth',
    projectId: 'project-1',
    projectName: 'Auth',
    dueDate: '2026-07-15',
    dueDateLabel: 'Jul 15',
    progress: 45,
    comments: 1,
    attachments: 0,
  },
  {
    id: 'task-3',
    title: 'Email verification flow',
    description: 'Implement the end-to-end email verification flow with resend capabilities.',
    status: 'todo',
    statusLabel: 'To Do',
    priority: 'medium',
    priorityLabel: 'Medium',
    assignee: { id: 'user-3', initials: 'M', name: 'Maya' },
    epicId: 'epic-1',
    epicName: 'Auth',
    projectId: 'project-1',
    projectName: 'Auth',
    dueDate: '2026-07-20',
    dueDateLabel: 'Jul 20',
    progress: 0,
    comments: 0,
    attachments: 0,
  },
  {
    id: 'task-4',
    title: 'Password reset UX',
    description: 'Simplify the password reset experience and clarify error messaging.',
    status: 'todo',
    statusLabel: 'To Do',
    priority: 'low',
    priorityLabel: 'Low',
    assignee: { id: 'user-4', initials: 'R', name: 'Rara' },
    epicId: 'epic-1',
    epicName: 'Auth',
    projectId: 'project-1',
    projectName: 'Auth',
    dueDate: '2026-07-25',
    dueDateLabel: 'Jul 25',
    progress: 0,
    comments: 0,
    attachments: 1,
  },
  {
    id: 'task-5',
    title: 'Profile editing UI',
    description: 'Design and build the profile editing interface with avatar upload and field validation.',
    status: 'in-progress',
    statusLabel: 'In Progress',
    priority: 'medium',
    priorityLabel: 'Medium',
    assignee: { id: 'user-1', initials: 'R', name: 'Rasya' },
    epicId: 'epic-2',
    epicName: 'Settings',
    projectId: 'project-2',
    projectName: 'Settings',
    dueDate: '2026-08-05',
    dueDateLabel: 'Aug 5',
    progress: 30,
    comments: 2,
    attachments: 1,
  },
  {
    id: 'task-6',
    title: 'Notification settings',
    description: 'Create the notification preferences page for email and in-app alerts.',
    status: 'todo',
    statusLabel: 'To Do',
    priority: 'low',
    priorityLabel: 'Low',
    assignee: { id: 'user-4', initials: 'R', name: 'Rara' },
    epicId: 'epic-2',
    epicName: 'Settings',
    projectId: 'project-2',
    projectName: 'Settings',
    dueDate: '2026-08-15',
    dueDateLabel: 'Aug 15',
    progress: 0,
    comments: 0,
    attachments: 0,
  },
  {
    id: 'task-7',
    title: 'Account deletion flow',
    description: 'Build a secure account deletion flow with confirmation steps and data retention notices.',
    status: 'todo',
    statusLabel: 'To Do',
    priority: 'medium',
    priorityLabel: 'Medium',
    assignee: { id: 'user-3', initials: 'M', name: 'Maya' },
    epicId: 'epic-2',
    epicName: 'Settings',
    projectId: 'project-2',
    projectName: 'Settings',
    dueDate: '2026-08-20',
    dueDateLabel: 'Aug 20',
    progress: 0,
    comments: 0,
    attachments: 0,
  },
  {
    id: 'task-8',
    title: 'Endpoint reference docs',
    description: 'Publish the complete API endpoint reference with request and response examples.',
    status: 'done',
    statusLabel: 'Done',
    priority: 'high',
    priorityLabel: 'High',
    assignee: { id: 'user-3', initials: 'M', name: 'Maya' },
    epicId: 'epic-3',
    epicName: 'API',
    projectId: 'project-3',
    projectName: 'API',
    dueDate: '2026-07-05',
    dueDateLabel: 'Jul 5',
    progress: 100,
    comments: 6,
    attachments: 3,
  },
  {
    id: 'task-9',
    title: 'Auth guide & examples',
    description: 'Write the authentication integration guide with code samples in multiple languages.',
    status: 'in-review',
    statusLabel: 'In Review',
    priority: 'medium',
    priorityLabel: 'Medium',
    assignee: { id: 'user-3', initials: 'M', name: 'Maya' },
    epicId: 'epic-3',
    epicName: 'API',
    projectId: 'project-3',
    projectName: 'API',
    dueDate: '2026-07-12',
    dueDateLabel: 'Jul 12',
    progress: 75,
    comments: 3,
    attachments: 2,
  },
  {
    id: 'task-10',
    title: 'SDK quickstart',
    description: 'Create a quickstart guide for installing and using the official SDK.',
    status: 'in-progress',
    statusLabel: 'In Progress',
    priority: 'low',
    priorityLabel: 'Low',
    assignee: { id: 'user-4', initials: 'R', name: 'Rara' },
    epicId: 'epic-3',
    epicName: 'API',
    projectId: 'project-3',
    projectName: 'API',
    dueDate: '2026-07-18',
    dueDateLabel: 'Jul 18',
    progress: 35,
    comments: 1,
    attachments: 1,
  },
  {
    id: 'task-11',
    title: 'Sidebar nav refinement',
    description: 'Refine the sidebar navigation with collapsible sections and keyboard shortcuts.',
    status: 'done',
    statusLabel: 'Done',
    priority: 'low',
    priorityLabel: 'Low',
    assignee: { id: 'user-1', initials: 'R', name: 'Rasya' },
    epicId: 'epic-4',
    epicName: 'Core',
    projectId: 'project-4',
    projectName: 'Core',
    dueDate: '2026-06-30',
    dueDateLabel: 'Jun 30',
    progress: 100,
    comments: 2,
    attachments: 0,
  },
  {
    id: 'task-12',
    title: 'KPI chart component',
    description: 'Build a reusable KPI chart component for dashboards and reports.',
    status: 'todo',
    statusLabel: 'To Do',
    priority: 'medium',
    priorityLabel: 'Medium',
    assignee: { id: 'user-2', initials: 'D', name: 'Dito' },
    epicId: 'epic-4',
    epicName: 'Core',
    projectId: 'project-4',
    projectName: 'Core',
    dueDate: '2026-08-25',
    dueDateLabel: 'Aug 25',
    progress: 0,
    comments: 0,
    attachments: 0,
  },
]
