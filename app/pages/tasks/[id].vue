<script setup lang="ts">
import { currentUser, type MyTaskActivity, type MyTaskAttachment, type MyTaskComment, type MyTaskSubtask } from '~/shared/my-tasks'

definePageMeta({ layout: false, title: 'Task Detail' })

const route = useRoute()
const { data: taskData } = await useAsyncData(`task-${route.params.id}`, () =>
  $fetch(`/api/tasks/${route.params.id}`)
)
const task = computed(() => taskData.value ?? null)
const detail = task

const statusInfo = computed(() => {
  if (!task.value?.status) return { id: 'todo', label: 'To Do' }
  const statusMap: Record<string, { id: string; label: string }> = {
    todo: { id: 'todo', label: 'To Do' },
    inprogress: { id: 'inprogress', label: 'In Progress' },
    inreview: { id: 'inreview', label: 'In Review' },
    completed: { id: 'completed', label: 'Done' },
    overdue: { id: 'overdue', label: 'Overdue' },
  }
  return statusMap[task.value.status] ?? { id: 'todo', label: 'To Do' }
})

const progress = computed(() => task.value?.progress ?? 0)

const subtasks = ref<MyTaskSubtask[]>([])
const comments = ref<MyTaskComment[]>([])
const activities = ref<MyTaskActivity[]>([])
const attachments = ref<MyTaskAttachment[]>([])

