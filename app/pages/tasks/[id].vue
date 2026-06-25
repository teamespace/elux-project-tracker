<script setup lang="ts">
import {
  currentUser,
  findTaskById,
  findTaskDetailById,
  groups,
  priorityClass,
  progressColor,
  statusClass,
  statusDotClass,
  statusFromGroup,
  type GroupId,
  type MyTaskActivity,
  type MyTaskAttachment,
  type MyTaskComment,
  type MyTaskDetail,
  type MyTaskSubtask,
} from '~/shared/my-tasks'

definePageMeta({ layout: false, title: 'Task Detail' })

const route = useRoute()
const id = route.params.id as string

const task = computed(() => findTaskById(id))
const detail = computed<MyTaskDetail | undefined>(() => findTaskDetailById(id))

const groupId = computed<GroupId | undefined>(() => {
  for (const g of groups) {
    if (g.tasks.some(t => t.id === id)) return g.id
  }
  return undefined
})

const statusInfo = computed(() => {
  if (groupId.value) return statusFromGroup(groupId.value)
  return { id: 'todo', label: 'To Do' }
})

const progress = computed(() => detail.value?.progress ?? 0)

const subtasks = ref<MyTaskSubtask[]>([])
const comments = ref<MyTaskComment[]>([])
const activities = ref<MyTaskActivity[]>([])
const attachments = ref<MyTaskAttachment[]>([])

watch(() => detail.value, (d) => {
  subtasks.value = d ? d.subtasks.map(s => ({ ...s })) : []
  comments.value = d ? d.comments.map(c => ({ ...c })) : []
  activities.value = d ? d.activities.map(a => ({ ...a })) : []
  attachments.value = d ? d.attachments.map(a => ({ ...a })) : []
}, { immediate: true })

type TabId = 'subtasks' | 'comments' | 'activity' | 'attachments'
const activeTab = ref<TabId>('subtasks')

const subtaskProgress = computed(() => {
  const total = subtasks.value.length
  const done = subtasks.value.filter(s => s.done).length
  const pct = total ? Math.round((done / total) * 100) : 0
  return { total, done, pct }
})

const newSubtaskTitle = ref('')
const newSubtaskAssignee = ref('')
const newCommentText = ref('')

function addSubtask() {
  const title = newSubtaskTitle.value.trim()
  if (!title) return
  subtasks.value.push({
    id: `st-${Date.now()}`,
    title,
    done: false,
    dueDate: '',
    assignee: newSubtaskAssignee.value || detail.value?.assignee?.name || currentUser.name,
  })
  newSubtaskTitle.value = ''
  newSubtaskAssignee.value = ''
}

function deleteSubtask(subtaskId: string) {
  subtasks.value = subtasks.value.filter(s => s.id !== subtaskId)
}

function addComment() {
  const text = newCommentText.value.trim()
  if (!text) return
  comments.value.push({
    id: `c-${Date.now()}`,
    author: { name: currentUser.name, initials: currentUser.initials },
    text,
    time: 'Just now',
  })
  newCommentText.value = ''
}

const assigneeOptions = ['Rasya', 'Dito', 'Maya', 'Rara']
const projectOptions = computed(() => {
  const set = new Set<string>()
  for (const g of groups) {
    for (const t of g.tasks) set.add(t.project)
  }
  return Array.from(set)
})

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'inreview', label: 'In Review' },
  { value: 'completed', label: 'Done' },
  { value: 'overdue', label: 'Overdue' },
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const editForm = reactive({
  status: groupId.value ?? 'todo',
  priority: task.value?.priority ?? 'medium',
  assignee: detail.value?.assignee?.name ?? currentUser.name,
  project: task.value?.project ?? '',
  dueDate: task.value?.due ?? '',
  labels: task.value?.labels.map(l => l.text).join(', ') ?? '',
  progress: progress.value,
})

watch(() => task.value, (t) => {
  editForm.priority = t?.priority ?? 'medium'
  editForm.project = t?.project ?? ''
  editForm.dueDate = t?.due ?? ''
  editForm.labels = t?.labels.map(l => l.text).join(', ') ?? ''
}, { immediate: true })

watch(() => groupId.value, (g) => {
  editForm.status = g ?? 'todo'
}, { immediate: true })

watch(() => detail.value?.assignee?.name, (name) => {
  editForm.assignee = name ?? currentUser.name
}, { immediate: true })

watch(() => progress.value, (p) => {
  editForm.progress = p
}, { immediate: true })

