<script setup lang="ts">
import { statusOptions, priorityOptions, tasks as taskStore, type TaskStatus, type TaskPriority, type Task } from '~/shared/board'
import { people, findPerson, avatarColor } from '~/shared/projects'

const props = defineProps<{
  mode?: 'create' | 'edit' | 'view'
  initialData?: Partial<Task>
}>()

const emit = defineEmits<{ close: [] }>()

const isView = computed(() => props.mode === 'edit' || props.mode === 'view')

const defaultStatus: TaskStatus = props.initialData?.status ?? 'todo'
const defaultPriority: TaskPriority = props.initialData?.priority ?? 'medium'
const defaultAssignee = props.initialData?.assignee?.name ?? people[0]?.name ?? ''
const defaultProject = props.initialData?.projectName ?? props.initialData?.epicName ?? ''
const defaultDue = props.initialData?.dueDate ?? ''

const form = reactive({
  title: props.initialData?.title ?? '',
  status: defaultStatus,
  assignee: defaultAssignee,
  project: defaultProject,
  priority: defaultPriority,
  dueDate: defaultDue,
  estimate: '',
  description: props.initialData?.description ?? '',
})

const subtasks = reactive<{ id: string; title: string; done: boolean }[]>(props.initialData ? [] : [])
const showSubtaskInput = ref(false)
const newSubtask = ref('')

const openDd = ref<string | null>(null)
function toggleDd(field: string, e: MouseEvent) {
  e.stopPropagation()
  openDd.value = openDd.value === field ? null : field
}
function closeDds() { openDd.value = null }
onMounted(() => document.addEventListener('click', closeDds))
onUnmounted(() => document.removeEventListener('click', closeDds))

const statusOpt = computed(() => statusOptions.find(o => o.value === form.status))
const priorityOpt = computed(() => priorityOptions.find(o => o.value === form.priority))
const assigneePerson = computed(() => findPerson(form.assignee) ?? people[0])

const statusDotColor: Record<TaskStatus, string> = {
  'todo':        '#9CA3AF',
  'in-progress': '#3B82F6',
  'in-review':   '#F59E0B',
  'done':        '#22C55E',
}
const statusChipClass: Record<TaskStatus, string> = {
  'todo':        'chip-todo',
  'in-progress': 'chip-inprog',
  'in-review':   'chip-review',
  'done':        'chip-done',
}
const priorityColor: Record<TaskPriority, string> = {
  low: '#22C55E', medium: '#F59E0B', high: '#EF4444',
}

function addSubtask() {
  const t = newSubtask.value.trim()
  if (!t) return
  subtasks.push({ id: `st-${Date.now()}`, title: t, done: false })
  newSubtask.value = ''
  showSubtaskInput.value = false
}