watch(() => taskData.value, (d) => {
  if (d) {
    subtasks.value = d.subtasks?.map((s: any) => ({ ...s })) ?? []
    comments.value = d.comments?.map((c: any) => ({ ...c })) ?? []
    activities.value = d.activities?.map((a: any) => ({ ...a })) ?? []
    attachments.value = d.attachments?.map((a: any) => ({ ...a })) ?? []
  }
  else {
    subtasks.value = []
    comments.value = []
    activities.value = []
    attachments.value = []
  }
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

const newAttachmentUrl = ref('')
const attachmentError = ref('')
const showAttachmentForm = ref(false)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

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

function isValidUrl(str: string) {
  try {
    new URL(str)
    return true
  }
  catch {
    return false
  }
}

function addAttachmentUrl() {
  const url = newAttachmentUrl.value.trim()
  if (!url) return
  if (!isValidUrl(url)) {
    attachmentError.value = 'Please enter a valid URL'
    return
  }
  attachments.value.push({
    id: `a-${Date.now()}`,
    name: url,
    size: 'Link',
    type: 'file',
  })
  newAttachmentUrl.value = ''
  attachmentError.value = ''
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function handleFiles(files: FileList | null) {
  if (!files) return
  attachmentError.value = ''
  const maxSize = 10 * 1024 * 1024
  for (const file of Array.from(files)) {
    if (file.size > maxSize) {
      attachmentError.value = `File "${file.name}" exceeds 10 MB limit`
      continue
    }
    attachments.value.push({
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: formatBytes(file.size),
      type: 'file',
    })
  }
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
  if (target) target.value = ''
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function removeAttachment(id: string) {
  attachments.value = attachments.value.filter(a => a.id !== id)
}

const userOptions = [
  { name: 'Rasya', seed: 'Rasya', bg: 'b6e3f4' },
  { name: 'Dito', seed: 'Dito', bg: 'c0aede' },
  { name: 'Maya', seed: 'Maya', bg: 'ffd5dc' },
  { name: 'Rara', seed: 'Rara', bg: 'f9a8d4' },
]

const projectOptions = computed(() => {
  return task.value?.project ? [task.value.project] : []
})

const statusOptions = [
  { value: 'todo', label: 'To Do', cls: 'cs-new', dotCls: 'cs-new-dot' },
  { value: 'inprogress', label: 'In Progress', cls: 'cs-track', dotCls: 'cs-track-dot' },
  { value: 'inreview', label: 'In Review', cls: 'cs-medium', dotCls: 'cs-medium-dot' },
  { value: 'completed', label: 'Done', cls: 'cs-track', dotCls: 'cs-track-dot' },
  { value: 'overdue', label: 'Overdue', cls: 'cs-risk', dotCls: 'cs-risk-dot' },
]

const priorityOptions = [
  { value: 'high', label: 'High', cls: 'cs-high', color: '#D97706', dotCls: 'cs-high-dot' },
  { value: 'medium', label: 'Medium', cls: 'cs-medium', color: 'oklch(60.6% 0.25 292.717)', dotCls: 'cs-medium-dot' },
  { value: 'low', label: 'Low', cls: 'cs-low', color: '#16A34A', dotCls: 'cs-low-dot' },
]

const editForm = reactive({
  status: 'todo' as string,
  priority: 'medium' as 'high' | 'medium' | 'low',
  assignee: currentUser.name,
  project: '',
  dueDate: '',
  labels: '',
  progress: 0,
})

watch(() => task.value, (t) => {
  if (!t) return
  editForm.priority = t.priority ?? 'medium'
  editForm.project = t.project ?? ''
  editForm.dueDate = t.due ?? ''
  editForm.labels = t.labels.map(l => l.text).join(', ') ?? ''
}, { immediate: true })

watch(() => task.value?.status, (status) => {
  if (status) editForm.status = status
}, { immediate: true })

watch(() => detail.value?.assignee?.name, (name) => {
  editForm.assignee = name ?? currentUser.name
}, { immediate: true })

watch(() => progress.value, (p) => {
  editForm.progress = p
}, { immediate: true })

const statusChip = computed(() => statusOptions.find(s => s.value === editForm.status) || statusOptions[0])
const priorityChip = computed(() => priorityOptions.find(p => p.value === editForm.priority) || priorityOptions[1])
const parsedLabels = computed(() => editForm.labels.split(',').map(s => s.trim()).filter(Boolean))

function assigneeAvatarUrl(name: string) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}&backgroundColor=b6e3f4&backgroundType=solid`
}

const showSide = ref(true)
const openDropdown = ref<string | null>(null)
const collapsedSections = ref(new Set<string>())
const editingInline = ref<string | null>(null)
const inlineValue = ref('')

function toggleDropdown(field: string, e: MouseEvent) {
  e.stopPropagation()
  openDropdown.value = openDropdown.value === field ? null : field
  editingInline.value = null
}

function closeAll() {
  openDropdown.value = null
  if (editingInline.value) saveInline()
}

function toggleSection(id: string) {
  if (collapsedSections.value.has(id)) collapsedSections.value.delete(id)
  else collapsedSections.value.add(id)
}

function setStatus(opt: typeof statusOptions[0]) {
  editForm.status = opt.value
  openDropdown.value = null
}

function setPriority(opt: typeof priorityOptions[0]) {
  editForm.priority = opt.value as 'high' | 'medium' | 'low'
  openDropdown.value = null
}

function setAssignee(name: string) {
  editForm.assignee = name
  openDropdown.value = null
}

function startInline(field: string, current: string, e: MouseEvent) {
  e.stopPropagation()
  openDropdown.value = null
  editingInline.value = field
  inlineValue.value = current
  nextTick(() => {
    const el = document.getElementById('inline-' + field) as HTMLInputElement | null
    el?.focus()
    el?.select()
  })
}

function saveInline() {
  const field = editingInline.value
  if (!field) return
  if (field === 'labels') {
    editForm.labels = inlineValue.value
  }
  else if (field === 'dueDate') {
    editForm.dueDate = inlineValue.value
  }
  else if (field === 'progress') {
    const n = Number(inlineValue.value)
    editForm.progress = Math.max(0, Math.min(100, Number.isNaN(n) ? 0 : n))
  }
  editingInline.value = null
}

onMounted(() => document.addEventListener('click', closeAll))
onUnmounted(() => document.removeEventListener('click', closeAll))
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <AppHeader>
        <template #breadcrumb>
          <div class="pdh-crumb">
            <NuxtLink to="/my-task" class="pdh-crumb-link">My Task</NuxtLink>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="pdh-crumb-cur">{{ task?.title ?? id }}</span>
          </div>
        </template>
      </AppHeader>
    </template>

    <div class="-mx-6 -mt-5 flex flex-1 flex-col" style="min-height: 0">
      <!-- Empty state -->
      <div v-if="!task" class="flex flex-1 flex-col items-center justify-center bg-white py-16 text-center">
        <UIcon name="ph:check-square" class="size-12 text-gray-300" />
        <h2 class="mt-4 text-lg font-semibold text-gray-900">
          Task not found
        </h2>
        <NuxtLink to="/my-task" class="mt-2 text-sm text-blue-600 hover:text-blue-700">
          ← Back to My Task
        </NuxtLink>
      </div>

      <!-- ══ TWO-COLUMN LAYOUT ══ -->
      <div v-else class="pd-layout" :class="{ 'pd-layout--collapsed': !showSide }">
        <div class="pd-left">
          <!-- ══ HEADER ══ -->
          <div class="pdh">
            <!-- title row -->
            <div class="pdh-title-row">
              <div>
                <div class="pdh-title">{{ task.title }}</div>
              </div>
            </div>

            <!-- meta chips row -->
            <div class="pdh-meta">
              <span class="pdh-chip" :class="statusChip.cls">
                <span class="pdh-dot" :class="statusChip.dotCls" />
                {{ statusInfo.label }}
              </span>
              <span class="pdh-chip pdh-chip-priority" :style="{ color: priorityChip.color, background: priorityChip.color + '18' }">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 14V3l6 3 6-3v11l-6-3-6 3z" />
                </svg>
                {{ task.priorityLabel }}
              </span>
              <div class="pdh-prog-inline">
                <div class="pdh-prog-track">
                  <div class="pdh-prog-fill" :style="{ width: editForm.progress + '%', background: 'oklch(60.6% 0.25 292.717)' }" />
                </div>
                <span class="pdh-prog-pct">{{ editForm.progress }}%</span>
              </div>
              <div class="pdh-meta-date">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4" />
                  <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>
                {{ task.due }}
              </div>
              <div class="pdh-assignees-row">
                <div class="pdh-av-wrap">
                  <img :src="assigneeAvatarUrl(editForm.assignee)" :alt="editForm.assignee" class="pdh-av-img" :title="editForm.assignee">
                </div>
              </div>
              <span class="pdh-assignee-name">{{ editForm.assignee }}</span>
            </div>

            <!-- tabs -->
            <div class="pdh-tabs">
              <button class="pdh-tab" :class="{ active: activeTab === 'subtasks' }" @click="activeTab = 'subtasks'">
                Subtasks
                <span class="pdh-tab-badge">{{ subtasks.length }}</span>
              </button>
              <button class="pdh-tab" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
                Comments
                <span class="pdh-tab-badge">{{ comments.length }}</span>
              </button>
              <button class="pdh-tab" :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">
                Activity
                <span class="pdh-tab-badge">{{ activities.length }}</span>
              </button>
              <button class="pdh-tab" :class="{ active: activeTab === 'attachments' }" @click="activeTab = 'attachments'">
                Attachments
                <span class="pdh-tab-badge">{{ attachments.length }}</span>
              </button>
            </div>
          </div>

          <!-- ══ BODY ══ -->
          <div class="pd-body">
            <div class="pd-main">
              <!-- ── DESCRIPTION ── -->
              <div class="pd-section">
                <div class="pd-slabel">
                  Description
                </div>
                <div class="pd-desc">{{ detail?.fullDescription }}</div>
              </div>

              <!-- ── SUBTASKS TAB ── -->
              <template v-if="activeTab === 'subtasks'">
                <div class="pd-section">
                  <div class="pd-task-hdr">
                    <div class="pd-slabel" style="margin:0">
                      Subtasks
                    </div>
                    <div class="pd-task-prog">
                      <div class="pd-tp-track">
                        <div class="pd-tp-fill" :style="{ width: subtaskProgress.pct + '%' }" />
                      </div>
                      <span class="pd-tp-txt">{{ subtaskProgress.done }} / {{ subtaskProgress.total }} done</span>
                    </div>
                  </div>

                  <div v-if="subtasks.length" class="pd-tasklist">
                    <div v-for="subtask in subtasks" :key="subtask.id" class="pd-task" :class="{ done: subtask.done }">
                      <div class="pd-check" :class="{ checked: subtask.done }" @click="subtask.done = !subtask.done">
                        <svg v-if="subtask.done" width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      <span class="pd-tname">{{ subtask.title }}</span>
                      <div class="pd-tmeta">
                        <span class="pd-tdate">{{ subtask.assignee }}</span>
                        <button class="pd-tdelete" title="Delete" @click="deleteSubtask(subtask.id)">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="pd-empty">
                    No subtasks yet.
                  </div>

                  <!-- add subtask -->
                  <div class="pd-add-task-form">
                    <input v-model="newSubtaskTitle" class="pd-add-task-input" placeholder="Add a subtask…" @keydown.enter.prevent="addSubtask">
                    <select v-model="newSubtaskAssignee" class="pd-add-task-select">
                      <option value="">
                        Assignee
                      </option>
                      <option v-for="u in userOptions" :key="u.name" :value="u.name">
                        {{ u.name }}
                      </option>
                    </select>
                    <button class="pd-add-task-btn" @click="addSubtask">
                      Add
                    </button>
                  </div>
                </div>
              </template>

              <!-- ── COMMENTS TAB ── -->
              <template v-if="activeTab === 'comments'">
                <div class="pd-section">
                  <div class="pd-slabel">
                    Comments
                  </div>
                  <div v-for="comment in comments" :key="comment.id" class="pd-comment">
                    <div class="pd-cav" style="background:#DBEAFE;color:#2563EB">
                      {{ comment.author.initials }}
                    </div>
                    <div class="pd-cbody">
                      <div class="pd-chead">
                        <span class="pd-cauthor">{{ comment.author.name }}</span>
                        <span class="pd-ctime">{{ comment.time }}</span>
                      </div>
                      <div class="pd-ctext">{{ comment.text }}</div>
                    </div>
                  </div>
                  <div v-if="!comments.length" class="pd-empty">
                    No comments yet.
                  </div>
                  <div class="pd-cinput-row">
                    <div class="pd-cav" style="background:#DBEAFE;color:#2563EB">
                      {{ currentUser.initials }}
                    </div>
                    <input v-model="newCommentText" class="pd-cinput" placeholder="Add a comment…" @keydown.enter.prevent="addComment">
                    <button class="pd-send" @click="addComment">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8l12-6-5 12-2-5-5-1z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- ── ACTIVITY TAB ── -->
              <template v-if="activeTab === 'activity'">
                <div class="pd-section">
                  <div class="pd-slabel">
                    Activity
                  </div>
                  <div v-if="activities.length" class="pd-act-list">
                    <div v-for="activity in activities" :key="activity.id" class="pd-act-row">
                      <div class="pd-act-av-init" style="background:#F3F4F6;color:#4B5563">
                        {{ activity.actor.initials }}
                      </div>
                      <div class="pd-act-body">
                        <span class="pd-act-name">{{ activity.actor.name }}</span>
                        <span class="pd-act-time">· {{ activity.time }}</span>
                        <div class="pd-act-text">
                          {{ activity.text }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="pd-empty">
                    No activity yet.
                  </div>
                </div>
              </template>

              <!-- ── ATTACHMENTS TAB ── -->
              <template v-if="activeTab === 'attachments'">
                <div class="pd-section">
                  <div class="pd-task-hdr">
                    <div class="pd-slabel" style="margin:0">
                      Attachments
                    </div>
                    <button class="pd-add-task-btn" style="padding:6px 12px;font-size:12px" @click="showAttachmentForm = !showAttachmentForm">
                      {{ showAttachmentForm ? 'Cancel' : 'Add attachment' }}
                    </button>
                  </div>
                  <div v-if="attachments.length" class="pd-attach-list">
                    <div v-for="file in attachments" :key="file.id" class="pd-attach-row">
                      <div class="pd-attach-icon">
                        <svg v-if="file.type === 'figma'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="2" width="12" height="12" rx="2" fill="#F24E1E" />
                          <path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill="white" />
                        </svg>
                        <svg v-else-if="file.type === 'notion'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="2" width="12" height="12" rx="2" fill="#111" />
                          <path d="M5 5h6M5 8h4M5 11h3" stroke="white" stroke-width="1.2" stroke-linecap="round" />
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="#9CA3AF" stroke-width="1.4" />
                          <path d="M9 2v4h4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round" />
                        </svg>
                      </div>
                      <div class="pd-attach-info">
                        <a v-if="file.size === 'Link'" :href="file.name" target="_blank" rel="noopener" class="pd-attach-name pd-attach-name--link">{{ file.name }}</a>
                        <div v-else class="pd-attach-name">{{ file.name }}</div>
                        <div class="pd-attach-size">{{ file.size }}</div>
                      </div>
                      <button class="pd-tdelete" title="Remove" @click="removeAttachment(file.id)">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-else class="pd-empty">
                    No attachments yet.
                  </div>

                  <!-- add attachment form -->
                  <div v-if="showAttachmentForm" class="pd-add-attach-form">
                    <div class="pd-add-link-row">
                      <input v-model="newAttachmentUrl" class="pd-add-task-input" placeholder="Paste URL…" @keydown.enter.prevent="addAttachmentUrl">
                      <button class="pd-add-task-btn" @click="addAttachmentUrl">
                        Add link
                      </button>
                    </div>

                    <div
                      class="pd-dropzone"
                      :class="{ active: isDragging }"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="onDrop"
                      @click="triggerFileUpload"
                    >
                      <input ref="fileInput" type="file" multiple class="pd-file-input" @change="onFileChange">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span class="pd-dropzone-text">Drop files here or click to upload</span>
                      <span class="pd-dropzone-hint">Max 10 MB per file</span>
                    </div>

                    <div v-if="attachmentError" class="pd-attach-error">
                      {{ attachmentError }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- ── RIGHT SIDE PANEL ── -->
        <div class="pd-side" v-show="showSide">
          <div class="pd-side-top">
            <button class="pd-side-toggle" title="Hide panel" @click="showSide = false">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4" />
                <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4" />
              </svg>
            </button>
          </div>
          <div class="pd-side-card">
            <!-- ── PROPERTIES ── -->
            <div class="pd-panel-sec">
              <div class="pd-panel-hdr" @click="toggleSection('props')">
                <div style="display:flex;align-items:center;gap:8px">
                  <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('props') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span class="pd-panel-title">Properties</span>
                </div>
              </div>

              <div v-show="!collapsedSections.has('props')" class="pd-panel-body">
                <!-- STATUS -->
                <div class="pd-prop-row" @click.stop="toggleDropdown('status', $event)">
                  <div class="pd-prop-lbl">
                    Status
                  </div>
                  <div class="pd-prop-val pd-prop-dd-wrap">
                    <span class="pdh-dot" :class="statusChip.dotCls" />
                    {{ statusChip.label }}
                    <div v-if="openDropdown === 'status'" class="pd-float-dd" @click.stop>
                      <button v-for="opt in statusOptions" :key="opt.value" class="pd-dd-item" @click="setStatus(opt)">
                        <span class="pdh-dot" :class="opt.dotCls" />
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- PRIORITY -->
                <div class="pd-prop-row" @click.stop="toggleDropdown('priority', $event)">
                  <div class="pd-prop-lbl">
                    Priority
                  </div>
                  <div class="pd-prop-val pd-prop-dd-wrap">
                    <svg width="11" height="11" viewBox="0 0 16 16" :fill="priorityChip.color">
                      <path d="M2 14V3l6 3 6-3v11l-6-3-6 3z" />
                    </svg>
                    <span :style="{ color: priorityChip.color, fontWeight: 600 }">{{ priorityChip.label }}</span>
                    <div v-if="openDropdown === 'priority'" class="pd-float-dd" @click.stop>
                      <button v-for="opt in priorityOptions" :key="opt.value" class="pd-dd-item" @click="setPriority(opt)">
                        <svg width="11" height="11" viewBox="0 0 16 16" :fill="opt.color">
                          <path d="M2 14V3l6 3 6-3v11l-6-3-6 3z" />
                        </svg>
                        <span>{{ opt.label }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- ASSIGNEE -->
                <div class="pd-prop-row" @click.stop="toggleDropdown('assignee', $event)">
                  <div class="pd-prop-lbl">
                    Assignee
                  </div>
                  <div class="pd-prop-val pd-prop-dd-wrap">
                    <img :src="assigneeAvatarUrl(editForm.assignee)" :alt="editForm.assignee" class="pd-owner-avatar">
                    <span>{{ editForm.assignee }}</span>
                    <div v-if="openDropdown === 'assignee'" class="pd-float-dd" @click.stop>
                      <button v-for="u in userOptions" :key="u.name" class="pd-dd-item" @click="setAssignee(u.name)">
                        <img :src="assigneeAvatarUrl(u.name)" :alt="u.name" class="pd-owner-avatar">
                        {{ u.name }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- PROJECT -->
                <div class="pd-prop-row" @click.stop="toggleDropdown('project', $event)">
                  <div class="pd-prop-lbl">
                    Project
                  </div>
                  <div class="pd-prop-val pd-prop-dd-wrap">
                    <span>{{ editForm.project }}</span>
                    <div v-if="openDropdown === 'project'" class="pd-float-dd" @click.stop>
                      <button v-for="p in projectOptions" :key="p" class="pd-dd-item" @click="editForm.project = p; openDropdown = null">
                        {{ p }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- DUE DATE -->
                <div class="pd-prop-row" @click.stop="startInline('dueDate', editForm.dueDate, $event)">
                  <div class="pd-prop-lbl">
                    Due date
                  </div>
                  <div class="pd-prop-val">
                    <input v-if="editingInline === 'dueDate'" id="inline-dueDate" v-model="inlineValue" class="pd-inline-input" type="date" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                    <span v-else>{{ editForm.dueDate }}</span>
                  </div>
                </div>

                <!-- LABELS -->
                <div class="pd-prop-row pd-prop-row--labels" @click.stop="startInline('labels', editForm.labels, $event)">
                  <div class="pd-prop-lbl">
                    Labels
                  </div>
                  <div class="pd-prop-val pd-prop-val--labels">
                    <input v-if="editingInline === 'labels'" id="inline-labels" v-model="inlineValue" class="pd-inline-input" placeholder="UX, Design" @blur="saveInline" @keydown.enter="saveInline" @keydown.escape="editingInline = null" @click.stop>
                    <template v-else>
                      <span v-for="lb in parsedLabels" :key="lb" class="pd-label">{{ lb }}</span>
                      <span v-if="!parsedLabels.length" class="pd-empty" style="padding:0">None</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── PROGRESS ── -->
            <div class="pd-panel-sec">
              <div class="pd-panel-hdr" @click="toggleSection('prog')">
                <div style="display:flex;align-items:center;gap:8px">
                  <svg class="pd-panel-chevron" :class="{ collapsed: collapsedSections.has('prog') }" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span class="pd-panel-title">Progress</span>
                </div>
              </div>
              <div v-show="!collapsedSections.has('prog')" class="pd-panel-body">
                <div class="pd-prog-nums">
                  <div class="pd-prog-num-item">
                    <div class="pd-prog-num">{{ subtaskProgress.done }}</div>
                    <div class="pd-prog-num-lbl">
                      Done
                    </div>
                  </div>
                  <div class="pd-prog-num-item">
                    <div class="pd-prog-num">{{ subtaskProgress.total - subtaskProgress.done }}</div>
                    <div class="pd-prog-num-lbl">
                      Left
                    </div>
                  </div>
                  <div class="pd-prog-num-item">
                    <div class="pd-prog-num pd-prog-num--blue">{{ editForm.progress }}%</div>
                    <div class="pd-prog-num-lbl">
                      Complete
                    </div>
                  </div>
                </div>
                <div class="pd-prog-bar-wrap">
                  <div class="pd-prog-bar">
                    <div class="pd-prog-bar-fill" :style="{ width: editForm.progress + '%', background: 'oklch(60.6% 0.25 292.717)' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- reopen button when panel is hidden -->
        <button v-if="!showSide" class="pd-side-reopen" title="Show panel" @click="showSide = true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4" />
            <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* ── HEADER ── */
.pdh { background:#fff; border-bottom:1px solid #E5E7EB; padding:18px 28px 0; flex-shrink:0; }

.pdh-top-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.pdh-crumb { display:flex; align-items:center; gap:6px; font-size:12px; color:#9CA3AF; }
.pdh-crumb-link { color:#6B7280; text-decoration:none; }
.pdh-crumb-link:hover { color:#111827; }
.pdh-crumb-cur { color:#111827; font-weight:500; }
.pdh-actions { display:flex; align-items:center; gap:6px; }
.pdh-btn-ghost { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px; border:1px solid #E5E7EB; background:transparent; color:#4B5563; cursor:pointer; }
.pdh-btn-ghost:hover { background:#F9FAFB; }
.pdh-btn-icon { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px; border:1px solid #E5E7EB; background:transparent; color:#4B5563; cursor:pointer; }
.pdh-btn-icon:hover { background:#F9FAFB; }

.pdh-title-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.pdh-icon { width:40px; height:40px; border-radius:10px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.pdh-title { font-size:19px; font-weight:600; letter-spacing:-0.02em; color:#111827; line-height:1.2; }
.pdh-subtitle { font-size:12px; color:#9CA3AF; margin-top:2px; }

/* meta chips */
.pdh-meta { display:flex; align-items:center; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
.pdh-chip { font-size:11px; font-weight:600; padding:3px 9px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; letter-spacing:0.01em; }
.cs-risk    { background:#FEF2F2; color:#DC2626; }
.cs-track   { background:#ECFDF5; color:#059669; }
.cs-high    { background:#FEF3C7; color:#D97706; }
.cs-medium  { background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); }
.cs-low     { background:#F0FDF4; color:#16A34A; }
.cs-delayed { background:#FEF2F2; color:#991B1B; }
.cs-new     { background:#F9FAFB; color:#6B7280; }
.pdh-chip-priority { font-weight:500; }
.pdh-chip-labels { background:#F3F4F6; color:#4B5563; font-weight:500; }

/* status dot */
.pdh-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.cs-risk-dot    { background:#DC2626; }
.cs-track-dot   { background:#059669; }
.cs-delayed-dot { background:#EF4444; }
.cs-new-dot     { background:#9CA3AF; }
.cs-high-dot    { background:#D97706; }
.cs-medium-dot  { background:oklch(60.6% 0.25 292.717); }
.cs-low-dot     { background:#16A34A; }

/* progress inline */
.pdh-prog-inline { display:flex; align-items:center; gap:7px; }
.pdh-prog-track { width:80px; height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pdh-prog-fill { height:100%; border-radius:2px; }
.pdh-prog-pct { font-size:12px; font-weight:500; color:#4B5563; }

.pdh-meta-date { display:flex; align-items:center; gap:5px; font-size:12px; color:#4B5563; }
.pdh-meta-date.red { color:#EF4444; font-weight:500; }
.pdh-meta-date svg { flex-shrink:0; }

.pdh-assignees-row { display:flex; align-items:center; }
.pdh-av-wrap { width:24px; height:24px; border-radius:50%; border:2px solid #fff; overflow:hidden; margin-left:-6px; }
.pdh-av-wrap:first-child { margin-left:0; }
.pdh-av-img { width:100%; height:100%; object-fit:cover; }
.pdh-assignee-name { font-size:12px; font-weight:500; color:#4B5563; }

/* tabs */
.pdh-tabs { display:flex; align-items:center; gap:0; }
.pdh-tab { display:inline-flex; align-items:center; gap:5px; padding:0 4px; height:40px; margin-right:18px; background:transparent; border:none; border-bottom:2px solid transparent; font-size:13px; font-weight:500; color:#9CA3AF; cursor:pointer; font-family:inherit; transition:color .15s; white-space:nowrap; }
.pdh-tab:hover { color:#4B5563; }
.pdh-tab.active { color:oklch(60.6% 0.25 292.717); border-bottom-color:oklch(60.6% 0.25 292.717); }
.pdh-tab-badge { font-size:10px; font-weight:600; background:#F3F4F6; color:#9CA3AF; padding:1px 5px; border-radius:10px; }
.pdh-tab.active .pdh-tab-badge { background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); }

/* ── BODY LAYOUT ── */
.pd-layout { flex:1; display:grid; grid-template-columns:1fr 300px; min-height:0; overflow:hidden; position:relative; background:#fff; }
.pd-layout--collapsed { grid-template-columns:1fr; }
.pd-left { display:flex; flex-direction:column; overflow:hidden; min-height:0; }
.pd-body { flex:1; overflow:hidden; display:flex; flex-direction:column; min-height:0; }
.pd-main { padding:24px 28px; overflow-y:auto; flex:1; }
.pd-side {
  padding: 18px 12px 16px;
  overflow-y: auto;
  background: #fff;
}
.pd-side-top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.pd-side-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: #fff;
  color: #6B7280;
  cursor: pointer;
}
.pd-side-toggle:hover { background: #F3F4F6; color: #111827; }
.pd-side-card {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}
.pd-side-reopen {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: #fff;
  color: #6B7280;
  cursor: pointer;
}
.pd-side-reopen:hover { background: #F3F4F6; color: #111827; }

/* section */
.pd-section { margin-bottom:28px; }
.pd-slabel { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#9CA3AF; margin-bottom:10px; }

/* description */
.pd-desc { font-size:13.5px; line-height:1.7; color:#374151; }

/* quick stats */
.pd-qs-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; }
.pd-qs-card { border:1px solid #E5E7EB; border-radius:10px; padding:14px 16px; background:#fff; }
.pd-qs-card--danger { background:#FFF5F5; border-color:#FEE2E2; }
.pd-qs-num { font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.03em; line-height:1.2; }
.pd-qs-denom { font-size:14px; font-weight:500; color:#9CA3AF; }
.pd-qs-num.danger { color:#EF4444; }
.pd-qs-num.green  { font-size:16px; color:#22C55E; }
.pd-qs-num.purple { color:oklch(60.6% 0.25 292.717); }
.pd-qs-label { font-size:12px; color:#6B7280; margin-top:3px; }
.pd-qs-label.danger { color:#EF4444; }

/* recent activity header */
.pd-act-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pd-see-all { font-size:12px; font-weight:500; color:oklch(60.6% 0.25 292.717); background:none; border:none; cursor:pointer; padding:0; }
.pd-see-all:hover { text-decoration:underline; }

/* activity list */
.pd-act-list { display:flex; flex-direction:column; gap:14px; }
.pd-act-row { display:flex; align-items:flex-start; gap:10px; }
.pd-act-av { width:28px; height:28px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.pd-act-av-init { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-act-body { flex:1; }
.pd-act-name { font-size:12.5px; font-weight:600; color:#111827; }
.pd-act-time { font-size:11px; color:#9CA3AF; margin-left:5px; }
.pd-act-text { font-size:12.5px; color:#4B5563; margin-top:1px; }
.pd-act-target { font-style:italic; color:#111827; }

/* tasks */
.pd-task-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pd-task-prog { display:flex; align-items:center; gap:8px; }
.pd-tp-track { width:80px; height:3px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-tp-fill { height:100%; border-radius:2px; background:oklch(60.6% 0.25 292.717); }
.pd-tp-txt { font-size:11.5px; color:#9CA3AF; }
.pd-tasklist { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.pd-task { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #F3F4F6; cursor:pointer; }
.pd-task:last-child { border-bottom:none; }
.pd-task:hover { background:#F9FAFB; }
.pd-task.done { opacity:.5; }
.pd-check { width:16px; height:16px; border:1.5px solid #E5E7EB; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:#fff; }
.pd-check.checked { background:oklch(60.6% 0.25 292.717); border-color:oklch(60.6% 0.25 292.717); }
.pd-tname { flex:1; font-size:13px; color:#111827; }
.pd-task.done .pd-tname { text-decoration:line-through; color:#9CA3AF; }
.pd-tmeta { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.pd-tdate { font-size:11.5px; color:#9CA3AF; }
.pd-tdate.late { color:#DC2626; }
.pd-tassignee { display:flex; align-items:center; gap:5px; font-size:11.5px; color:#4B5563; }
.pd-tav { width:20px; height:20px; border-radius:50%; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-tdelete {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
  padding: 0;
}
.pd-task:hover .pd-tdelete { display:flex; }
.pd-tdelete:hover { background:#FEE2E2; border-color:#FECACA; color:#DC2626; }
.pd-add-task { display:flex; align-items:center; gap:8px; padding:9px 14px; color:#9CA3AF; font-size:12.5px; cursor:pointer; border:1px solid #E5E7EB; border-top:none; border-radius:0 0 8px 8px; margin-top:-1px; }
.pd-add-task:hover { color:oklch(60.6% 0.25 292.717); background:oklch(96% 0.04 292.717); }

/* add subtask form */
.pd-add-task-form { display:flex; align-items:center; gap:8px; padding:10px 0 0; }
.pd-add-task-input {
  flex:1;
  border:1px solid #E5E7EB;
  border-radius:8px;
  padding:8px 12px;
  font-size:13px;
  color:#111827;
  outline:none;
  font-family:inherit;
  background:#fff;
}
.pd-add-task-input:focus { border-color:oklch(60.6% 0.25 292.717); box-shadow:0 0 0 2px oklch(96% 0.04 292.717); }
.pd-add-task-select {
  width:120px;
  border:1px solid #E5E7EB;
  border-radius:8px;
  padding:8px 10px;
  font-size:13px;
  color:#111827;
  outline:none;
  font-family:inherit;
  background:#fff;
}
.pd-add-task-select:focus { border-color:oklch(60.6% 0.25 292.717); box-shadow:0 0 0 2px oklch(96% 0.04 292.717); }
.pd-add-task-btn {
  padding:8px 16px;
  background:oklch(60.6% 0.25 292.717);
  color:#fff;
  border:none;
  border-radius:8px;
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  font-family:inherit;
}
.pd-add-task-btn:hover { background:oklch(52% 0.27 292.717); }

/* comments */
.pd-comment { display:flex; gap:10px; margin-bottom:14px; }
.pd-cav { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-cbody { flex:1; background:#F9FAFB; border:1px solid #F3F4F6; border-radius:8px; padding:10px 14px; }
.pd-chead { display:flex; align-items:baseline; gap:6px; margin-bottom:4px; }
.pd-cauthor { font-size:12.5px; font-weight:600; color:#111827; }
.pd-ctime { font-size:11px; color:#9CA3AF; }
.pd-ctext { font-size:13px; color:#4B5563; line-height:1.5; }
.pd-cinput-row { display:flex; gap:10px; align-items:center; margin-top:14px; }
.pd-cinput { flex:1; border:1px solid #E5E7EB; border-radius:8px; padding:9px 14px; font-size:13px; color:#111827; outline:none; font-family:inherit; }
.pd-cinput::placeholder { color:#9CA3AF; }
.pd-cinput:hover { border-color:#D1D5DB; }
.pd-cinput:focus { border-color:oklch(60.6% 0.25 292.717); box-shadow:0 0 0 2px oklch(96% 0.04 292.717); }
.pd-send { width:32px; height:32px; background:oklch(60.6% 0.25 292.717); border:none; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.pd-send:hover { background:oklch(52% 0.27 292.717); }

/* attachments */
.pd-attach-list { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.pd-attach-row { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid #F3F4F6; position:relative; }
.pd-attach-row:last-child { border-bottom:none; }
.pd-attach-icon { width:28px; height:28px; border-radius:6px; background:#F3F4F6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pd-attach-info { flex:1; min-width:0; }
.pd-attach-name { font-size:12.5px; color:#111827; font-weight:500; word-break:break-all; }
.pd-attach-name--link { color:oklch(60.6% 0.25 292.717); text-decoration:none; }
.pd-attach-name--link:hover { text-decoration:underline; }
.pd-attach-size { font-size:11px; color:#9CA3AF; }
.pd-attach-row .pd-tdelete { display:none; }
.pd-attach-row:hover .pd-tdelete { display:flex; }
.pd-attach-dl { width:24px; height:24px; border-radius:5px; border:1px solid #E5E7EB; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#6B7280; }
.pd-attach-dl:hover { background:#F3F4F6; }

/* add attachment form */
.pd-add-attach-form { display:flex; flex-direction:column; gap:12px; padding-top:14px; }
.pd-add-attach-form .pd-add-link-row { display:flex; gap:8px; }
.pd-dropzone { border:2px dashed #E5E7EB; border-radius:10px; padding:24px; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; background:#fff; transition:border-color .15s, background .15s; position:relative; }
.pd-dropzone:hover, .pd-dropzone.active { border-color:oklch(60.6% 0.25 292.717); background:oklch(96% 0.04 292.717); }
.pd-dropzone-text { font-size:13px; font-weight:500; color:#4B5563; }
.pd-dropzone-hint { font-size:11.5px; color:#9CA3AF; }
.pd-file-input { position:absolute; opacity:0; width:0; height:0; }
.pd-attach-error { font-size:12px; color:#DC2626; background:#FEF2F2; padding:8px 10px; border-radius:6px; }

/* empty state */
.pd-empty { font-size:13px; color:#9CA3AF; padding:12px 0; }

/* ── SIDE PANEL ── */
.pd-panel-sec {
  padding: 14px 16px;
  border-top: 1px solid #E5E7EB;
}
.pd-panel-sec:first-child { border-top: none; }
.pd-panel-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.pd-panel-chevron { color:#6B7280; flex-shrink:0; }
.pd-panel-title { font-size:10.5px; font-weight:600; letter-spacing:0.06em; color:#9CA3AF; }
.pd-panel-btn { width:20px; height:20px; border-radius:4px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#6B7280; }
.pd-panel-btn:hover { background:#F3F4F6; color:#374151; }

.pd-prop-row { display:flex; align-items:center; justify-content:space-between; min-height:30px; border-radius:6px; padding:2px 4px; margin-bottom:1px; cursor:pointer; }
.pd-prop-row:hover { background:#F9FAFB; }
.pd-prop-row--labels { align-items:flex-start; padding-top:4px; }
.pd-prop-lbl { width:72px; flex-shrink:0; font-size:11.5px; font-weight:500; color:#9CA3AF; }
.pd-prop-row--labels .pd-prop-lbl { padding-top:4px; }
.pd-prop-val { font-size:12.5px; color:#111827; display:flex; align-items:center; }
.pd-prop-val--red { color:#EF4444; }
.pd-prop-val--priority { gap:5px; }
.pd-priority-icon { flex-shrink:0; }
.pd-priority-text { font-size:12.5px; font-weight:500; }
.pd-prop-val--owner { gap:7px; }
.pd-owner-avatar { width:20px; height:20px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.pd-owner-name { font-size:12.5px; color:#111827; }
.pd-prop-val--labels { gap:4px; flex-wrap:wrap; }
.pd-label { font-size:10.5px; background:#F3E8FF; color:#7C3AED; padding:2px 8px; border-radius:10px; font-weight:500; }

/* progress numbers */
.pd-prog-nums { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:8px; }
.pd-prog-num-item { text-align:center; }
.pd-prog-num { font-size:18px; font-weight:700; color:#111827; letter-spacing:-0.02em; }
.pd-prog-num--blue { color:oklch(60.6% 0.25 292.717); }
.pd-prog-num-lbl { font-size:10.5px; color:#9CA3AF; margin-top:1px; }
.pd-prog-bar-wrap { padding:0 2px; }
.pd-prog-bar { height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.pd-prog-bar-fill { height:100%; border-radius:2px; transition:width .3s; background:oklch(60.6% 0.25 292.717); }

/* panel body spacing */
.pd-panel-body { display:flex; flex-direction:column; }

/* chevron collapse */
.pd-panel-chevron { color:#6B7280; flex-shrink:0; transition:transform .15s; }
.pd-panel-chevron.collapsed { transform:rotate(-90deg); }
.pd-panel-hdr { cursor:pointer; user-select:none; }
.pd-panel-hdr-right { position:relative; }

/* floating dropdown anchor */
.pd-prop-dd-wrap { position:relative; gap:6px; }
.pd-float-dd {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 160px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 4px;
  z-index: 100;
}
.pd-float-dd--left { right:auto; left:0; }

.pd-dd-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: #111827;
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
}
.pd-dd-item:hover { background: #F9FAFB; }

/* inline input */
.pd-inline-input {
  width: 100%;
  border: 1px solid oklch(60.6% 0.25 292.717);
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
  background: #fff;
  box-shadow: 0 0 0 2px oklch(96% 0.04 292.717);
}
.pd-inline-input--red { color:#EF4444; }

/* assignees */
.pd-assignees { display:flex; flex-direction:column; gap:10px; }
.pd-assignee-row { display:flex; align-items:center; gap:10px; position:relative; }
.pd-av-lg { width:30px; height:30px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 0 0 1px #E5E7EB; flex-shrink:0; }
.pd-assignee-name { flex:1; font-size:12.5px; color:#111827; }
.pd-assignee-remove {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
  padding: 0;
}
.pd-assignee-row:hover .pd-assignee-remove { display:flex; }
.pd-assignee-remove:hover { background:#FEE2E2; border-color:#FECACA; color:#DC2626; }

/* quick links */
.pd-ql-list { display:flex; flex-direction:column; gap:4px; }
.pd-ql-row { display:flex; align-items:center; gap:8px; padding:6px 4px; border-radius:6px; color:#111827; }
.pd-ql-row:hover { background:#F9FAFB; }
.pd-ql-icon { width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#F9FAFB; }
.pd-ql-label { flex:1; font-size:12.5px; color:#111827; }
.pd-ql-delete {
  display: none;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  background: #fff;
  cursor: pointer;
  color: #9CA3AF;
  flex-shrink: 0;
  padding: 0;
}
.pd-ql-row:hover .pd-ql-delete { display:flex; }
.pd-ql-delete:hover { background:#FEE2E2; border-color:#FECACA; color:#DC2626; }
.pd-ql-ext { color:#9CA3AF; flex-shrink:0; text-decoration:none; display:flex; align-items:center; }
.pd-ql-ext:hover { color:#6B7280; }

/* add link form */
.pd-add-link-form { display:flex; flex-direction:column; gap:6px; padding:8px 4px 4px; border-top:1px solid #F3F4F6; margin-top:4px; }
.pd-add-link-input {
  width: 100%;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12.5px;
  color: #111827;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
.pd-add-link-input:focus { border-color:oklch(60.6% 0.25 292.717); box-shadow:0 0 0 2px oklch(96% 0.04 292.717); }
.pd-add-link-row { display:flex; gap:6px; }
.pd-add-link-submit { flex:1; padding:5px 0; background:oklch(60.6% 0.25 292.717); color:#fff; border:none; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; }
.pd-add-link-submit:hover { background:oklch(52% 0.27 292.717); }
.pd-add-link-cancel { flex:1; padding:5px 0; background:#F3F4F6; color:#4B5563; border:none; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; }
.pd-add-link-cancel:hover { background:#E5E7EB; }
</style>
