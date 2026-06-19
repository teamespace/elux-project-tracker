<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  assigneeOptions,
  priorityOptions,
  projectOptions,
  statuses,
  statusOptions,
  tasks,
  type Assignee,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '~/shared/board'

interface Comment {
  id: string
  author: Assignee
  text: string
  time: string
}

interface Activity {
  id: string
  actor: Assignee
  text: string
  time: string
}

interface Attachment {
  id: string
  name: string
  size: number
  type: string
}

interface Subtask {
  id: string
  title: string
  done: boolean
  dueDate: string
  assignee: string
}

interface TaskDetailExtras {
  labels: string[]
  comments: Comment[]
  activities: Activity[]
  subtasks: Subtask[]
  attachments: Attachment[]
  startDate?: string
  type?: string
  link?: string
  notionUrl?: string
  figmaUrl?: string
}

interface TaskForm {
  title: string
  status: TaskStatus
  assignee: string
  priority: TaskPriority
  dueDate: string
  project: string
  startDate: string
  type: string
  labels: string[]
  description: string
  link: string
  notionUrl: string
  figmaUrl: string
}

const props = withDefaults(defineProps<{
  taskId?: string | null
  mode?: 'create' | 'edit' | 'view'
  variant?: 'slide-over' | 'page'
  draft?: Partial<Task>
}>(), {
  taskId: null,
  mode: 'edit',
  variant: 'page',
  draft: undefined,
})

const emit = defineEmits<{
  close: []
}>()

const taskDetails: Record<string, TaskDetailExtras> = {
  'task-1': {
    labels: ['design', 'auth'],
    comments: [
      { id: 'c1', author: { id: 'user-1', initials: 'R', name: 'Rasya' }, text: 'Flagged as high priority — needs to ship by the 10th.', time: 'Jun 17, 10:30am' },
      { id: 'c2', author: { id: 'user-2', initials: 'D', name: 'Dito' }, text: 'Reviewing the form component now. Validation looks solid.', time: 'Jun 16, 3:15pm' },
      { id: 'c3', author: { id: 'user-1', initials: 'R', name: 'Rasya' }, text: 'Initial mockups pushed to Figma. Ready for dev handoff.', time: 'Jun 15, 9:00am' },
    ],
    activities: [
      { id: 'a1', actor: { id: 'user-1', initials: 'R', name: 'Rasya' }, text: 'changed status to In Review', time: 'Jun 17, 9:00am' },
      { id: 'a2', actor: { id: 'user-1', initials: 'R', name: 'Rasya' }, text: 'set priority to High', time: 'Jun 15, 9:00am' },
    ],
    subtasks: [
      { id: 'st-1', title: 'Draft wireframes', done: true, dueDate: '2026-07-05', assignee: 'Rasya' },
      { id: 'st-2', title: 'Design review with team', done: false, dueDate: '2026-07-08', assignee: 'Dito' },
    ],
    attachments: [
      { id: 'a1', name: 'login-mockup.png', size: 2457600, type: 'image/png' },
    ],
    startDate: '2026-07-01',
    type: 'Task',
  },
  'task-2': {
    labels: ['auth', 'backend'],
    comments: [
      { id: 'c4', author: { id: 'user-2', initials: 'D', name: 'Dito' }, text: 'Client-side validation is done. Moving to server-side checks.', time: 'Jun 17, 9:15am' },
    ],
    activities: [
      { id: 'a3', actor: { id: 'user-2', initials: 'D', name: 'Dito' }, text: 'changed status to In Progress', time: 'Jun 16, 2:00pm' },
    ],
    subtasks: [
      { id: 'st-3', title: 'Email regex validation', done: true, dueDate: '2026-07-10', assignee: 'Dito' },
      { id: 'st-4', title: 'Server-side rules', done: false, dueDate: '2026-07-14', assignee: 'Dito' },
    ],
    attachments: [],
    startDate: '2026-07-08',
    type: 'Task',
  },
  'task-5': {
    labels: ['settings', 'ui'],
    comments: [
      { id: 'c5', author: { id: 'user-3', initials: 'M', name: 'Maya' }, text: 'Please use the new AvatarUpload component from the design system.', time: 'Jun 29, 2:00pm' },
    ],
    activities: [
      { id: 'a4', actor: { id: 'user-3', initials: 'M', name: 'Maya' }, text: 'changed status to In Progress', time: 'Jun 28, 11:00am' },
    ],
    subtasks: [
      { id: 'st-5', title: 'Profile field layout', done: true, dueDate: '2026-08-01', assignee: 'Rasya' },
      { id: 'st-6', title: 'Avatar upload flow', done: false, dueDate: '2026-08-04', assignee: 'Rara' },
      { id: 'st-7', title: 'Validation messages', done: false, dueDate: '2026-08-05', assignee: 'Rasya' },
    ],
    attachments: [
      { id: 'a2', name: 'profile-spec.pdf', size: 1048576, type: 'application/pdf' },
    ],
    startDate: '2026-07-28',
    type: 'Task',
  },
  'task-8': {
    labels: ['api', 'docs'],
    comments: [
      { id: 'c6', author: { id: 'user-2', initials: 'D', name: 'Dito' }, text: 'Reviewed and approved. Great work!', time: 'Jul 5, 4:00pm' },
      { id: 'c7', author: { id: 'user-3', initials: 'M', name: 'Maya' }, text: 'All endpoint docs are complete. Ready for review.', time: 'Jul 4, 11:30am' },
    ],
    activities: [
      { id: 'a5', actor: { id: 'user-3', initials: 'M', name: 'Maya' }, text: 'changed status to Done', time: 'Jul 5, 4:00pm' },
      { id: 'a6', actor: { id: 'user-3', initials: 'M', name: 'Maya' }, text: 'added attachment endpoints-v1.pdf', time: 'Jul 4, 10:00am' },
    ],
    subtasks: [
      { id: 'st-8', title: 'Document auth endpoints', done: true, dueDate: '2026-07-02', assignee: 'Maya' },
      { id: 'st-9', title: 'Document user endpoints', done: true, dueDate: '2026-07-03', assignee: 'Maya' },
      { id: 'st-10', title: 'Publish reference page', done: true, dueDate: '2026-07-05', assignee: 'Maya' },
    ],
    attachments: [
      { id: 'a3', name: 'endpoints-v1.pdf', size: 3145728, type: 'application/pdf' },
    ],
    startDate: '2026-07-01',
    type: 'Task',
  },
}

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