function submit() {
  const title = form.title.trim()
  if (!title) return
  const assignee = findPerson(form.assignee) ?? people[0]

  if (isView.value && props.initialData?.id) {
    const existing = taskStore.find(t => t.id === props.initialData!.id)
    if (existing) {
      existing.title = title
      existing.description = form.description
      existing.status = form.status
      existing.statusLabel = statusOpt.value?.label ?? 'To Do'
      existing.priority = form.priority
      existing.priorityLabel = priorityOpt.value?.label ?? 'Medium'
      existing.assignee = { id: existing.assignee?.id ?? `u-${Date.now()}`, initials: assignee?.initials ?? 'R', name: assignee?.name ?? 'Rasya', avatar: assignee?.avatar }
      existing.epicName = form.project
      existing.projectName = form.project
      existing.dueDate = form.dueDate
      existing.dueDateLabel = form.dueDate
    }
  } else {
    taskStore.push({
      id: `task-${Date.now()}`,
      title,
      description: form.description,
      status: form.status,
      statusLabel: statusOpt.value?.label ?? 'To Do',
      priority: form.priority,
      priorityLabel: priorityOpt.value?.label ?? 'Medium',
      assignee: { id: `u-${Date.now()}`, initials: assignee?.initials ?? 'R', name: assignee?.name ?? 'Rasya', avatar: assignee?.avatar },
      epicId: '',
      epicName: form.project,
      projectId: '',
      projectName: form.project,
      dueDate: form.dueDate,
      dueDateLabel: form.dueDate,
      progress: 0,
      comments: 0,
      attachments: 0,
    })
  }
  emit('close')
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto">

      <!-- TITLE -->
      <div class="title-area">
        <textarea
          v-model="form.title"
          class="title-input"
          rows="1"
          placeholder="Task title"
          @input="($event.target as HTMLTextAreaElement).style.height = 'auto'; ($event.target as HTMLTextAreaElement).style.height = ($event.target as HTMLTextAreaElement).scrollHeight + 'px'"
        />
        <div class="title-chips">
          <div class="chip-wrap" @click.stop="toggleDd('status-chip', $event)">
            <button class="tc-chip" :class="statusChipClass[form.status]">
              <span class="chip-dot" :style="{ background: statusDotColor[form.status] }" />
              {{ statusOpt?.label }}
            </button>
            <div v-if="openDd === 'status-chip'" class="chip-dd" @click.stop>
              <button v-for="opt in statusOptions" :key="opt.value" class="chip-dd-item" @click="form.status = opt.value; closeDds()">
                <span class="chip-dd-dot" :style="{ background: statusDotColor[opt.value] }" />{{ opt.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PROPERTIES -->
      <div class="sec-hdr">Properties</div>
      <div class="prop-rows">

        <!-- Assignee -->
        <div class="pr" @click.stop="toggleDd('assignee', $event)">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Assignee
          </div>
          <div class="pr-val">
            <img v-if="assigneePerson?.avatar" :src="assigneePerson.avatar" class="pr-av" :alt="assigneePerson.name">
            <span v-else class="pr-av-init" :class="avatarColor(people.findIndex(p => p.name === assigneePerson?.name))">{{ assigneePerson?.initials }}</span>
            {{ assigneePerson?.name ?? 'Unassigned' }}
          </div>
          <div v-if="openDd === 'assignee'" class="pr-dd" @click.stop>
            <button v-for="p in people" :key="p.name" class="pr-dd-item" @click="form.assignee = p.name; closeDds()">
              <img v-if="p.avatar" :src="p.avatar" class="pr-av" :alt="p.name">
              <span v-else class="pr-av-init" :class="avatarColor(people.findIndex(pp => pp.name === p.name))">{{ p.initials }}</span>
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- Project -->
        <div class="pr">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Project
          </div>
          <div class="pr-val">
            <input v-model="form.project" class="pr-text" placeholder="Select project" @click.stop>
          </div>
        </div>

        <!-- Priority -->
        <div class="pr" @click.stop="toggleDd('priority', $event)">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 16 16" :fill="priorityColor[form.priority]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
            Priority
          </div>
          <div class="pr-val">
            <svg width="12" height="12" viewBox="0 0 16 16" :fill="priorityColor[form.priority]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
            <span :style="{ color: priorityColor[form.priority], fontWeight: 600 }">{{ priorityOpt?.label }}</span>
          </div>
          <div v-if="openDd === 'priority'" class="pr-dd" @click.stop>
            <button v-for="opt in priorityOptions" :key="opt.value" class="pr-dd-item" @click="form.priority = opt.value; closeDds()">
              <svg width="12" height="12" viewBox="0 0 16 16" :fill="priorityColor[opt.value]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
              <span :style="{ color: priorityColor[opt.value] }">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Due Date -->
        <div class="pr">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            Due Date
          </div>
          <div class="pr-val">
            <input v-model="form.dueDate" type="date" class="pr-date" @click.stop>
          </div>
        </div>

        <!-- Estimate -->
        <div class="pr">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Estimate
          </div>
          <div class="pr-val">
            <input v-model="form.estimate" class="pr-text" placeholder="e.g. 2h, 3d" @click.stop>
          </div>
        </div>

      </div>

      <!-- SUBTASKS -->
      <div class="sec-hdr tasks-hdr">
        Subtasks
        <span class="tasks-meta">{{ subtasks.filter(t => t.done).length }}/{{ subtasks.length }}</span>
      </div>
      <div class="tasks-wrap">
        <div v-for="t in subtasks" :key="t.id" class="task-row">
          <input v-model="t.done" type="checkbox" class="task-check" @click.stop>
          <span class="task-name" :class="{ done: t.done }">{{ t.title }}</span>
          <button class="task-del" @click="subtasks.splice(subtasks.indexOf(t), 1)">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div v-if="showSubtaskInput" class="task-input-row" @click.stop>
          <input
            v-model="newSubtask"
            class="task-input"
            placeholder="Subtask title…"
            autofocus
            @keydown.enter="addSubtask"
            @keydown.escape="showSubtaskInput = false; newSubtask = ''"
          >
          <button class="task-add-btn" @click="addSubtask">Add</button>
          <button class="task-cancel-btn" @click="showSubtaskInput = false; newSubtask = ''">Cancel</button>
        </div>
        <button v-else class="add-task-btn" @click="showSubtaskInput = true">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add subtask
        </button>
      </div>

      <!-- DESCRIPTION -->
      <div class="sec-hdr">Description</div>
      <div class="desc-wrap">
        <textarea
          v-model="form.description"
          class="desc-input"
          rows="3"
          placeholder="Add notes, context, links…"
          @input="($event.target as HTMLTextAreaElement).style.height = 'auto'; ($event.target as HTMLTextAreaElement).style.height = ($event.target as HTMLTextAreaElement).scrollHeight + 'px'"
        />
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <button class="icon-btn" title="Attach">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
      </div>
      <div class="footer-right">
        <button class="btn-cancel" @click="$emit('close')">{{ isView ? 'Close' : 'Cancel' }}</button>
        <button v-if="!isView" class="btn-create" @click="submit">Create task</button>
        <button v-else class="btn-create" @click="submit">Save changes</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── TITLE ── */
.title-area { padding: 20px 24px 14px; border-bottom: 1px solid #F3F4F6; }
.title-input {
  width: 100%; border: none; outline: none; resize: none;
  font-size: 18px; font-weight: 600; color: #111827;
  letter-spacing: -0.02em; font-family: inherit; background: transparent;
  line-height: 1.3; display: block; margin-bottom: 12px;
}
.title-input::placeholder { color: #D1D5DB; }
.title-chips { display: flex; align-items: center; gap: 6px; }
.chip-wrap { position: relative; }
.tc-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 500;
  cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: opacity .1s;
}
.tc-chip:hover { opacity: .8; }
.chip-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.chip-todo   { background: #F9FAFB; color: #6B7280; border-color: #E5E7EB; }
.chip-inprog { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
.chip-review { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
.chip-done   { background: #F0FDF4; color: #166534; border-color: #BBF7D0; }
.chip-dd {
  position: absolute; top: calc(100% + 5px); left: 0; z-index: 100;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; min-width: 150px;
}
.chip-dd-item {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 7px 10px; border-radius: 6px; border: none; background: none;
  font-size: 12.5px; color: #111827; cursor: pointer; font-family: inherit; text-align: left;
}
.chip-dd-item:hover { background: #F9FAFB; }
.chip-dd-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* SEC HEADER */
.sec-hdr {
  padding: 12px 24px 8px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; color: #9CA3AF;
  border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F9FAFB;
}
.tasks-hdr { display: flex; justify-content: space-between; align-items: center; }
.tasks-meta { font-size: 11px; font-weight: 500; color: #9CA3AF; letter-spacing: 0; text-transform: none; }

/* PROP ROWS */
.prop-rows { padding: 4px 16px; }
.pr {
  position: relative; display: flex; align-items: center;
  min-height: 36px; padding: 5px 8px; border-radius: 7px;
  cursor: pointer; transition: background .1s; margin-bottom: 1px;
}
.pr:hover { background: #F9FAFB; }
.pr-lbl {
  width: 110px; flex-shrink: 0; display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 500; color: #9CA3AF;
}
.pr-val { flex: 1; display: flex; align-items: center; gap: 6px; font-size: 13px; color: #111827; }
.pr-av { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.pr-av-init {
  width: 20px; height: 20px; border-radius: 50%; font-size: 8px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pr-date {
  border: none; outline: none; font-size: 13px; color: #111827;
  font-family: inherit; background: transparent; cursor: pointer; padding: 0;
}
.pr-date::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
.pr-text {
  border: none; outline: none; font-size: 13px; color: #111827;
  font-family: inherit; background: transparent; width: 100%;
}
.pr-text::placeholder { color: #D1D5DB; }
.pr-dd {
  position: absolute; top: calc(100% + 4px); left: 110px; z-index: 100;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; min-width: 160px;
}
.pr-dd-item {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 7px 10px; border-radius: 6px; border: none; background: none;
  font-size: 12.5px; color: #111827; cursor: pointer; font-family: inherit; text-align: left;
}
.pr-dd-item:hover { background: #F9FAFB; }

/* SUBTASKS */
.tasks-wrap { padding: 8px 24px 16px; }
.task-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0; border-bottom: 1px solid #F9FAFB;
}
.task-check { width: 14px; height: 14px; accent-color: #2563EB; cursor: pointer; flex-shrink: 0; }
.task-name { flex: 1; font-size: 13px; color: #374151; }
.task-name.done { text-decoration: line-through; color: #9CA3AF; }
.task-del {
  display: none; width: 18px; height: 18px; align-items: center; justify-content: center;
  border-radius: 50%; border: none; background: transparent; color: #9CA3AF; cursor: pointer; padding: 0;
}
.task-row:hover .task-del { display: flex; }
.task-del:hover { color: #EF4444; }
.task-input-row { display: flex; align-items: center; gap: 6px; padding: 6px 0; }
.task-input {
  flex: 1; border: 1px solid #E5E7EB; border-radius: 6px;
  padding: 5px 10px; font-size: 13px; outline: none; font-family: inherit;
}
.task-input:focus { border-color: #2563EB; }
.task-add-btn {
  padding: 5px 12px; background: #2563EB; color: #fff; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.task-add-btn:hover { background: #1D4ED8; }
.task-cancel-btn {
  padding: 5px 10px; background: #F3F4F6; color: #4B5563; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.add-task-btn {
  display: flex; align-items: center; gap: 7px; width: 100%;
  padding: 8px 10px; border-radius: 8px; border: 1px dashed #E5E7EB;
  background: transparent; color: #9CA3AF; font-size: 12.5px;
  cursor: pointer; font-family: inherit; margin-top: 4px; transition: all .1s;
}
.add-task-btn:hover { border-color: #D1D5DB; color: #6B7280; background: #F9FAFB; }

/* DESCRIPTION */
.desc-wrap { padding: 8px 24px 16px; }
.desc-input {
  width: 100%; border: none; outline: none; resize: none;
  font-size: 13.5px; line-height: 1.7; color: #374151;
  font-family: inherit; background: transparent; min-height: 72px;
}
.desc-input::placeholder { color: #D1D5DB; }

/* FOOTER */
.footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; border-top: 1px solid #F3F4F6; flex-shrink: 0; background: #fff;
}
.footer-left { display: flex; gap: 6px; }
.footer-right { display: flex; align-items: center; gap: 8px; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 7px;
  border: 1px solid #E5E7EB; background: #fff; color: #6B7280; cursor: pointer;
}
.icon-btn:hover { background: #F3F4F6; color: #374151; }
.btn-cancel {
  height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid #E5E7EB; background: #fff; color: #4B5563;
  font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.btn-cancel:hover { background: #F9FAFB; }
.btn-create {
  height: 34px; padding: 0 16px; border-radius: 8px;
  border: none; background: #2563EB; color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s;
}
.btn-create:hover { background: #1D4ED8; }
</style>
