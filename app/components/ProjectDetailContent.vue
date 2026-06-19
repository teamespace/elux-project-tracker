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
  statusColor,
  priorityColor,
  progressColor,
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
const newAttachmentUrl = ref('')
const editingTaskId = ref<string | null>(null)
const editingTitle = ref('')

const tabItems = computed(() => [
  { label: 'Comments', value: 'comments', icon: 'ph:chat-circle', slot: 'comments', badge: comments.length || undefined },
  { label: 'Activities', value: 'activities', icon: 'ph:clock', slot: 'activities' },
  { label: 'Attachments', value: 'attachments', icon: 'ph:paperclip', slot: 'attachments', badge: attachments.length || undefined },
])

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
  newAttachmentUrl.value = ''
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

function onExpand() {
  if (props.mode === 'slide-over' && props.projectId) {
    emit('close')
    router.push(`/projects/${props.projectId}`)
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

function deleteAttachment(id: string) {
  const index = attachments.findIndex(a => a.id === id)
  if (index !== -1) attachments.splice(index, 1)
}

function addAttachmentUrl() {
  const url = newAttachmentUrl.value.trim()
  if (!url) return
  const name = url.split('/').pop() || url
  attachments.push({
    id: `u-${Date.now()}`,
    name,
    size: 0,
    type: 'text/url',
  })
  newAttachmentUrl.value = ''
}

function openUrl(url: string) {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
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
  <div :class="mode === 'page' ? 'flex h-full flex-col' : ''">
    <!-- Not found -->
    <div v-if="!project && !isCreate" class="py-12 text-center">
      <UIcon name="ph:warning-circle" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-[14px] text-gray-500">Project not found</p>
      <NuxtLink v-if="mode === 'page'" to="/projects" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Projects</NuxtLink>
    </div>

    <!-- PAGE MODE — Linear two-panel layout -->
    <template v-else-if="mode === 'page'">
      <!-- Breadcrumb bar -->
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-3">
        <div class="flex items-center gap-1.5 text-[13px]">
          <NuxtLink to="/projects" class="text-gray-400 hover:text-gray-700 transition-colors">Projects</NuxtLink>
          <UIcon name="ph:caret-right" class="size-3 text-gray-300" />
          <span class="font-medium text-gray-900">{{ form.name || 'Untitled project' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UButton variant="outline" color="neutral" size="sm" @click="onClose">Cancel</UButton>
          <UButton color="primary" size="sm" @click="onSubmit">
            {{ isCreate ? 'Create project' : 'Save changes' }}
          </UButton>
        </div>
      </div>

      <!-- Two-column body -->
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <!-- LEFT: main content -->
        <div class="flex flex-1 flex-col overflow-y-auto px-8 py-7">
          <!-- Project icon + title -->
          <div class="mb-1 flex items-start gap-3">
            <div class="mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <UIcon name="ph:folder-simple-dashed" class="size-5" />
            </div>
            <div class="flex-1">
              <UInput
                v-model="form.name"
                variant="none"
                placeholder="Untitled project"
                class="w-full -ml-2 text-[26px] font-bold text-gray-900 placeholder:text-gray-300"
                :ui="{ base: 'focus:ring-0' }"
              />
            </div>
          </div>

          <!-- Inline property chips -->
          <div class="mb-7 ml-12 flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium"
              :class="`text-${statusColor(form.status)}-600 bg-${statusColor(form.status)}-50`"
            >
              <UIcon name="ph:circle-half" class="size-3" />
              {{ form.statusLabel }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium text-gray-600 bg-gray-100"
            >
              <UIcon name="ph:flag" class="size-3" />
              {{ form.priorityLabel }}
            </span>
            <div v-if="ownerPerson" class="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5">
              <UAvatar
                :src="ownerPerson.avatar"
                :text="ownerPerson.initials"
                size="2xs"
                :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))"
              />
              <span class="text-[12px] font-medium text-gray-700">{{ ownerPerson.name }}</span>
            </div>
            <span v-if="form.dueDate" class="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-[12px] text-gray-600">
              <UIcon name="ph:calendar" class="size-3" />
              {{ form.dueDate }}
            </span>
            <span v-if="project" class="text-[12px] text-gray-400">· {{ project.progress }}% complete</span>
          </div>

          <!-- Description -->
          <div class="mb-7">
            <p class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Description</p>
            <UTextarea
              v-model="form.description"
              :rows="4"
              placeholder="Add a description..."
              class="w-full"
            />
          </div>

          <!-- Sub tasks -->
          <div class="mb-7">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Sub tasks</p>
              <span class="text-[12px] text-gray-400">{{ childTaskProgress.done }}/{{ childTaskProgress.total }} done · {{ childTaskProgress.pct }}%</span>
            </div>
            <div class="mb-3 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="progressColor(childTaskProgress.pct)"
                :style="{ width: `${childTaskProgress.pct}%` }"
              />
            </div>
            <div class="flex flex-col gap-1">
              <div
                v-for="task in childTasks"
                :key="task.id"
                class="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 hover:border-gray-200 hover:bg-white transition-colors"
              >
                <UCheckbox v-model="task.done" size="sm" />
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
                    class="min-w-0 flex-1 truncate text-[13px] cursor-pointer"
                    :class="task.done ? 'text-gray-400 line-through' : 'text-gray-800'"
                    @click="startEditTask(task.id, task.title)"
                  >{{ task.title }}</span>
                </template>
                <UButton
                  v-if="editingTaskId !== task.id"
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  square
                  icon="ph:pencil"
                  class="shrink-0 opacity-0 group-hover:opacity-100"
                  @click="startEditTask(task.id, task.title)"
                />
                <UInput v-model="task.dueDate" type="date" size="sm" class="w-32 shrink-0" />
                <USelect v-model="task.assignee" :items="assigneeOptions" placeholder="—" size="sm" class="w-32 shrink-0" />
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

              <UButton
                v-if="!showChildTaskForm"
                variant="ghost"
                color="neutral"
                size="sm"
                icon="ph:plus"
                class="mt-1 w-full justify-start text-gray-500 hover:text-gray-700"
                @click="showChildTaskForm = true"
              >
                Add sub task
              </UButton>
              <div v-else class="mt-1 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <UInput
                  v-model="newChildTaskTitle"
                  size="sm"
                  placeholder="Sub task title"
                  @keydown.enter.prevent="addChildTask"
                />
                <div class="flex items-center gap-2">
                  <USelect v-model="newChildTaskAssignee" :items="assigneeOptions" placeholder="—" size="sm" class="w-32" />
                  <UButton color="primary" size="sm" @click="addChildTask">Add</UButton>
                  <UButton color="neutral" variant="outline" size="sm" @click="cancelChildTask">Cancel</UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom tabs: Comments / Activities / Attachments -->
          <UTabs v-model="activeTab" :items="tabItems" variant="link" class="w-full">
            <template #comments>
              <div class="flex flex-col gap-3 pt-3">
                <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                  <UAvatar
                    :src="comment.author.avatar"
                    :text="comment.author.initials"
                    size="sm"
                    :class="avatarColor(people.findIndex(p => p.name === comment.author.name))"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline gap-2">
                      <span class="text-[13px] font-medium text-gray-900">{{ comment.author.name }}</span>
                      <span class="text-[11px] text-gray-400">{{ comment.time }}</span>
                    </div>
                    <p class="mt-0.5 text-[13px] text-gray-700">{{ comment.text }}</p>
                  </div>
                </div>
                <p v-if="comments.length === 0" class="text-[13px] text-gray-400">No comments yet.</p>
                <div class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-200">
                  <UAvatar text="Y" size="sm" class="bg-gray-700 shrink-0" src="https://api.dicebear.com/9.x/micah/svg?seed=Rasya" />
                  <UInput
                    v-model="newComment"
                    variant="none"
                    placeholder="Add a comment..."
                    class="min-w-0 flex-1"
                    @keydown.enter.prevent="addComment"
                  />
                  <UButton icon="ph:paper-plane-right" color="primary" size="sm" square @click="addComment" />
                </div>
              </div>
            </template>
            <template #activities>
              <div class="flex flex-col gap-3 pt-3">
                <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
                  <UAvatar
                    :src="activity.actor.avatar"
                    :text="activity.actor.initials"
                    size="sm"
                    :class="avatarColor(people.findIndex(p => p.name === activity.actor.name))"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-[13px] text-gray-700">
                      <span class="font-medium text-gray-900">{{ activity.actor.name }}</span>
                      {{ activity.text }}
                    </p>
                    <p class="text-[11px] text-gray-400">{{ activity.time }}</p>
                  </div>
                </div>
                <p v-if="activities.length === 0" class="text-[13px] text-gray-400">No activity yet.</p>
              </div>
            </template>
            <template #attachments>
              <div class="flex flex-col gap-4 pt-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Attach URL</label>
                  <UInput
                    v-model="newAttachmentUrl"
                    type="url"
                    size="sm"
                    placeholder="https://..."
                    class="w-full"
                    @keydown.enter.prevent="addAttachmentUrl"
                  >
                    <template #trailing>
                      <UButton size="xs" icon="ph:plus" color="primary" @click="addAttachmentUrl" />
                    </template>
                  </UInput>
                </div>
                <div
                  class="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition-colors hover:border-gray-300"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                  @click="fileInputRef?.click()"
                >
                  <UIcon name="ph:upload-simple" class="mx-auto size-7 text-gray-400" />
                  <p class="mt-2 text-[13px] font-medium text-gray-600">Click or drop files here</p>
                  <p class="text-[12px] text-gray-400">Max 10 MB per file</p>
                  <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileSelect">
                </div>
                <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" class="text-[13px]" />
                <div class="flex flex-col gap-2">
                  <div
                    v-for="file in attachments"
                    :key="file.id"
                    class="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div class="flex min-w-0 items-center gap-3">
                      <UIcon name="ph:file" class="size-5 shrink-0 text-gray-400" />
                      <div class="min-w-0">
                        <p class="truncate text-[13px] font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-[11px] text-gray-400">{{ file.size > 0 ? formatFileSize(file.size) : 'URL' }}</p>
                      </div>
                    </div>
                    <UButton variant="ghost" color="neutral" size="xs" square icon="ph:x" @click="deleteAttachment(file.id)" />
                  </div>
                  <p v-if="attachments.length === 0" class="text-[13px] text-gray-400">No attachments yet.</p>
                </div>
              </div>
            </template>
          </UTabs>
        </div>

        <!-- RIGHT: properties panel -->
        <div class="w-64 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50/40 px-5 py-7">
          <!-- Properties -->
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Properties</p>
          <div class="flex flex-col">
            <!-- Status -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:traffic-signal" class="size-3.5 shrink-0" />
                <span>Status</span>
              </div>
              <USelect v-model="form.status" :items="statusOptions" size="sm" variant="none" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- Owner -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:user" class="size-3.5 shrink-0" />
                <span>Owner</span>
              </div>
              <USelect v-model="form.owner" :items="ownerOptions" placeholder="Unassigned" size="sm" variant="none" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- Priority -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:flag" class="size-3.5 shrink-0" />
                <span>Priority</span>
              </div>
              <USelect v-model="form.priority" :items="priorityOptions" size="sm" variant="none" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- Start date -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:calendar-blank" class="size-3.5 shrink-0" />
                <span>Start</span>
              </div>
              <UInput v-model="form.createdDate" type="date" size="sm" variant="none" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- End date -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:calendar-check" class="size-3.5 shrink-0" />
                <span>Due</span>
              </div>
              <UInput v-model="form.dueDate" type="date" size="sm" variant="none" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- Labels -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:tag" class="size-3.5 shrink-0" />
                <span>Labels</span>
              </div>
              <UInput v-model="form.labels" size="sm" variant="none" placeholder="—" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
            <!-- Category -->
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
              <div class="flex w-20 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:stack" class="size-3.5 shrink-0" />
                <span>Category</span>
              </div>
              <UInput v-model="form.category" size="sm" variant="none" placeholder="—" class="min-w-0 flex-1 text-[13px] text-gray-800" />
            </div>
          </div>

          <!-- Progress -->
          <div class="mt-6">
            <p class="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Progress</p>
            <div class="flex items-end justify-between mb-2">
              <div>
                <span class="text-[28px] font-bold leading-none text-gray-900">{{ childTaskProgress.pct }}</span>
                <span class="text-[13px] text-gray-400">%</span>
              </div>
              <span class="text-[12px] text-gray-400 mb-1">{{ childTaskProgress.done }}/{{ childTaskProgress.total }} tasks</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="progressColor(childTaskProgress.pct)"
                :style="{ width: `${childTaskProgress.pct}%` }"
              />
            </div>
          </div>

          <!-- Links -->
          <div class="mt-6">
            <p class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Links</p>
            <div class="flex flex-col gap-1">
              <!-- Figma -->
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
                <UIcon name="ph:figma-logo" class="size-3.5 shrink-0 text-gray-400" />
                <UInput v-model="form.links.figma" type="url" size="sm" variant="none" placeholder="Figma URL" class="min-w-0 flex-1 text-[13px] text-gray-800">
                  <template #trailing>
                    <UButton v-if="form.links.figma" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.figma)" />
                  </template>
                </UInput>
              </div>
              <!-- Notion -->
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
                <UIcon name="ph:notion-logo" class="size-3.5 shrink-0 text-gray-400" />
                <UInput v-model="form.links.notion" type="url" size="sm" variant="none" placeholder="Notion URL" class="min-w-0 flex-1 text-[13px] text-gray-800">
                  <template #trailing>
                    <UButton v-if="form.links.notion" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.notion)" />
                  </template>
                </UInput>
              </div>
              <!-- Attach -->
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100/70 transition-colors">
                <UIcon name="ph:link" class="size-3.5 shrink-0 text-gray-400" />
                <UInput v-model="form.links.attach" type="url" size="sm" variant="none" placeholder="Attachment URL" class="min-w-0 flex-1 text-[13px] text-gray-800">
                  <template #trailing>
                    <UButton v-if="form.links.attach" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.attach)" />
                  </template>
                </UInput>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- SLIDE-OVER MODE — compact single column -->
    <template v-else>
      <div class="flex flex-col gap-5">
        <!-- Expand button -->
        <div class="flex items-center justify-end">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            square
            icon="ph:arrow-square-out"
            title="Open in full page"
            @click="onExpand"
          />
        </div>

        <!-- Title + meta -->
        <div>
          <UInput
            v-model="form.name"
            variant="none"
            size="xl"
            placeholder="Untitled project"
            class="w-full text-[22px] font-bold text-gray-900 placeholder:text-gray-300"
            :ui="{ base: 'focus:ring-0' }"
          />
          <div class="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
            <UBadge :label="form.statusLabel" :color="statusColor(form.status)" variant="soft" size="sm" />
            <UBadge :label="form.priorityLabel" :color="priorityColor(form.priority)" variant="soft" size="sm" />
            <div v-if="ownerPerson" class="flex items-center gap-1.5 text-gray-600">
              <UAvatar :src="ownerPerson.avatar" :text="ownerPerson.initials" size="2xs" :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))" />
              <span>{{ ownerPerson.name }}</span>
            </div>
          </div>
        </div>

        <!-- Properties (compact) -->
        <div class="rounded-lg border border-gray-200 p-3">
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Properties</p>
          <div class="grid grid-cols-1 gap-0.5">
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:traffic-signal" class="size-3.5 shrink-0" />
                <span>Status</span>
              </div>
              <USelect v-model="form.status" :items="statusOptions" size="sm" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:user" class="size-3.5 shrink-0" />
                <span>Owner</span>
              </div>
              <USelect v-model="form.owner" :items="ownerOptions" placeholder="Unassigned" size="sm" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:flag" class="size-3.5 shrink-0" />
                <span>Priority</span>
              </div>
              <USelect v-model="form.priority" :items="priorityOptions" size="sm" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:calendar-blank" class="size-3.5 shrink-0" />
                <span>Start</span>
              </div>
              <UInput v-model="form.createdDate" type="date" size="sm" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:calendar-check" class="size-3.5 shrink-0" />
                <span>Due</span>
              </div>
              <UInput v-model="form.dueDate" type="date" size="sm" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:tag" class="size-3.5 shrink-0" />
                <span>Labels</span>
              </div>
              <UInput v-model="form.labels" size="sm" placeholder="—" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:stack" class="size-3.5 shrink-0" />
                <span>Category</span>
              </div>
              <UInput v-model="form.category" size="sm" placeholder="—" class="min-w-0 flex-1" />
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:figma-logo" class="size-3.5 shrink-0" />
                <span>Figma</span>
              </div>
              <UInput v-model="form.links.figma" type="url" size="sm" placeholder="—" class="min-w-0 flex-1">
                <template #trailing>
                  <UButton v-if="form.links.figma" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.figma)" />
                </template>
              </UInput>
            </div>
            <div class="flex items-center gap-2 rounded-md px-2 py-1.5">
              <div class="flex w-24 shrink-0 items-center gap-2 text-[12px] text-gray-400">
                <UIcon name="ph:notion-logo" class="size-3.5 shrink-0" />
                <span>Notion</span>
              </div>
              <UInput v-model="form.links.notion" type="url" size="sm" placeholder="—" class="min-w-0 flex-1">
                <template #trailing>
                  <UButton v-if="form.links.notion" icon="ph:arrow-square-out" variant="ghost" color="neutral" size="xs" square @click="openUrl(form.links.notion)" />
                </template>
              </UInput>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Description</p>
          <UTextarea v-model="form.description" :rows="3" placeholder="Add a description..." class="w-full" />
        </div>

        <!-- Sub tasks -->
        <div>
          <div class="mb-2 flex items-center justify-between">
            <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Sub tasks</p>
            <span class="text-[12px] text-gray-400">{{ childTaskProgress.done }}/{{ childTaskProgress.total }} · {{ childTaskProgress.pct }}%</span>
          </div>
          <div class="mb-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div class="h-full rounded-full transition-all" :class="progressColor(childTaskProgress.pct)" :style="{ width: `${childTaskProgress.pct}%` }" />
          </div>
          <div class="flex flex-col gap-1">
            <div
              v-for="task in childTasks"
              :key="task.id"
              class="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 hover:border-gray-200 hover:bg-white transition-colors"
            >
              <UCheckbox v-model="task.done" size="sm" />
              <template v-if="editingTaskId === task.id">
                <UInput v-model="editingTitle" size="sm" class="min-w-0 flex-1" @keyup.enter="saveEditTask" @keyup.escape="cancelEditTask" @blur="saveEditTask" />
              </template>
              <template v-else>
                <span
                  class="min-w-0 flex-1 truncate text-[13px] cursor-pointer"
                  :class="task.done ? 'text-gray-400 line-through' : 'text-gray-800'"
                  @click="startEditTask(task.id, task.title)"
                >{{ task.title }}</span>
              </template>
              <UInput v-model="task.dueDate" type="date" size="sm" class="w-28 shrink-0" />
              <UButton variant="ghost" color="neutral" size="xs" square icon="ph:trash" class="shrink-0 opacity-0 group-hover:opacity-100" @click="deleteChildTask(task.id)" />
            </div>
            <UButton v-if="!showChildTaskForm" variant="ghost" color="neutral" size="sm" icon="ph:plus" class="mt-1 w-full justify-start text-gray-500" @click="showChildTaskForm = true">
              Add sub task
            </UButton>
            <div v-else class="mt-1 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <UInput v-model="newChildTaskTitle" size="sm" placeholder="Sub task title" @keydown.enter.prevent="addChildTask" />
              <div class="flex items-center gap-2">
                <USelect v-model="newChildTaskAssignee" :items="assigneeOptions" placeholder="—" size="sm" class="w-28" />
                <UButton color="primary" size="sm" @click="addChildTask">Add</UButton>
                <UButton color="neutral" variant="outline" size="sm" @click="cancelChildTask">Cancel</UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <UTabs v-model="activeTab" :items="tabItems" variant="link" class="w-full">
          <template #comments>
            <div class="flex flex-col gap-3 pt-2">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                <UAvatar :src="comment.author.avatar" :text="comment.author.initials" size="sm" :class="avatarColor(people.findIndex(p => p.name === comment.author.name))" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline gap-2">
                    <span class="text-[13px] font-medium text-gray-900">{{ comment.author.name }}</span>
                    <span class="text-[11px] text-gray-400">{{ comment.time }}</span>
                  </div>
                  <p class="mt-0.5 text-[13px] text-gray-700">{{ comment.text }}</p>
                </div>
              </div>
              <p v-if="comments.length === 0" class="text-[13px] text-gray-400">No comments yet.</p>
              <div class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 focus-within:border-blue-300">
                <UAvatar text="Y" size="sm" class="bg-gray-700 shrink-0" src="https://api.dicebear.com/9.x/micah/svg?seed=Rasya" />
                <UInput v-model="newComment" variant="none" placeholder="Add a comment..." class="min-w-0 flex-1" @keydown.enter.prevent="addComment" />
                <UButton icon="ph:paper-plane-right" color="primary" size="sm" square @click="addComment" />
              </div>
            </div>
          </template>
          <template #activities>
            <div class="flex flex-col gap-3 pt-2">
              <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
                <UAvatar :src="activity.actor.avatar" :text="activity.actor.initials" size="sm" :class="avatarColor(people.findIndex(p => p.name === activity.actor.name))" />
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] text-gray-700"><span class="font-medium text-gray-900">{{ activity.actor.name }}</span> {{ activity.text }}</p>
                  <p class="text-[11px] text-gray-400">{{ activity.time }}</p>
                </div>
              </div>
              <p v-if="activities.length === 0" class="text-[13px] text-gray-400">No activity yet.</p>
            </div>
          </template>
          <template #attachments>
            <div class="flex flex-col gap-4 pt-2">
              <UInput v-model="newAttachmentUrl" type="url" size="sm" placeholder="Attach a URL..." class="w-full" @keydown.enter.prevent="addAttachmentUrl">
                <template #trailing>
                  <UButton size="xs" icon="ph:plus" color="primary" @click="addAttachmentUrl" />
                </template>
              </UInput>
              <div class="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center hover:border-gray-300" @dragover.prevent @drop.prevent="handleFileDrop" @click="fileInputRef?.click()">
                <UIcon name="ph:upload-simple" class="mx-auto size-6 text-gray-400" />
                <p class="mt-1 text-[12px] text-gray-500">Click or drop files · max 10 MB</p>
                <input ref="fileInputRef" type="file" multiple class="hidden" @change="handleFileSelect">
              </div>
              <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" class="text-[13px]" />
              <div class="flex flex-col gap-1.5">
                <div v-for="file in attachments" :key="file.id" class="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                  <div class="flex min-w-0 items-center gap-2">
                    <UIcon name="ph:file" class="size-4 shrink-0 text-gray-400" />
                    <p class="truncate text-[13px] text-gray-800">{{ file.name }}</p>
                    <p class="shrink-0 text-[11px] text-gray-400">{{ file.size > 0 ? formatFileSize(file.size) : 'URL' }}</p>
                  </div>
                  <UButton variant="ghost" color="neutral" size="xs" square icon="ph:x" @click="deleteAttachment(file.id)" />
                </div>
                <p v-if="attachments.length === 0" class="text-[13px] text-gray-400">No attachments yet.</p>
              </div>
            </div>
          </template>
        </UTabs>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 pt-2">
          <UButton variant="outline" color="neutral" size="sm" @click="onClose">Cancel</UButton>
          <UButton color="primary" size="sm" @click="onSubmit">
            {{ isCreate ? 'Create project' : 'Save changes' }}
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>
