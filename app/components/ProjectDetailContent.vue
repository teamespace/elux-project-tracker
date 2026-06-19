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
  <div>
    <div v-if="!project && !isCreate" class="py-12 text-center">
      <UIcon name="ph:warning-circle" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-[14px] text-gray-500">Project not found</p>
      <NuxtLink v-if="mode === 'page'" to="/projects" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Projects</NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Top action bar -->
      <div v-if="mode === 'slide-over'" class="flex items-center justify-end">
        <UButton
          variant="ghost"
          color="primary"
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
          class="w-full text-[26px] font-bold text-gray-900 placeholder:text-gray-400"
          :ui="{ base: 'focus:ring-0' }"
        />
        <div class="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
          <div v-if="ownerPerson" class="flex items-center gap-1.5">
            <UAvatar
              :src="ownerPerson.avatar"
              :text="ownerPerson.initials"
              size="xs"
              :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))"
            />
            <span class="text-gray-700">{{ ownerPerson?.name }}</span>
          </div>
          <div v-else class="flex items-center gap-1.5 text-gray-500">
            <UIcon name="ph:user" class="size-3.5" />
            <span>Unassigned</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500">
            <UIcon name="ph:calendar-plus" class="size-3.5" />
            <span>{{ form.createdDate || 'No created date' }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500">
            <UIcon name="ph:calendar-check" class="size-3.5" />
            <span>{{ form.dueDate || 'No due date' }}</span>
          </div>
          <UBadge :label="form.statusLabel" :color="statusColor(form.status)" variant="outline" size="sm" />
          <UBadge :label="form.priorityLabel" :color="priorityColor(form.priority)" variant="outline" size="sm" />
          <span v-if="project" class="text-gray-500">{{ project.progress }}% progress</span>
        </div>
      </div>

      <!-- Properties -->
      <div class="rounded-xl border border-gray-200 bg-white p-4">
        <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Properties
        </h3>
        <div class="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:traffic-signal" class="size-4 shrink-0" />
              <span>Status</span>
            </div>
            <USelect v-model="form.status" :items="statusOptions" size="sm" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:user" class="size-4 shrink-0" />
              <span>Owner</span>
            </div>
            <USelect v-model="form.owner" :items="ownerOptions" placeholder="Unassigned" size="sm" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:flag" class="size-4 shrink-0" />
              <span>Priority</span>
            </div>
            <USelect v-model="form.priority" :items="priorityOptions" size="sm" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:calendar-blank" class="size-4 shrink-0" />
              <span>Created Date</span>
            </div>
            <UInput v-model="form.createdDate" type="date" size="sm" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:calendar" class="size-4 shrink-0" />
              <span>End date</span>
            </div>
            <UInput v-model="form.dueDate" type="date" size="sm" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:tag" class="size-4 shrink-0" />
              <span>Labels</span>
            </div>
            <UInput v-model="form.labels" size="sm" placeholder="Empty" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:stack" class="size-4 shrink-0" />
              <span>Category</span>
            </div>
            <UInput v-model="form.category" size="sm" placeholder="Empty" class="min-w-0 flex-1" />
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:figma-logo" class="size-4 shrink-0" />
              <span>Figma URL</span>
            </div>
            <UInput v-model="form.links.figma" type="url" size="sm" placeholder="Empty" class="min-w-0 flex-1">
              <template #trailing>
                <UButton
                  v-if="form.links.figma"
                  icon="ph:arrow-square-out"
                  variant="ghost"
                  size="xs"
                  square
                  @click="openUrl(form.links.figma)"
                />
              </template>
            </UInput>
          </div>

          <div class="flex items-center gap-3 py-1.5">
            <div class="flex w-28 shrink-0 items-center gap-2 text-[12px] text-gray-500">
              <UIcon name="ph:notion-logo" class="size-4 shrink-0" />
              <span>Notion URL</span>
            </div>
            <UInput v-model="form.links.notion" type="url" size="sm" placeholder="Empty" class="min-w-0 flex-1">
              <template #trailing>
                <UButton
                  v-if="form.links.notion"
                  icon="ph:arrow-square-out"
                  variant="ghost"
                  size="xs"
                  square
                  @click="openUrl(form.links.notion)"
                />
              </template>
            </UInput>
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
          placeholder="Add a description..."
          class="w-full"
        />
      </div>

      <!-- Sub tasks -->
      <div>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Sub tasks
          </h3>
          <span class="text-[12px] text-gray-500">
            {{ childTaskProgress.done }} / {{ childTaskProgress.total }} done · {{ childTaskProgress.pct }}%
          </span>
        </div>

        <div class="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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
            class="group flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 hover:border-gray-300"
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
                :class="task.done ? 'text-gray-400 line-through' : 'text-gray-900'"
                @click="startEditTask(task.id, task.title)"
              >
                {{ task.title }}
              </span>
            </template>

            <UButton
              v-if="editingTaskId !== task.id"
              variant="ghost"
              color="primary"
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
              color="primary"
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
            color="primary"
            size="sm"
            icon="ph:plus"
            class="mt-1 w-full justify-start"
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

      <!-- Tabs -->
      <UTabs v-model="activeTab" :items="tabItems" variant="link" class="w-full">
        <template #comments>
          <div class="flex flex-col gap-3 pt-2">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex gap-3"
            >
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

            <div v-if="comments.length === 0" class="text-[13px] text-gray-500">
              No comments yet.
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
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
          <div class="flex flex-col gap-3 pt-2">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="flex items-start gap-3"
            >
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

            <div v-if="activities.length === 0" class="text-[13px] text-gray-500">
              No activity yet.
            </div>
          </div>
        </template>

        <template #attachments>
          <div class="flex flex-col gap-4 pt-2">
            <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div class="flex flex-col gap-1.5">
                <label class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <UIcon name="ph:link" class="size-3.5" />
                  Attach URL
                </label>
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
            </div>

            <div
              class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-gray-400"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              @click="fileInputRef?.click()"
            >
              <UIcon name="ph:upload-simple" class="mx-auto size-8 text-gray-400" />
              <p class="mt-2 text-[13px] font-medium text-gray-700">
                Click or drop files here
              </p>
              <p class="text-[12px] text-gray-500">
                Max 10 MB per file
              </p>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                class="hidden"
                @change="handleFileSelect"
              >
            </div>

            <UAlert
              v-if="fileError"
              color="error"
              variant="soft"
              :title="fileError"
              class="text-[13px]"
            />

            <div class="flex flex-col gap-2">
              <div
                v-for="file in attachments"
                :key="file.id"
                class="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <UIcon name="ph:file" class="size-5 shrink-0 text-gray-400" />
                  <div class="min-w-0">
                    <p class="truncate text-[13px] font-medium text-gray-900">{{ file.name }}</p>
                    <p v-if="file.size > 0" class="text-[11px] text-gray-500">{{ formatFileSize(file.size) }}</p>
                    <p v-else class="text-[11px] text-gray-500">URL</p>
                  </div>
                </div>
            <UButton
              variant="ghost"
              color="primary"
              size="xs"
              square
              icon="ph:x"
              @click="deleteAttachment(file.id)"
            />
              </div>

              <div v-if="attachments.length === 0" class="text-[13px] text-gray-500">
                No attachments yet.
              </div>
            </div>
          </div>
        </template>
      </UTabs>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 pt-2">
        <UButton variant="outline" color="neutral" size="sm" @click="onClose">
          Cancel
        </UButton>
        <UButton color="primary" size="sm" @click="onSubmit">
          {{ isCreate ? 'Create project' : 'Save changes' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
