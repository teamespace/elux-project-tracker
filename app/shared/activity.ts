// styled: agent-6
import { getAvatar } from './avatar'

export interface ActivityActor {
  initials: string
  name: string
  color: string
  avatar: string
}

export type ActivityType = 'moved' | 'created' | 'completed' | 'commented' | 'assigned'

export interface ActivityItem {
  id: string
  actor: ActivityActor
  text: string
  project: string
  time: string
  type: ActivityType
  person: string
}

export const activityItems: ActivityItem[] = [
  {
    id: 'a-1',
    actor: { initials: 'RA', name: 'Rasya', color: '#6366F1', avatar: getAvatar('Rasya') },
    text: 'moved "Login flow" to In Review',
    project: 'Alpha Project',
    time: '10m ago',
    type: 'moved',
    person: 'Rasya',
  },
  {
    id: 'a-2',
    actor: { initials: 'M', name: 'Maya', color: '#22C55E', avatar: getAvatar('Maya') },
    text: 'created epic "Analytics v2"',
    project: 'Analytics Dashboard',
    time: '1h ago',
    type: 'created',
    person: 'Maya',
  },
  {
    id: 'a-3',
    actor: { initials: 'D', name: 'Dito', color: '#3B82F6', avatar: getAvatar('Dito') },
    text: 'completed "DB schema review"',
    project: 'API Gateway',
    time: '2h ago',
    type: 'completed',
    person: 'Dito',
  },
  {
    id: 'a-4',
    actor: { initials: 'RA', name: 'Rasya', color: '#6366F1', avatar: getAvatar('Rasya') },
    text: 'commented on "Figma export spec"',
    project: 'Design System v2',
    time: '3h ago',
    type: 'commented',
    person: 'Rasya',
  },
  {
    id: 'a-5',
    actor: { initials: 'R', name: 'Rara', color: '#F59E0B', avatar: getAvatar('Rara') },
    text: 'assigned "Onboarding copy" to herself',
    project: 'Internal Tools',
    time: '5h ago',
    type: 'assigned',
    person: 'Rara',
  },
  {
    id: 'a-6',
    actor: { initials: 'L', name: 'Lintang', color: '#EC4899', avatar: getAvatar('Lintang') },
    text: 'created goal "Q3 Public Launch"',
    project: 'Beta Launch',
    time: 'Yesterday',
    type: 'created',
    person: 'Lintang',
  },
  {
    id: 'a-7',
    actor: { initials: 'D', name: 'Dito', color: '#3B82F6', avatar: getAvatar('Dito') },
    text: 'updated priority of "Auth redesign" to High',
    project: 'Alpha Project',
    time: 'Yesterday',
    type: 'moved',
    person: 'Dito',
  },
  {
    id: 'a-8',
    actor: { initials: 'M', name: 'Maya', color: '#22C55E', avatar: getAvatar('Maya') },
    text: 'closed milestone "Beta Prep"',
    project: 'Beta Launch',
    time: '2 days ago',
    type: 'completed',
    person: 'Maya',
  },
  {
    id: 'a-9',
    actor: { initials: 'RA', name: 'Rasya', color: '#6366F1', avatar: getAvatar('Rasya') },
    text: 'created task "iOS push notification spec"',
    project: 'Mobile App MVP',
    time: '2 days ago',
    type: 'created',
    person: 'Rasya',
  },
  {
    id: 'a-10',
    actor: { initials: 'L', name: 'Lintang', color: '#EC4899', avatar: getAvatar('Lintang') },
    text: 'completed "Self-serve billing setup"',
    project: 'Customer Portal',
    time: '3 days ago',
    type: 'completed',
    person: 'Lintang',
  },
]

export const activityActionOptions: { value: ActivityType; label: string }[] = [
  { value: 'moved', label: 'Moved' },
  { value: 'created', label: 'Created' },
  { value: 'completed', label: 'Completed' },
  { value: 'commented', label: 'Commented' },
  { value: 'assigned', label: 'Assigned' },
]

export const activityPeopleOptions: string[] = ['Rasya', 'Dito', 'Maya', 'Rara', 'Lintang']
