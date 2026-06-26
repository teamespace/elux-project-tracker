<script setup lang="ts">
import { statusOptions, priorityOptions } from '~/shared/projects'
import type { ProjectStatus, ProjectPriority } from '~/shared/projects'

const props = defineProps<{
  mode?: 'create' | 'edit' | 'view'
  initialData?: Record<string, unknown>
}>()

const emit = defineEmits<{ close: []; saved: [] }>()

const isView = computed(() => props.mode === 'edit' || props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')
const { user } = useUserSession()

const initialStatus: ProjectStatus = (props.initialData?.status as ProjectStatus) ?? 'not-started'
const initialPriority: ProjectPriority = (props.initialData?.priority as ProjectPriority) ?? 'medium'
const initialOwner = (props.initialData?.owner as { name?: string } | undefined)?.name ?? user.value?.name ?? ''
const initialAssignees = (props.initialData?.assignees as unknown[] | undefined)?.map((a) => (a as { name?: string }).name).filter((n): n is string => Boolean(n)) ?? (user.value?.name ? [user.value.name] : [])

/* ── form state ── */
const form = reactive({
  name: (props.initialData?.name as string) ?? '',
  status: initialStatus,
  priority: initialPriority,
  owner: initialOwner,
  start: (props.initialData?.startDate as string) ?? (props.initialData?.start as string) ?? '',
  due: (props.initialData?.endDate as string) ?? (props.initialData?.due as string) ?? '',
  labels: Array.isArray(props.initialData?.labels) ? props.initialData.labels.join(', ') : (props.initialData?.labels as string) ?? '',
  category: (props.initialData?.category as string) ?? '',
  figma: (props.initialData?.links as { figma?: string } | undefined)?.figma ?? (props.initialData?.figma as string) ?? '',
  notion: (props.initialData?.links as { notion?: string } | undefined)?.notion ?? (props.initialData?.notion as string) ?? '',
  description: (props.initialData?.description as string) ?? '',
  assignees: initialAssignees,
})

const childTasks = reactive<{ id: string; title: string; done: boolean }[]>((props.initialData?.childTasks as unknown[] | undefined)?.map((t) => ({ id: (t as { id?: string }).id ?? `ct-${Date.now()}`, title: (t as { title?: string }).title ?? '', done: Boolean((t as { done?: boolean }).done) })) ?? [])
const newTaskTitle = ref('')
const showTaskInput = ref(false)

const existingComments = computed(() => (props.initialData?.commentsList as unknown[] | undefined) ?? [] as { id: string; author: string; aInit: string; aBg: string; aColor: string; time: string; text: string }[])
const existingAttachments = computed(() => (props.initialData?.attachmentsList as unknown[] | undefined) ?? [] as { id: string; name: string; size: string; type: string }[])

/* ── dropdown state ── */
const openDd = ref<string | null>(null)
function toggleDd(field: string, e: MouseEvent) {
  e.stopPropagation()
  openDd.value = openDd.value === field ? null : field
}
function closeDds() { openDd.value = null }
onMounted(() => document.addEventListener('click', closeDds))
onUnmounted(() => document.removeEventListener('click', closeDds))

/* ── derived ── */
const statusOpt = computed(() => statusOptions.find(o => o.value === form.status))
const priorityOpt = computed(() => priorityOptions.find(o => o.value === form.priority))
const ownerPerson = computed(() => findPerson(form.owner) ?? people[0])

const availableAssignees = computed(() => people.filter(p => !form.assignees.includes(p.name)))

const statusDotColor: Record<ProjectStatus, string> = {
  'not-started': '#9CA3AF',
  'on-track':    '#22C55E',
  'at-risk':     '#F59E0B',
  'delayed':     '#EF4444',
}
const statusChipClass: Record<ProjectStatus, string> = {
  'not-started': 'chip-ns',
  'on-track':    'chip-track',
  'at-risk':     'chip-risk',
  'delayed':     'chip-delayed',
}
const priorityColor: Record<ProjectPriority, string> = {
  low: '#22C55E', medium: '#F59E0B', high: '#EF4444',
}
const priorityChipClass: Record<ProjectPriority, string> = {
  low: 'chip-prio-low', medium: 'chip-prio-med', high: 'chip-prio-high',
}

function addTask() {
  const t = newTaskTitle.value.trim()
  if (!t) return
  childTasks.push({ id: `ct-${Date.now()}`, title: t, done: false })
  newTaskTitle.value = ''
  showTaskInput.value = false
}

function addAssignee(name: string) {
  form.assignees.push(name)
  closeDds()
}
function removeAssignee(name: string) {
  const i = form.assignees.indexOf(name)
  if (i !== -1) form.assignees.splice(i, 1)
}

function submit() {
  if (isEdit.value && props.initialData?.id) {
    $fetch(`/api/projects/${props.initialData.id}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description,
        status: form.status,
        statusLabel: statusOpt.value?.label,
        priority: form.priority,
        priorityLabel: priorityOpt.value?.label,
        dueDate: form.due,
        category: form.category,
        labels: form.labels,
      },
    }).then(() => {
      refreshNuxtData('projects')
      emit('close')
    }).catch((err) => {
      console.error('Failed to update project:', err)
    })
  }
  else if (isView.value) {
    console.log('View project', props.initialData?.id)
    emit('close')
  }
  else {
    $fetch('/api/projects', {
      method: 'POST',
      body: {
        name: form.name,
        description: form.description,
        status: form.status,
        statusLabel: statusOpt.value?.label ?? 'NOT STARTED',
        priority: form.priority,
        priorityLabel: priorityOpt.value?.label ?? 'Medium',
        ownerId: user.value?.id ?? null,
        dueDate: form.due,
        color: 'bg-blue-500',
        category: form.category,
        labels: form.labels,
      },
    }).then(() => {
      refreshNuxtData('projects')
      emit('close')
    }).catch((err) => {
      console.error('Failed to create project:', err)
    })
  }
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto">

      <!-- ── TITLE AREA ── -->
      <div class="title-area">
        <textarea
          v-model="form.name"
          class="title-input"
          rows="1"
          placeholder="Untitled project"
          @input="($event.target as HTMLTextAreaElement).style.height = 'auto'; ($event.target as HTMLTextAreaElement).style.height = ($event.target as HTMLTextAreaElement).scrollHeight + 'px'"
        />
        <div class="title-chips">
          <!-- Status chip -->
          <div class="chip-wrap" @click.stop="toggleDd('status', $event)">
            <button class="tc-chip" :class="statusChipClass[form.status]">
              <span class="chip-dot" :style="{ background: statusDotColor[form.status] }" />
              {{ statusOpt?.label }}
            </button>
            <div v-if="openDd === 'status'" class="chip-dd" @click.stop>
              <button
                v-for="opt in statusOptions" :key="opt.value"
                class="chip-dd-item"
                @click="form.status = opt.value; closeDds()"
              >
                <span class="chip-dd-dot" :style="{ background: statusDotColor[opt.value] }" />
                {{ opt.label }}
              </button>
            </div>
          </div>
          <!-- Priority chip -->
          <div class="chip-wrap" @click.stop="toggleDd('priority', $event)">
            <button class="tc-chip" :class="priorityChipClass[form.priority]">
              <svg width="10" height="10" viewBox="0 0 16 16" :fill="priorityColor[form.priority]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
              {{ priorityOpt?.label }}
            </button>
            <div v-if="openDd === 'priority'" class="chip-dd" @click.stop>
              <button
                v-for="opt in priorityOptions" :key="opt.value"
                class="chip-dd-item"
                @click="form.priority = opt.value; closeDds()"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" :fill="priorityColor[opt.value]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PROPERTIES ── -->
      <div class="sec-hdr">Properties</div>
      <div class="props-grid">

        <!-- STATUS -->
        <div class="pf" @click.stop="toggleDd('status-field', $event)">
          <div class="pf-lbl">Status</div>
          <div class="pf-val">
            <span class="pf-status">
              <span class="pf-dot" :style="{ background: statusDotColor[form.status] }" />
              {{ statusOpt?.label }}
            </span>
            <svg class="pf-chev" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div v-if="openDd === 'status-field'" class="pf-dd" @click.stop>
            <button v-for="opt in statusOptions" :key="opt.value" class="pf-dd-item" @click="form.status = opt.value; closeDds()">
              <span class="pf-dot" :style="{ background: statusDotColor[opt.value] }" />{{ opt.label }}
            </button>
          </div>
        </div>

        <!-- OWNER -->
        <div class="pf" @click.stop="toggleDd('owner', $event)">
          <div class="pf-lbl">Owner</div>
          <div class="pf-val">
            <img v-if="ownerPerson?.avatar" :src="ownerPerson.avatar" class="pf-av" :alt="ownerPerson.name">
            <span v-else class="pf-av-init" :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))">{{ ownerPerson?.initials }}</span>
            <span>{{ ownerPerson?.name ?? 'Unassigned' }}</span>
            <svg class="pf-chev" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div v-if="openDd === 'owner'" class="pf-dd" @click.stop>
            <button v-for="p in people" :key="p.name" class="pf-dd-item" @click="form.owner = p.name; closeDds()">
              <img v-if="p.avatar" :src="p.avatar" class="pf-av" :alt="p.name">
              <span v-else class="pf-av-init" :class="avatarColor(people.findIndex(pp => pp.name === p.name))">{{ p.initials }}</span>
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- PRIORITY -->
        <div class="pf" @click.stop="toggleDd('priority-field', $event)">
          <div class="pf-lbl">Priority</div>
          <div class="pf-val">
            <svg width="12" height="12" viewBox="0 0 16 16" :fill="priorityColor[form.priority]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
            <span :style="{ color: priorityColor[form.priority], fontWeight: 600 }">{{ priorityOpt?.label }}</span>
            <svg class="pf-chev" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div v-if="openDd === 'priority-field'" class="pf-dd" @click.stop>
            <button v-for="opt in priorityOptions" :key="opt.value" class="pf-dd-item" @click="form.priority = opt.value; closeDds()">
              <svg width="12" height="12" viewBox="0 0 16 16" :fill="priorityColor[opt.value]"><path d="M2 14V3l6 3 6-3v11l-6-3-6 3z"/></svg>
              <span :style="{ color: priorityColor[opt.value], fontWeight: 600 }">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- START -->
        <div class="pf">
          <div class="pf-lbl">Start</div>
          <div class="pf-val"><input v-model="form.start" type="date" class="pf-date-input"></div>
        </div>

        <!-- DUE -->
        <div class="pf">
          <div class="pf-lbl">Due</div>
          <div class="pf-val"><input v-model="form.due" type="date" class="pf-date-input"></div>
        </div>

        <!-- LABELS -->
        <div class="pf">
          <div class="pf-lbl">Labels</div>
          <div class="pf-val">
            <input v-model="form.labels" type="text" class="pf-text-input" placeholder="—">
          </div>
        </div>

        <!-- CATEGORY -->
        <div class="pf">
          <div class="pf-lbl">Category</div>
          <div class="pf-val">
            <input v-model="form.category" type="text" class="pf-text-input" placeholder="—">
          </div>
        </div>

        <!-- ASSIGNEES -->
        <div class="pf">
          <div class="pf-lbl">Assignees</div>
          <div class="pf-val pf-assignees">
            <div
              v-for="name in form.assignees" :key="name"
              class="pf-av-wrap"
              :title="name"
              @click.stop="removeAssignee(name)"
            >
              <img
                :src="findPerson(name)?.avatar"
                class="pf-av"
                :alt="name"
              >
            </div>
            <div v-if="availableAssignees.length" class="pf-add-av-wrap" @click.stop="toggleDd('assignees', $event)">
              <button class="pf-add-av">+</button>
              <div v-if="openDd === 'assignees'" class="pf-dd" @click.stop>
                <button v-for="p in availableAssignees" :key="p.name" class="pf-dd-item" @click="addAssignee(p.name)">
                  <img v-if="p.avatar" :src="p.avatar" class="pf-av" :alt="p.name">
                  <span v-else class="pf-av-init">{{ p.initials }}</span>
                  {{ p.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div><!-- /props-grid -->

      <!-- ── QUICK LINKS ── -->
      <div class="sec-hdr" style="margin-top:4px">Quick links</div>
      <div class="props-grid">

        <div class="pf">
          <div class="pf-lbl">
            <svg width="12" height="12" viewBox="0 0 200 300" fill="none" style="flex-shrink:0">
              <path d="M100 0H0v100h100V0z" fill="#FF7262"/>
              <path d="M0 100H100v100H0V100z" fill="#F24E1E"/>
              <path d="M0 200H100v100H0V200z" fill="#0ACF83"/>
              <path d="M100 100h100v100H100V100z" fill="#1ABCFE"/>
              <path d="M100 0h100v100H100V0z" fill="#A259FF"/>
            </svg>
            Figma
          </div>
          <div class="pf-val">
            <input v-model="form.figma" type="url" class="pf-link-input" placeholder="Add link">
          </div>
        </div>

        <div class="pf">
          <div class="pf-lbl">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><rect width="24" height="24" rx="4" fill="#111827"/><path d="M7 7h10M7 12h7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>
            Notion
          </div>
          <div class="pf-val">
            <input v-model="form.notion" type="url" class="pf-link-input" placeholder="Add link">
          </div>
        </div>

        <div class="pf" style="grid-column: 1 / -1">
          <div class="pf-lbl">Other</div>
          <div class="pf-val pf-other-add">+ Add link</div>
        </div>

      </div>

      <!-- ── DESCRIPTION ── -->
      <div class="sec-hdr" style="margin-top:4px">Description</div>
      <div class="desc-wrap">
        <textarea
          v-model="form.description"
          class="desc-input"
          rows="3"
          placeholder="Add a description…"
          @input="($event.target as HTMLTextAreaElement).style.height = 'auto'; ($event.target as HTMLTextAreaElement).style.height = ($event.target as HTMLTextAreaElement).scrollHeight + 'px'"
        />
      </div>

      <!-- ── TASKS ── -->
      <div class="sec-hdr tasks-hdr">
        Tasks
        <span class="tasks-meta">{{ childTasks.filter(t=>t.done).length }}/{{ childTasks.length }} · {{ childTasks.length ? Math.round(childTasks.filter(t=>t.done).length / childTasks.length * 100) : 0 }}%</span>
      </div>
      <div class="tasks-wrap">
        <div v-for="t in childTasks" :key="t.id" class="task-row">
          <input v-model="t.done" type="checkbox" class="task-check" @click.stop>
          <span class="task-name" :class="{ done: t.done }">{{ t.title }}</span>
          <button class="task-del" @click="childTasks.splice(childTasks.indexOf(t), 1)">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div v-if="showTaskInput" class="task-input-row" @click.stop>
          <input
            v-model="newTaskTitle"
            class="task-input"
            placeholder="Task title…"
            autofocus
            @keydown.enter="addTask"
            @keydown.escape="showTaskInput = false; newTaskTitle = ''"
          >
          <button class="task-add-btn" @click="addTask">Add</button>
          <button class="task-cancel-btn" @click="showTaskInput = false; newTaskTitle = ''">Cancel</button>
        </div>
        <button v-else class="add-task-btn" @click="showTaskInput = true">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add task
        </button>
      </div>

      <!-- ── COMMENTS (existing) ── -->
      <template v-if="isView && existingComments.length">
        <div class="sec-hdr">Comments</div>
        <div class="sec-list-wrap">
          <div v-for="c in existingComments" :key="c.id" class="sec-comment-row">
            <div class="sec-av" :style="{ background: c.aBg, color: c.aColor }">{{ c.aInit }}</div>
            <div class="sec-comment-body">
              <div class="sec-comment-head">
                <span class="sec-comment-author">{{ c.author }}</span>
                <span class="sec-comment-time">{{ c.time }}</span>
              </div>
              <div class="sec-comment-text">{{ c.text }}</div>
            </div>
          </div>
        </div>
      </template>

      <!-- ── ATTACHMENTS (existing) ── -->
      <template v-if="isView && existingAttachments.length">
        <div class="sec-hdr">Attachments</div>
        <div class="sec-list-wrap">
          <div v-for="a in existingAttachments" :key="a.id" class="sec-attach-row">
            <div class="sec-attach-icon">
              <svg v-if="a.type === 'figma'" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" fill="#F24E1E"/><path d="M8 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill="white"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" stroke="#9CA3AF" stroke-width="1.4"/><path d="M9 2v4h4" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>
            </div>
            <span class="sec-attach-name">{{ a.name }}</span>
            <span class="sec-attach-size">{{ a.size }}</span>
          </div>
        </div>
      </template>

    </div><!-- /scroll area -->

    <!-- ── FOOTER ── -->
    <div class="footer">
      <div class="footer-left">
        <button class="icon-btn" title="Attach">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <button class="icon-btn" title="Emoji">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>
      </div>
      <div class="footer-right">
        <button class="btn-cancel" @click="$emit('close')">{{ isView ? 'Close' : 'Cancel' }}</button>
        <button v-if="!isView" class="btn-create" @click="submit">Create project</button>
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

/* title chips */
.chip-wrap { position: relative; }
.tc-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11.5px; font-weight: 500; cursor: pointer; border: 1px solid transparent;
  font-family: inherit; transition: opacity .1s;
}
.tc-chip:hover { opacity: .8; }
.chip-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.chip-ns      { background: #F9FAFB; color: #6B7280; border-color: #E5E7EB; }
.chip-track   { background: #F0FDF4; color: #166534; border-color: #BBF7D0; }
.chip-risk    { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
.chip-delayed { background: #FEF2F2; color: #991B1B; border-color: #FECACA; }
.chip-prio-low  { background: #F0FDF4; color: #15803D; border-color: #BBF7D0; }
.chip-prio-med  { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
.chip-prio-high { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
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

/* ── SECTION HEADER ── */
.sec-hdr {
  padding: 12px 24px 8px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; color: #9CA3AF;
  border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F9FAFB;
}
.tasks-hdr { display: flex; justify-content: space-between; align-items: center; }
.tasks-meta { font-size: 11px; font-weight: 500; color: #9CA3AF; letter-spacing: 0; text-transform: none; }

/* ── PROPERTIES GRID ── */
.props-grid { display: grid; grid-template-columns: 1fr 1fr; padding: 4px 16px 4px; }
.pf {
  position: relative;
  padding: 10px 8px;
  border-bottom: 1px solid #F9FAFB;
  cursor: pointer;
  transition: background .1s;
}
.pf:hover { background: #FAFAFA; border-radius: 6px; }
.pf-lbl {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; color: #9CA3AF; margin-bottom: 5px;
}
.pf-val {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; color: #111827;
}
.pf-chev { margin-left: auto; color: #D1D5DB; flex-shrink: 0; }
.pf-status { display: flex; align-items: center; gap: 5px; }
.pf-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pf-av { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.pf-av-init {
  width: 20px; height: 20px; border-radius: 50%; font-size: 8px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pf-date-input {
  border: none; outline: none; font-size: 13px; color: #111827;
  font-family: inherit; background: transparent; cursor: pointer; width: 100%; padding: 0;
}
.pf-date-input::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
.pf-text-input {
  border: none; outline: none; font-size: 13px; color: #111827;
  font-family: inherit; background: transparent; width: 100%;
}
.pf-text-input::placeholder { color: #D1D5DB; }
.pf-link-input {
  border: none; outline: none; font-size: 13px; color: #2563EB;
  font-family: inherit; background: transparent; width: 100%;
}
.pf-link-input::placeholder { color: #D1D5DB; }
.pf-other-add { font-size: 13px; color: #9CA3AF; }

/* assignees */
.pf-assignees { gap: 3px; }
.pf-av-wrap { cursor: pointer; position: relative; }
.pf-av-wrap:hover::after {
  content: '×';
  position: absolute; inset: 0;
  background: rgba(239,68,68,.7); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #fff; font-weight: 700;
}
.pf-add-av-wrap { position: relative; }
.pf-add-av {
  width: 20px; height: 20px; border-radius: 50%;
  border: 1.5px dashed #D1D5DB; background: transparent;
  color: #9CA3AF; font-size: 13px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.pf-add-av:hover { border-color: #9CA3AF; color: #6B7280; }

/* field floating dropdown */
.pf-dd {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 100;
  background: #fff; border: 1px solid #E5E7EB; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; min-width: 160px;
}
.pf-dd-item {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 7px 10px; border-radius: 6px; border: none; background: none;
  font-size: 12.5px; color: #111827; cursor: pointer; font-family: inherit; text-align: left;
}
.pf-dd-item:hover { background: #F9FAFB; }

/* ── DESCRIPTION ── */
.desc-wrap { padding: 8px 24px 16px; }
.desc-input {
  width: 100%; border: none; outline: none; resize: none;
  font-size: 13.5px; line-height: 1.7; color: #374151;
  font-family: inherit; background: transparent; min-height: 72px;
}
.desc-input::placeholder { color: #D1D5DB; }

/* ── TASKS ── */
.tasks-wrap { padding: 8px 24px 16px; }
.task-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0; border-bottom: 1px solid #F9FAFB;
}
.task-check { width: 14px; height: 14px; accent-color: #111827; cursor: pointer; flex-shrink: 0; }
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
.task-input:focus { border-color: #111827; }
.task-add-btn {
  padding: 5px 12px; background: #111827; color: #fff; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
}
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

/* ── FOOTER ── */
.footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; border-top: 1px solid #F3F4F6;
  flex-shrink: 0; background: #fff;
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
  border: none; background: #111827; color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s;
}
.btn-create:hover { background: #1F2937; }

/* ── existing comments / attachments ── */
.sec-list-wrap { padding: 8px 24px 12px; display: flex; flex-direction: column; gap: 10px; }
.sec-comment-row { display: flex; gap: 8px; }
.sec-av { width: 24px; height: 24px; border-radius: 50%; font-size: 9px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sec-comment-body { flex: 1; background: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 6px; padding: 8px 10px; }
.sec-comment-head { display: flex; align-items: baseline; gap: 6px; margin-bottom: 3px; }
.sec-comment-author { font-size: 11.5px; font-weight: 600; color: #111827; }
.sec-comment-time { font-size: 10.5px; color: #9CA3AF; }
.sec-comment-text { font-size: 12px; color: #4B5563; line-height: 1.5; }
.sec-attach-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; }
.sec-attach-row:hover { background: #F9FAFB; }
.sec-attach-icon { width: 24px; height: 24px; border-radius: 4px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sec-attach-name { flex: 1; font-size: 12px; color: #374151; }
.sec-attach-size { font-size: 11px; color: #9CA3AF; flex-shrink: 0; }
</style>
