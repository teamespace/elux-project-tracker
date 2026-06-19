export interface Notification {
  id: string
  type: 'mention' | 'assignment' | 'status' | 'comment'
  actor: { name: string; avatar?: string }
  text: string
  time: string
  read: boolean
}

export const notifications = ref<Notification[]>([
  {
    id: 'n-1',
    type: 'mention',
    actor: { name: 'Maya' },
    text: 'mentioned you in "Auth Redesign"',
    time: 'Just now',
    read: false,
  },
  {
    id: 'n-2',
    type: 'assignment',
    actor: { name: 'Dito' },
    text: 'assigned you "IA Draft"',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n-3',
    type: 'status',
    actor: { name: 'Rasya' },
    text: 'created project "Alpha"',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n-4',
    type: 'status',
    actor: { name: 'Beta Launch' },
    text: 'moved to On Track',
    time: '2 days ago',
    read: true,
  },
])

export function unreadCount() {
  return notifications.value.filter(n => !n.read).length
}

export function markAllRead() {
  notifications.value.forEach(n => { n.read = true })
}