function avatarColor(index: number) {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600', 'bg-indigo-600']
  return colors[index % colors.length]
}

const users = computed(() =>
  assigneeOptions.map((name, index) => ({
    name,
    initials: name.slice(0, 1).toUpperCase(),
    color: avatarColor(index),
  })),
)

function findUser(name: string) {
  return users.value.find(u => u.name === name) ?? { name, initials: name ? name.slice(0, 1).toUpperCase() : '?', color: 'bg-gray-400' }
}

function statusDotClass(status: TaskStatus) {
  return statuses.find(s => s.id === status)?.dotColor ?? 'bg-gray-400'
}

function priorityDotClass(priority: TaskPriority) {
  const map: Record<TaskPriority, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-gray-400',
  }
  return map[priority]
}

function emptyForm(): TaskForm {
  return {
    title: '',
    status: 'todo',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    project: '',
    startDate: '',
    type: 'Task',
    labels: [],
    description: '',
    link: '',
    notionUrl: '',
    figmaUrl: '',
  }
}

const form = ref<TaskForm>(emptyForm())
const subtasks = ref<Subtask[]>([])
const comments = ref<Comment[]>([])
const attachments = ref<Attachment[]>([])
const activities = ref<Activity[]>([])
const newLabel = ref('')
const newComment = ref('')
const showAddSubtask = ref(false)
const newSubtaskTitle = ref('')
const newSubtaskAssignee = ref('')
const attachmentError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const newAttachmentUrl = ref('')
const activeTab = ref('comments')

const task = computed<Task | null>(() => {
  if (props.mode === 'create' || !props.taskId) return null
  return tasks.find(t => t.id === props.taskId) ?? null
})

const taskKey = computed(() => {
  if (props.mode === 'create') return 'New task'
  if (!props.taskId) return ''
  const num = Number.parseInt(props.taskId.split('-').pop() || '', 10)
  if (Number.isNaN(num)) return props.taskId.toUpperCase()
  return `ELX-${String(num).padStart(3, '0')}`
})

