// styled: agent-6
<script setup lang="ts">
import {
  type Project,
  type ProjectChildTask,
  type ProjectComment,
  type ProjectActivity,
  type ProjectAttachment,
  people,
  statusOptions,
  priorityOptions,
  projectById,
  avatarColor,
  findPerson,
  formatFileSize,
} from '~/shared/projects'

interface Form {
  name: string
  description: string
  status: Project['status']
  statusLabel: string
  owner: string
  priority: Project['priority']
  priorityLabel: string
  createdDate: string
  dueDate: string
  labels: string
  links: Project['links']
  category: string
}

const props = defineProps<{
  projectId: string | null
  mode: 'slide-over' | 'page'
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

const MAX_FILE_SIZE = 10 * 1024 * 1024

const isCreate = computed(() => !props.projectId)

const project = computed<Project | null>(() => {
  if (!props.projectId) return null
  return projectById(props.projectId) ?? null
})

const form = reactive<Form>(emptyForm())
const childTasks = reactive<ProjectChildTask[]>([])
const comments = reactive<ProjectComment[]>([])
const activities = reactive<ProjectActivity[]>([])
const attachments = reactive<ProjectAttachment[]>([])

const activeTab = ref('comments')
const newComment = ref('')
const showChildTaskForm = ref(false)
const newChildTaskTitle = ref('')
const newChildTaskAssignee = ref('')
const fileError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const editingTaskId = ref<string | null>(null)
const editingTitle = ref('')

const ownerOptions = computed(() =>
  [{ label: 'Unassigned', value: '' }].concat(
    people.map(p => ({ label: p.name, value: p.name })),
  ),
)

const assigneeOptions = computed(() =>
  [{ label: 'Unassigned', value: '' }].concat(
    people.map(p => ({ label: p.name, value: p.name })),
  ),
)

const ownerPerson = computed(() => findPerson(form.owner))

const childTaskProgress = computed(() => {
  const total = childTasks.length
  const done = childTasks.filter(s => s.done).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return { done, total, pct }
})

const tabs = [
  { value: 'comments', label: 'Comments' },
  { value: 'activities', label: 'Activities' },
  { value: 'attachments', label: 'Attachments' },
]

const statusChipClass = computed(() => {
  switch (form.status) {
    case 'at-risk': return 'bg-[#FEF3C7] text-[#92400E]'
    case 'on-track': return 'bg-[#D1FAE5] text-[#065F46]'
    case 'delayed': return 'bg-red-100 text-red-700'
    case 'not-started': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-500'
  }
})

const priorityChipClass = computed(() => {
  switch (form.priority) {
    case 'high': return 'bg-[#FEE2E2] text-[#991B1B]'
    case 'medium': return 'bg-[#FEF3C7] text-[#92400E]'
    case 'low': return 'bg-[#D1FAE5] text-[#065F46]'
    default: return 'bg-gray-100 text-gray-500'
  }
})

function emptyForm(): Form {
  return {
    name: '',
    description: '',
    status: 'not-started',
    statusLabel: 'Not started',
    owner: '',
    priority: 'medium',
    priorityLabel: 'Medium',
    createdDate: '',
    dueDate: '',
    labels: '',
    links: { attach: '', notion: '', figma: '' },
    category: '',
  }
}

function replaceArray<T>(target: T[], source: T[]) {
  target.length = 0
  target.push(...source)
}

function loadData() {
  const p = project.value
  if (p) {
    Object.assign(form, {
      name: p.name,
      description: p.description,
      status: p.status,
      statusLabel: p.statusLabel,
      owner: p.owner.name,
      priority: p.priority,
      priorityLabel: p.priorityLabel,
      createdDate: p.createdDate,
      dueDate: p.dueDate,
      labels: p.labels,
      links: { ...p.links },
      category: p.category,
    })
    replaceArray(childTasks, p.childTasks.map(t => ({ ...t })))
    replaceArray(comments, p.comments.map(c => ({ ...c })))
    replaceArray(activities, p.activities.map(a => ({ ...a })))
    replaceArray(attachments, p.attachments.map(a => ({ ...a })))
  }
  else {
    Object.assign(form, emptyForm())
    replaceArray(childTasks, [])
    replaceArray(comments, [])
    replaceArray(activities, [])
    replaceArray(attachments, [])
  }
  activeTab.value = 'comments'
  fileError.value = ''
  showChildTaskForm.value = false
  newChildTaskTitle.value = ''
  newChildTaskAssignee.value = ''
  newComment.value = ''
}

watch(() => props.projectId, loadData, { immediate: true })

function onClose() {
  if (props.mode === 'slide-over') {
    emit('close')
  }
  else {
    router.push('/projects')
  }
}

function addChildTask() {
  const title = newChildTaskTitle.value.trim()
  if (!title) return
  childTasks.push({
    id: `ct-${Date.now()}`,
    title,
    done: false,
    dueDate: '',
    assignee: newChildTaskAssignee.value,
  })
  newChildTaskTitle.value = ''
  newChildTaskAssignee.value = ''
  showChildTaskForm.value = false
}

function cancelChildTask() {
  newChildTaskTitle.value = ''
  newChildTaskAssignee.value = ''
  showChildTaskForm.value = false
}

function deleteChildTask(id: string) {
  const index = childTasks.findIndex(t => t.id === id)
  if (index !== -1) childTasks.splice(index, 1)
}

function startEditTask(taskId: string, currentTitle: string) {
  editingTaskId.value = taskId
  editingTitle.value = currentTitle
}

function saveEditTask() {
  if (!editingTaskId.value) return
  const task = childTasks.find(t => t.id === editingTaskId.value)
  if (task && editingTitle.value.trim()) {
    task.title = editingTitle.value.trim()
  }
  editingTaskId.value = null
  editingTitle.value = ''
}

function cancelEditTask() {
  editingTaskId.value = null
  editingTitle.value = ''
}

function addComment() {
  const text = newComment.value.trim()
  if (!text) return
  comments.push({
    id: `c-${Date.now()}`,
    author: { initials: 'Y', name: 'You' },
    text,
    time: 'Just now',
  })
  newComment.value = ''
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return
  addFiles(files)
  input.value = ''
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (!files) return
  addFiles(files)
}

function addFiles(files: FileList) {
  fileError.value = ''
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `${file.name} exceeds the 10 MB per-file limit.`
      continue
    }
    attachments.push({
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  }
}

function openUrl(url: string) {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

function formatShortDate(iso: string) {
  if (!iso) return ''
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function attachmentThumb(file: ProjectAttachment) {
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  if (name.includes('figma') || type.includes('figma')) {
    return { icon: 'ph:figma-logo', bg: 'bg-indigo-50', color: 'text-indigo-500' }
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || type.includes('sheet') || type.includes('excel')) {
    return { icon: 'ph:table', bg: 'bg-green-50', color: 'text-green-500' }
  }
  return { icon: 'ph:file', bg: 'bg-gray-50', color: 'text-gray-300' }
}

function onSubmit() {
  const payload = {
    name: form.name,
    description: form.description,
    status: form.status,
    statusLabel: form.statusLabel,
    owner: form.owner,
    priority: form.priority,
    priorityLabel: form.priorityLabel,
    createdDate: form.createdDate,
    dueDate: form.dueDate,
    labels: form.labels,
    links: { ...form.links },
    category: form.category,
    childTasks,
    comments,
    activities,
    attachments,
  }
  console.log(isCreate.value ? 'Create project' : 'Save project', payload)
  emit('close')
}
</script>

<template>
  <div :class="mode === 'page' ? 'flex min-h-0 justify-center' : 'flex h-full flex-col'">
    <div :class="mode === 'page' ? 'w-full max-w-[760px]' : 'flex h-full flex-col'">
      <!-- Not found -->
      <div v-if="!project && !isCreate" class="py-12 text-center">
        <UIcon name="ph:warning-circle" class="mx-auto size-10 text-gray-400" />
        <p class="mt-3 text-[14px] text-gray-500">Project not found</p>
        <NuxtLink v-if="mode === 'page'" to="/projects" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Projects</NuxtLink>
      </div>

      <template v-else>
        <div class="flex-1 overflow-y-auto">
          <!-- Header -->
        <div class="border-b border-gray-100 px-5 py-4">
          <UInput
            v-model="form.name"
            variant="none"
            placeholder="Untitled project"
            class="w-full text-[18px] font-bold text-gray-900 placeholder:text-gray-300"
            :ui="{ base: 'focus:ring-0' }"
          />
          <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-semibold" :class="statusChipClass">
              {{ form.statusLabel }}
            </span>
            <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-semibold" :class="priorityChipClass">
              {{ form.priorityLabel }}
            </span>
            <span v-if="ownerPerson" class="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-[11.5px] font-semibold text-gray-600">
              <UAvatar
                :src="ownerPerson.avatar"
                :text="ownerPerson.initials"
                size="xs"
                class="size-5"
                :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))"
              />
              {{ ownerPerson.name }}
            </span>
          </div>
        </div>

        <!-- Properties -->
        <div class="border-b border-gray-100 px-5 py-3.5">
          <p class="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Properties</p>
          <div class="grid grid-cols-2 border-t border-gray-100">
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Status</p>
              <USelect v-model="form.status" :items="statusOptions" size="sm" variant="none" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Owner</p>
              <USelect v-model="form.owner" :items="ownerOptions" placeholder="Unassigned" size="sm" variant="none" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Priority</p>
              <USelect v-model="form.priority" :items="priorityOptions" size="sm" variant="none" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Start</p>
              <UInput v-model="form.createdDate" type="date" size="sm" variant="none" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Due</p>
              <UInput v-model="form.dueDate" type="date" size="sm" variant="none" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Labels</p>
              <UInput v-model="form.labels" size="sm" variant="none" placeholder="—" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Category</p>
              <UInput v-model="form.category" size="sm" variant="none" placeholder="—" class="text-[13px] font-medium text-gray-800" />
            </div>
            <div class="border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Figma</p>
              <UInput v-model="form.links.figma" type="url" size="sm" variant="none" placeholder="Add link" class="text-[13px] font-medium text-blue-600">
                <template #trailing>
                  <UButton v-if="form.links.figma" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.figma)" />
                </template>
              </UInput>
            </div>
            <div class="col-span-2 border-b border-gray-100 py-2 pr-3">
              <p class="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Notion</p>
              <UInput v-model="form.links.notion" type="url" size="sm" variant="none" placeholder="Add link" class="text-[13px] font-medium text-blue-600">
                <template #trailing>
                  <UButton v-if="form.links.notion" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.notion)" />
                </template>
              </UInput>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="border-b border-gray-100 px-5 py-3.5">
          <p class="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Description</p>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Add a description..."
            class="w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13px] leading-relaxed text-gray-700 outline-none transition-colors hover:border-gray-200 focus:border-blue-500 focus:bg-gray-50"
          />
        </div>

        <!-- Tasks -->
        <div class="border-b border-gray-100 px-5 py-3.5">
          <div class="mb-2.5 flex items-center justify-between">
            <p class="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Tasks</p>
            <span class="text-[12px] text-gray-400">{{ childTaskProgress.done }}/{{ childTaskProgress.total }} · {{ childTaskProgress.pct }}%</span>
          </div>
          <div class="mb-3 h-[3px] w-full overflow-hidden rounded bg-gray-100">
            <div class="h-full rounded bg-blue-500 transition-all duration-300" :style="{ width: `${childTaskProgress.pct}%` }" />
          </div>

          <div class="flex flex-col">
            <div
              v-for="task in childTasks"
              :key="task.id"
              class="group flex items-center gap-2.5 border-t border-gray-50 py-1.5 first:border-t-0"
            >
              <input v-model="task.done" type="checkbox" class="size-3.5 shrink-0 accent-blue-600">
              <template v-if="editingTaskId === task.id">
                <UInput
                  v-model="editingTitle"
                  size="sm"
                  class="min-w-0 flex-1"
                  @keyup.enter="saveEditTask"
                  @keyup.escape="cancelEditTask"
                  @blur="saveEditTask"
                />
              </template>
              <template v-else>
                <span
                  class="min-w-0 flex-1 cursor-pointer truncate text-[13px]"
                  :class="task.done ? 'text-gray-400 line-through' : 'text-gray-700'"
                  @click="startEditTask(task.id, task.title)"
                >{{ task.title }}</span>
              </template>
              <span class="shrink-0 text-[11px] text-gray-400">{{ formatShortDate(task.dueDate) }}</span>
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                square
                icon="ph:trash"
                class="shrink-0 opacity-0 group-hover:opacity-100"
                @click="deleteChildTask(task.id)"
              />
            </div>
          </div>

          <UButton
            v-if="!showChildTaskForm"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="ph:plus"
            class="mt-2 w-full justify-start text-gray-400 hover:text-blue-600"
            @click="showChildTaskForm = true"
          >
            Add task
          </UButton>
          <div v-else class="mt-2 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <UInput
              v-model="newChildTaskTitle"
              size="sm"
              placeholder="Task title"
              @keydown.enter.prevent="addChildTask"
            />
            <div class="flex items-center gap-2">
              <USelect v-model="newChildTaskAssignee" :items="assigneeOptions" placeholder="—" size="sm" class="w-32" />
              <UButton color="primary" size="sm" @click="addChildTask">Add</UButton>
              <UButton color="neutral" variant="outline" size="sm" @click="cancelChildTask">Cancel</UButton>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex shrink-0 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-700"
            :class="activeTab === tab.value ? 'border-gray-900 text-gray-900' : ''"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span
              v-if="tab.value === 'comments' || tab.value === 'attachments'"
              class="rounded-lg bg-gray-100 px-1.5 py-0 text-[11px] font-semibold text-gray-500"
            >
              {{ tab.value === 'comments' ? comments.length : attachments.length }}
            </span>
          </button>
        </div>

        <!-- Comments pane -->
        <div v-if="activeTab === 'comments'" class="border-b border-gray-100 px-5 py-3">
          <div class="flex flex-col">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex gap-2.5 border-b border-gray-50 py-3 last:border-b-0"
            >
              <UAvatar
                :src="comment.author.avatar"
                :text="comment.author.initials"
                size="sm"
                class="size-7 shrink-0 text-[10px]"
                :class="avatarColor(people.findIndex(p => p.name === comment.author.name))"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-[13px] font-semibold text-gray-900">{{ comment.author.name }}</span>
                  <span class="text-[11.5px] text-gray-400">{{ comment.time }}</span>
                </div>
                <p class="mt-0.5 text-[13px] leading-relaxed text-gray-700">{{ comment.text }}</p>
              </div>
            </div>
            <p v-if="comments.length === 0" class="py-6 text-center text-[13px] text-gray-400">No comments yet.</p>
          </div>

          <!-- Comment input -->
          <div class="mt-3 flex items-center gap-2.5 border-t border-gray-100 pt-3">
            <UAvatar text="Y" size="sm" class="size-7 shrink-0 bg-gray-700 text-[10px] text-white" src="https://api.dicebear.com/9.x/micah/svg?seed=Rasya" />
            <input
              v-model="newComment"
              type="text"
              placeholder="Add a comment…"
              class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-700 outline-none transition-colors focus:border-blue-500 focus:bg-white"
              @keydown.enter.prevent="addComment"
            >
            <button class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700" @click="addComment">
              <UIcon name="ph:paper-plane-right" class="size-4" />
            </button>
          </div>
        </div>

        <!-- Activities pane -->
        <div v-else-if="activeTab === 'activities'" class="border-b border-gray-100 px-5 py-3">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex gap-2.5 border-b border-gray-100 py-3 transition-colors hover:bg-gray-50 last:border-b-0"
          >
            <UAvatar
              :src="activity.actor.avatar"
              :text="activity.actor.initials"
              size="sm"
              class="size-7 shrink-0 text-[10px]"
              :class="avatarColor(people.findIndex(p => p.name === activity.actor.name))"
            />
            <div class="min-w-0 flex-1">
              <p class="text-[13px] text-gray-700">
                <strong class="font-semibold text-gray-900">{{ activity.actor.name }}</strong>
                {{ activity.text }}
              </p>
              <p class="mt-0.5 text-[11.5px] text-gray-400">{{ activity.time }}</p>
            </div>
          </div>
          <p v-if="activities.length === 0" class="py-6 text-center text-[13px] text-gray-400">No activity yet.</p>
        </div>

        <!-- Attachments pane -->
        <div v-else-if="activeTab === 'attachments'" class="border-b border-gray-100 px-5 py-3">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-[12.5px] text-gray-500">{{ attachments.length }} files</span>
            <UButton size="xs" icon="ph:plus" color="primary" variant="outline" @click="fileInputRef?.click()">
              Upload
            </UButton>
          </div>

          <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
            <div
              v-for="file in attachments"
              :key="file.id"
              class="cursor-pointer overflow-hidden rounded-[10px] border border-gray-200 transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            >
              <div class="flex h-[100px] items-center justify-center border-b border-gray-100" :class="attachmentThumb(file).bg">
                <UIcon :name="attachmentThumb(file).icon" class="size-7" :class="attachmentThumb(file).color" />
              </div>
              <div class="px-2.5 py-2">
                <p class="truncate text-[12px] font-medium text-gray-900">{{ file.name }}</p>
                <p class="mt-0.5 text-[10.5px] text-gray-400">{{ file.size > 0 ? formatFileSize(file.size) : 'URL' }}</p>
              </div>
            </div>
          </div>

          <!-- Upload row -->
          <div
            class="mt-3 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-4 text-[13px] text-gray-400 transition-colors hover:border-gray-300 hover:text-blue-600"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
            @click="fileInputRef?.click()"
          >
            <UIcon name="ph:upload-simple" class="size-4" />
            <span>Click or drop files here</span>
          </div>
          <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileSelect">

          <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" class="mt-3 text-[13px]" />
        </div>
        </div>

        <!-- Footer -->
        <div class="shrink-0 flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <UButton variant="outline" color="neutral" size="sm" @click="onClose">Cancel</UButton>
          <UButton size="sm" class="bg-green-500 text-white hover:bg-green-600" @click="onSubmit">
            {{ isCreate ? 'Create project' : 'Save changes' }}
          </UButton>
        </div>
      </template>
    </div>
  </div>
</template>