function assigneeAvatarUrl(name: string) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}&backgroundColor=b6e3f4&backgroundType=solid`
}

function labelClass(color?: string) {
  switch (color) {
    case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'green': return 'bg-green-50 text-green-700 border-green-200'
    case 'gray': return 'bg-gray-50 text-gray-700 border-gray-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const tabItems = computed(() => [
  { id: 'subtasks' as TabId, label: 'Subtasks', count: subtasks.value.length },
  { id: 'comments' as TabId, label: 'Comments', count: comments.value.length },
  { id: 'activity' as TabId, label: 'Activity', count: activities.value.length },
  { id: 'attachments' as TabId, label: 'Attachments', count: attachments.value.length },
])
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <AppHeader>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/my-task" class="transition-colors hover:text-gray-700">
            My Task
          </NuxtLink>
          <UIcon name="ph:caret-right" class="size-3.5 text-gray-400" />
          <span class="font-medium text-gray-900">{{ task?.title ?? id }}</span>
        </div>
      </AppHeader>
    </template>

    <div class="-mx-6 -mt-5 flex flex-1 flex-col" style="min-height: 0">
      <!-- Empty state -->
      <div v-if="!task" class="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <UIcon name="ph:check-square" class="size-12 text-gray-300" />
        <h2 class="mt-4 text-lg font-semibold text-gray-900">
          Task not found
        </h2>
        <NuxtLink to="/my-task" class="mt-2 text-sm text-blue-600 hover:text-blue-700">
          ← Back to My Task
        </NuxtLink>
      </div>

      <div v-else class="flex flex-1 flex-col" style="min-height: 0">
        <!-- Header -->
        <div class="border-b border-gray-200 bg-white px-7 pt-5 pb-0">
          <div class="mb-3">
            <h1 class="text-xl font-semibold tracking-tight text-gray-900">
              {{ task.title }}
            </h1>
          </div>

          <div class="mb-4 flex flex-wrap items-center gap-3">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
              :class="groupId ? statusClass(groupId) : 'text-gray-700 bg-gray-100 border-gray-200'"
            >
              <span class="size-1.5 rounded-full" :class="groupId ? statusDotClass(groupId) : 'bg-gray-400'" />
              {{ statusInfo.label }}
            </span>

            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
              :class="priorityClass(task.priority)"
            >
              <UIcon name="ph:flag" class="size-3" />
              {{ task.priorityLabel }}
            </span>

            <div class="flex items-center gap-2">
              <div class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="progressColor(progress)"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <span class="text-xs font-medium text-gray-600">{{ progress }}%</span>
            </div>

            <div class="flex items-center gap-1.5 text-xs text-gray-600">
              <UIcon name="ph:calendar" class="size-3.5 text-gray-400" />
              {{ task.due }}
            </div>

            <div v-if="detail?.assignee" class="flex items-center gap-2">
              <img
                v-if="detail.assignee.avatar"
                :src="detail.assignee.avatar"
                :alt="detail.assignee.name"
                class="size-6 rounded-full object-cover"
              >
              <div
                v-else
                class="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700"
              >
                {{ detail.assignee.initials }}
              </div>
              <span class="text-xs font-medium text-gray-700">{{ detail.assignee.name }}</span>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex items-center gap-1 border-b border-gray-200">
            <button
              v-for="tab in tabItems"
              :key="tab.id"
              class="relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors"
              :class="activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <span
                class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                :class="activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'"
              >
                {{ tab.count }}
              </span>
              <span
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_320px]" style="min-height: 0">
          <!-- Main content -->
          <main class="overflow-y-auto px-7 py-6" style="min-height: 0">
            <!-- Subtasks -->
            <div v-if="activeTab === 'subtasks'" class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-sm font-semibold text-gray-900">
                  Subtasks
                </h2>
                <span class="text-xs text-gray-500">
                  {{ subtaskProgress.done }} / {{ subtaskProgress.total }} · {{ subtaskProgress.pct }}%
                </span>
              </div>

              <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full bg-blue-600 transition-all duration-300"
                  :style="{ width: `${subtaskProgress.pct}%` }"
                />
              </div>

              <div v-if="subtasks.length" class="flex flex-col gap-2">
                <div
                  v-for="subtask in subtasks"
                  :key="subtask.id"
                  class="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 hover:border-gray-300"
                >
                  <UCheckbox v-model="subtask.done" size="sm" />
                  <span
                    class="min-w-0 flex-1 text-sm"
                    :class="subtask.done ? 'text-gray-400 line-through' : 'text-gray-900'"
                  >
                    {{ subtask.title }}
                  </span>
                  <div class="hidden items-center gap-2 sm:flex">
                    <span class="text-xs text-gray-400">{{ subtask.assignee }}</span>
                  </div>
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

              <div v-else class="text-sm text-gray-500">
                No subtasks yet.
              </div>

              <div class="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div class="flex items-center gap-2">
                  <UInput
                    v-model="newSubtaskTitle"
                    size="sm"
                    placeholder="Add a subtask..."
                    class="min-w-0 flex-1"
                    @keydown.enter.prevent="addSubtask"
                  />
                  <UButton size="sm" color="primary" @click="addSubtask">
                    Add
                  </UButton>
                </div>
                <USelect
                  v-model="newSubtaskAssignee"
                  :items="assigneeOptions"
                  placeholder="Assignee"
                  size="sm"
                  class="w-full sm:w-48"
                />
              </div>
            </div>

            <!-- Comments -->
            <div v-if="activeTab === 'comments'" class="space-y-4">
              <h2 class="text-sm font-semibold text-gray-900">
                Comments
              </h2>

              <div v-if="comments.length" class="flex flex-col gap-4">
                <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
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
              </div>

              <div v-else class="text-sm text-gray-500">
                No comments yet.
              </div>

              <div class="flex items-start gap-3 pt-2">
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
                >
                  {{ currentUser.initials }}
                </div>
                <div class="flex min-w-0 flex-1 items-center gap-2">
                  <UInput
                    v-model="newCommentText"
                    size="sm"
                    placeholder="Write a comment..."
                    class="min-w-0 flex-1"
                    @keydown.enter.prevent="addComment"
                  />
                  <UButton size="sm" color="primary" @click="addComment">
                    Post
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Activity -->
            <div v-if="activeTab === 'activity'" class="space-y-4">
              <h2 class="text-sm font-semibold text-gray-900">
                Activity
              </h2>

              <div v-if="activities.length" class="flex flex-col gap-4">
                <div v-for="activity in activities" :key="activity.id" class="flex gap-3">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700"
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
              </div>

              <div v-else class="text-sm text-gray-500">
                No activity yet.
              </div>
            </div>

            <!-- Attachments -->
            <div v-if="activeTab === 'attachments'" class="space-y-4">
              <h2 class="text-sm font-semibold text-gray-900">
                Attachments
              </h2>

              <div v-if="attachments.length" class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div
                  v-for="file in attachments"
                  :key="file.id"
                  class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                >
                  <UIcon
                    :name="file.type === 'figma' ? 'ph:paint-brush' : file.type === 'notion' ? 'ph:notebook' : 'ph:file'"
                    class="size-5 shrink-0 text-gray-400"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ file.size }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="text-sm text-gray-500">
                No attachments yet.
              </div>
            </div>

            <!-- Description -->
            <div class="mt-8 space-y-2">
              <h2 class="text-sm font-semibold text-gray-900">
                Description
              </h2>
              <p class="text-sm leading-relaxed text-gray-700">
                {{ detail?.fullDescription }}
              </p>
            </div>
          </main>

          <!-- Right panel -->
          <aside class="border-l border-gray-200 bg-gray-50/50 px-5 py-6">
            <div class="space-y-5">
              <h2 class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Properties
              </h2>

              <div class="space-y-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Status</label>
                  <USelect
                    v-model="editForm.status"
                    :items="statusOptions"
                    value-key="value"
                    label-key="label"
                    size="sm"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Priority</label>
                  <USelect
                    v-model="editForm.priority"
                    :items="priorityOptions"
                    value-key="value"
                    label-key="label"
                    size="sm"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Assignee</label>
                  <USelect
                    v-model="editForm.assignee"
                    :items="assigneeOptions"
                    size="sm"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Project</label>
                  <USelect
                    v-model="editForm.project"
                    :items="projectOptions"
                    placeholder="Select project"
                    size="sm"
                    class="w-full"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Due date</label>
                  <UInput v-model="editForm.dueDate" type="date" size="sm" class="w-full" />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Labels</label>
                  <UInput v-model="editForm.labels" size="sm" placeholder="UX, Design" class="w-full" />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-gray-500">Progress (%)</label>
                  <UInput v-model.number="editForm.progress" type="number" min="0" max="100" size="sm" class="w-full" />
                </div>
              </div>

              <div class="space-y-2 pt-2">
                <h2 class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Labels
                </h2>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="label in task.labels"
                    :key="label.text"
                    class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
                    :class="labelClass(label.color)"
                  >
                    {{ label.text }}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