const subtaskProgress = computed(() => {
  const total = subtasks.value.length
  const done = subtasks.value.filter(s => s.done).length
  const pct = total ? Math.round((done / total) * 100) : 0
  return { total, done, pct }
})

const isView = computed(() => props.mode === 'view')

const tabItems = computed(() => [
  { label: 'Comments', value: 'comments', slot: 'comments' as const, badge: comments.value.length || undefined },
  { label: 'Activities', value: 'activities', slot: 'activities' as const, badge: activities.value.length || undefined },
  { label: 'Attachments', value: 'attachments', slot: 'attachments' as const, badge: attachments.value.length || undefined },
])

function loadData() {
  if (props.mode === 'create') {
    form.value = emptyForm()
    const draft = props.draft
    if (draft) {
      form.value.title = draft.title ?? ''
      form.value.status = (draft.status as TaskStatus) ?? 'todo'
      form.value.priority = (draft.priority as TaskPriority) ?? 'medium'
      form.value.assignee = draft.assignee?.name ?? ''
      form.value.description = draft.description ?? ''
      form.value.project = draft.projectName ?? ''
      form.value.dueDate = draft.dueDate ?? ''
    }
    subtasks.value = []
    comments.value = []
    attachments.value = []
    activities.value = []
    activeTab.value = 'comments'
    return
  }

  const id = props.taskId
  const t = id ? tasks.find(item => item.id === id) : undefined
  const d = id ? taskDetails[id] : undefined

  if (t) {
    form.value = {
      title: t.title,
      status: t.status,
      assignee: t.assignee.name,
      priority: t.priority,
      dueDate: t.dueDate,
      project: t.projectName,
      startDate: d?.startDate ?? '',
      type: d?.type ?? 'Task',
      labels: d ? [...d.labels] : [],
      description: t.description,
      link: d?.link ?? '',
      notionUrl: d?.notionUrl ?? '',
      figmaUrl: d?.figmaUrl ?? '',
    }
  }
  else {
    form.value = emptyForm()
  }

  subtasks.value = d ? d.subtasks.map(s => ({ ...s })) : []
  comments.value = d ? d.comments.map(c => ({ ...c })) : []
  attachments.value = d ? d.attachments.map(a => ({ ...a })) : []
  activities.value = d ? d.activities.map(a => ({ ...a })) : []
  activeTab.value = 'comments'
}

watch(() => [props.taskId, props.mode, props.draft], () => loadData(), { immediate: true, deep: true })

function addLabel() {
  const label = newLabel.value.trim()
  if (label && !form.value.labels.includes(label)) {
    form.value.labels.push(label)
  }
  newLabel.value = ''
}

function removeLabel(label: string) {
  const index = form.value.labels.indexOf(label)
  if (index !== -1) {
    form.value.labels.splice(index, 1)
  }
}

function addComment() {
  const text = newComment.value.trim()
  if (!text) return
  comments.value.push({
    id: `c-${Date.now()}`,
    author: { id: 'me', initials: 'Y', name: 'You' },
    text,
    time: 'Just now',
  })
  newComment.value = ''
}

function addSubtask() {
  const title = newSubtaskTitle.value.trim()
  if (!title) return
  subtasks.value.push({
    id: `st-${Date.now()}`,
    title,
    done: false,
    dueDate: '',
    assignee: newSubtaskAssignee.value || form.value.assignee || '',
  })
  newSubtaskTitle.value = ''
  newSubtaskAssignee.value = ''
  showAddSubtask.value = false
}

function toggleSubtask(id: string) {
  const subtask = subtasks.value.find(s => s.id === id)
  if (subtask) {
    subtask.done = !subtask.done
  }
}

function deleteSubtask(id: string) {
  subtasks.value = subtasks.value.filter(s => s.id !== id)
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleFiles(files: FileList | null) {
  if (!files) return
  for (const file of Array.from(files)) {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      attachmentError.value = `${file.name} exceeds the 10 MB per-file limit.`
      setTimeout(() => {
        attachmentError.value = ''
      }, 4000)
      continue
    }
    attachments.value.push({
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  handleFiles(target.files)
  if (target) target.value = ''
}

function onDrop(event: DragEvent) {
  handleFiles(event.dataTransfer?.files ?? null)
}

function removeAttachment(id: string) {
  attachments.value = attachments.value.filter(a => a.id !== id)
}

function addUrl() {
  const url = newAttachmentUrl.value.trim()
  if (!url) return
  attachments.value.push({
    id: `a-${Date.now()}`,
    name: url,
    size: 0,
    type: 'text/uri-list',
  })
  newAttachmentUrl.value = ''
}

function onSubmit() {
  console.log(props.mode === 'create' ? 'Create task' : 'Update task', {
    ...form.value,
    subtasks: subtasks.value,
    comments: comments.value,
    attachments: attachments.value,
    activities: activities.value,
  })
  if (props.variant === 'slide-over') {
    emit('close')
  }
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Top action bar -->
    <div
      v-if="variant === 'slide-over'"
      class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3"
    >
      <UButton
        icon="ph:x"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        aria-label="Close"
        @click="emit('close')"
      />
      <UButton
        v-if="taskId && mode !== 'create'"
        :to="`/tasks/${taskId}`"
        icon="ph:arrow-square-out"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        aria-label="Open full page"
        @click="emit('close')"
      />
    </div>

    <!-- Empty state -->
    <template v-if="!task && mode !== 'create'">
      <div class="flex flex-1 flex-col items-center justify-center py-12 text-center">
        <UIcon name="ph:check-square" class="size-10 text-gray-400" />
        <p class="mt-3 text-base text-gray-500">
          Task not found
        </p>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-6" :class="variant === 'slide-over' ? 'px-5 py-5' : ''">
        <!-- Title + key -->
        <div>
          <UInput
            v-if="!isView"
            v-model="form.title"
            variant="none"
            size="xl"
            :disabled="isView"
            placeholder="Create task"
            class="w-full text-[22px] font-bold leading-tight text-gray-900 placeholder:text-gray-400"
            :ui="{ base: 'focus:ring-0 px-0' }"
          />
          <h1 v-else class="text-[22px] font-bold leading-tight text-gray-900">
            {{ form.title || 'Untitled' }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ taskKey }}
          </p>
        </div>

        <!-- Properties -->
        <div class="flex flex-col gap-1">
          <!-- Status -->
          <div class="flex flex-wrap items-center gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:flag" class="size-4 shrink-0" />
              <span>Status</span>
            </div>
            <div class="flex min-w-0 flex-1 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full" :class="statusDotClass(form.status)" />
              <USelect v-model="form.status" :items="statusOptions" value-key="value" label-key="label" :disabled="isView" size="sm" class="min-w-0 flex-1" />
            </div>
          </div>

          <!-- Priority -->
          <div class="flex flex-wrap items-center gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:warning-circle" class="size-4 shrink-0" />
              <span>Priority</span>
            </div>
            <div class="flex min-w-0 flex-1 items-center gap-2">
              <span class="size-2 shrink-0 rounded-full" :class="priorityDotClass(form.priority)" />
              <USelect v-model="form.priority" :items="priorityOptions" value-key="value" label-key="label" :disabled="isView" size="sm" class="min-w-0 flex-1" />
            </div>
          </div>

          <!-- Assignee -->
          <div class="flex flex-wrap items-center gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:user" class="size-4 shrink-0" />
              <span>Assignee</span>
            </div>
            <USelect v-model="form.assignee" :items="assigneeOptions" :disabled="isView" placeholder="Unassigned" size="sm" class="min-w-0 flex-1" />
          </div>

          <!-- Project -->
          <div class="flex flex-wrap items-center gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:folder" class="size-4 shrink-0" />
              <span>Project</span>
            </div>
            <USelect v-model="form.project" :items="projectOptions" :disabled="isView" placeholder="Select project" size="sm" class="min-w-0 flex-1" />
          </div>

          <!-- Due date -->
          <div class="flex flex-wrap items-center gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:calendar" class="size-4 shrink-0" />
              <span>Due date</span>
            </div>
            <UInput v-model="form.dueDate" type="date" :disabled="isView" size="sm" class="min-w-0 flex-1" />
          </div>

          <!-- Labels -->
          <div class="flex flex-wrap items-start gap-3 py-1.5 sm:flex-nowrap">
            <div class="flex w-28 shrink-0 items-center gap-2 text-sm text-gray-500">
              <UIcon name="ph:hash" class="size-4 shrink-0" />
              <span>Labels</span>
            </div>
            <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span
                v-for="label in form.labels"
                :key="label"
                class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
              >
                {{ label }}
                <UButton
                  v-if="!isView"
                  icon="ph:x"
                  color="neutral"
                  variant="link"
                  size="xs"
                  square
                  class="size-4"
                  @click="removeLabel(label)"
                />
              </span>
              <UInput
                v-if="!isView"
                v-model="newLabel"
                variant="none"
                size="sm"
                placeholder="+ Add label"
                class="min-w-[80px] flex-1"
                :ui="{ base: 'focus:ring-0 px-0' }"
                @keydown.enter.prevent="addLabel"
              />
              <span v-else-if="!form.labels.length" class="text-sm text-gray-400">None</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Description
          </h3>
          <UTextarea
            v-model="form.description"
            :rows="4"
            :disabled="isView"
            placeholder="Add a description..."
            class="w-full"
          />
        </div>

        <!-- Subtasks -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">
              Subtasks
            </h3>
            <span class="text-xs text-gray-500">
              {{ subtaskProgress.done }} / {{ subtaskProgress.total }} done · {{ subtaskProgress.pct }}%
            </span>
          </div>

          <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full bg-blue-600 transition-all duration-300"
              :style="{ width: `${subtaskProgress.pct}%` }"
            />
          </div>

          <div v-if="subtasks.length" class="flex flex-col gap-1">
            <div
              v-for="subtask in subtasks"
              :key="subtask.id"
              class="group flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 hover:border-gray-300 sm:flex-nowrap"
            >
              <UCheckbox
                :model-value="subtask.done"
                size="sm"
                @update:model-value="toggleSubtask(subtask.id)"
              />
              <span
                class="min-w-0 flex-1 text-sm"
                :class="subtask.done ? 'text-gray-400 line-through' : 'text-gray-900'"
              >
                {{ subtask.title }}
              </span>
              <div class="flex items-center gap-2">
                <UInput v-model="subtask.dueDate" type="date" size="xs" class="w-32" />
                <USelect v-model="subtask.assignee" :items="assigneeOptions" placeholder="—" size="xs" class="w-32" />
                <UButton
                  icon="ph:trash"
                  color="error"
                  variant="ghost"
                  size="xs"
                  square
                  class="opacity-0 transition-opacity group-hover:opacity-100"
                  @click="deleteSubtask(subtask.id)"
                />
              </div>
            </div>
          </div>

          <UButton
            v-if="!showAddSubtask && !isView"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="ph:plus"
            class="w-full justify-start"
            @click="showAddSubtask = true"
          >
            Add subtask
          </UButton>

          <div
            v-else-if="!isView"
            class="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <UInput
              v-model="newSubtaskTitle"
              size="sm"
              placeholder="Subtask title"
              @keydown.enter.prevent="addSubtask"
            />
            <div class="flex flex-wrap items-center gap-2">
              <USelect v-model="newSubtaskAssignee" :items="assigneeOptions" placeholder="No assignee" size="sm" class="min-w-0 flex-1" />
              <UButton color="primary" size="sm" @click="addSubtask">
                Add
              </UButton>
              <UButton color="neutral" variant="outline" size="sm" @click="showAddSubtask = false">
                Cancel
              </UButton>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <UTabs v-model="activeTab" :items="tabItems" variant="link" class="w-full">
          <template #comments>
            <div class="space-y-4 pt-2">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="flex gap-3"
              >
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  :class="findUser(comment.author.name).color"
                >
                  {{ comment.author.initials }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline gap-2">
                    <span class="text-sm font-semibold text-gray-900">{{ comment.author.name }}</span>
                    <span class="text-xs text-gray-400">{{ comment.time }}</span>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-700">
                    {{ comment.text }}
                  </p>
                </div>
              </div>

              <div v-if="comments.length === 0" class="text-sm text-gray-500">
                No comments yet.
              </div>

              <div class="flex items-start gap-3">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-700 text-[11px] font-semibold text-white">
                  Y
                </div>
                <UInput
                  v-model="newComment"
                  size="sm"
                  placeholder="Add a comment..."
                  class="min-w-0 flex-1"
                  @keydown.enter.prevent="addComment"
                >
                  <template #trailing>
                    <UButton size="xs" color="primary" @click="addComment">
                      Post
                    </UButton>
                  </template>
                </UInput>
              </div>
            </div>
          </template>

          <template #activities>
            <div class="flex flex-col gap-3 pt-2">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="flex items-start gap-3"
              >
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  :class="findUser(activity.actor.name).color"
                >
                  {{ activity.actor.initials }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-700">
                    <span class="font-medium text-gray-900">{{ activity.actor.name }}</span>
                    {{ activity.text }}
                  </p>
                  <p class="text-xs text-gray-400">{{ activity.time }}</p>
                </div>
              </div>
              <div v-if="activities.length === 0" class="text-sm text-gray-500">
                No activity yet.
              </div>
            </div>
          </template>

          <template #attachments>
            <div class="flex flex-col gap-4 pt-2">
              <!-- Add URL -->
              <div class="flex items-center gap-2">
                <UInput
                  v-model="newAttachmentUrl"
                  type="url"
                  size="sm"
                  placeholder="https://..."
                  class="min-w-0 flex-1"
                  @keydown.enter.prevent="addUrl"
                />
                <UButton size="sm" color="primary" icon="ph:plus" @click="addUrl">
                  Add URL
                </UButton>
              </div>

              <!-- File upload -->
              <div
                class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400"
                @click="fileInput?.click()"
                @dragover.prevent
                @drop.prevent="onDrop"
              >
                <UIcon name="ph:upload-simple" class="mx-auto size-8 text-gray-400" />
                <p class="mt-2 text-sm font-medium text-gray-700">
                  Drop files here or click to upload
                </p>
                <p class="text-xs text-gray-500">
                  Max 10 MB per file
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  class="hidden"
                  @change="onFileChange"
                >
              </div>

              <UAlert
                v-if="attachmentError"
                color="error"
                variant="soft"
                :title="attachmentError"
                class="text-sm"
              />

              <div v-if="attachments.length" class="flex flex-col gap-2">
                <div
                  v-for="file in attachments"
                  :key="file.id"
                  class="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <UIcon :name="file.type === 'text/uri-list' ? 'ph:link' : 'ph:file'" class="size-5 shrink-0 text-gray-400" />
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-gray-900">{{ file.name }}</p>
                      <p v-if="file.size" class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
                    </div>
                  </div>
                  <UButton
                    icon="ph:x"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    square
                    @click="removeAttachment(file.id)"
                  />
                </div>
              </div>

              <div v-else class="text-sm text-gray-500">
                No attachments yet.
              </div>

              <!-- Link fields -->
              <div v-if="!isView" class="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
                <div class="flex flex-col gap-1">
                  <label class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <UIcon name="ph:link" class="size-3.5" />
                    Attach link
                  </label>
                  <UInput
                    v-model="form.link"
                    type="url"
                    size="sm"
                    placeholder="https://..."
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <UIcon name="ph:notebook" class="size-3.5" />
                    Notion URL
                  </label>
                  <UInput
                    v-model="form.notionUrl"
                    type="url"
                    size="sm"
                    placeholder="https://notion.so/..."
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <UIcon name="ph:paint-brush" class="size-3.5" />
                    Figma URL
                  </label>
                  <UInput
                    v-model="form.figmaUrl"
                    type="url"
                    size="sm"
                    placeholder="https://figma.com/..."
                  />
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>

      <!-- Footer -->
      <div
        v-if="!isView"
        class="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-gray-200 bg-white py-4"
        :class="variant === 'slide-over' ? 'px-5' : ''"
      >
        <UButton
          v-if="variant === 'slide-over'"
          color="neutral"
          variant="outline"
          size="sm"
          @click="emit('close')"
        >
          Cancel
        </UButton>
        <UButton
          v-else
          color="neutral"
          variant="outline"
          size="sm"
          to="/board"
        >
          Cancel
        </UButton>
        <UButton color="primary" size="sm" @click="onSubmit">
          {{ mode === 'create' ? 'Create task' : 'Save changes' }}
        </UButton>
      </div>
    </template>
  </div>
</template>
