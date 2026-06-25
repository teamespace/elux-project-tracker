<script setup lang="ts">
import { addGoal, statusOptions, type Status } from '~/shared/goals'
import { people, findPerson, avatarColor } from '~/shared/projects'

const emit = defineEmits<{ close: [] }>()

const form = reactive({
  title: '',
  status: 'not-started' as Status,
  owner: people[0]?.name ?? '',
  quarter: 'Q3 2026',
  dueDate: '',
  progress: 0,
  description: '',
  labels: '',
})

const kpis = reactive<{ id: string; name: string; current: string; target: string }[]>([])
const linkedProjects = reactive<{ id: string; name: string }[]>([])

const showAddKpi = ref(false)
const newKpi = reactive({ name: '', current: '', target: '' })

const openDd = ref<string | null>(null)
function toggleDd(field: string, e: MouseEvent) {
  e.stopPropagation()
  openDd.value = openDd.value === field ? null : field
}
function closeDds() { openDd.value = null }
onMounted(() => document.addEventListener('click', closeDds))
onUnmounted(() => document.removeEventListener('click', closeDds))

const statusOpt = computed(() => statusOptions.find(o => o.value === form.status))
const ownerPerson = computed(() => findPerson(form.owner) ?? people[0])

const statusDotColor: Record<Status, string> = {
  'not-started': '#9CA3AF',
  'on-track':    '#22C55E',
  'at-risk':     '#F59E0B',
  'delayed':     '#EF4444',
}
const statusChipClass: Record<Status, string> = {
  'not-started': 'chip-ns',
  'on-track':    'chip-track',
  'at-risk':     'chip-risk',
  'delayed':     'chip-delayed',
}

const quarterOptions = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027']

function addKpi() {
  if (!newKpi.name.trim()) return
  kpis.push({ id: `kpi-${Date.now()}`, name: newKpi.name, current: newKpi.current, target: newKpi.target })
  newKpi.name = ''; newKpi.current = ''; newKpi.target = ''
  showAddKpi.value = false
}

function submit() {
  const title = form.title.trim()
  if (!title) return
  const owner = findPerson(form.owner) ?? people[0] ?? { initials: 'R', name: 'Rasya' }
  const labels = form.labels.split(',').map(l => l.trim()).filter(Boolean)
    .map((name, i) => ({ id: `lbl-${i}`, name, color: 'bg-blue-50 text-blue-600 border-blue-200' }))

  addGoal({
    id: `goal-${Date.now()}`,
    title,
    description: form.description,
    owner,
    quarter: form.quarter,
    dueDate: form.dueDate,
    status: form.status,
    statusLabel: statusOpt.value?.label ?? 'Not started',
    progress: Math.min(100, Math.max(0, form.progress)),
    labels,
    kpis: kpis.map(k => ({
      id: k.id, name: k.name, current: k.current, target: k.target,
      progress: 0, status: 'not-started' as Status, statusLabel: 'Not started',
      owner, dueDate: '',
    })),
    linkedProjects: [],
    activity: [{ id: `act-${Date.now()}`, actor: owner, action: 'created goal', target: title, time: 'Just now' }],
  })
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
          placeholder="Untitled goal"
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
                <span class="chip-dd-dot" :style="{ background: statusDotColor[opt.value] }" />
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PROPERTIES (single-column rows) -->
      <div class="sec-hdr">Properties</div>
      <div class="prop-rows">

        <!-- Owner -->
        <div class="pr" @click.stop="toggleDd('owner', $event)">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Owner
          </div>
          <div class="pr-val">
            <img v-if="ownerPerson?.avatar" :src="ownerPerson.avatar" class="pr-av" :alt="ownerPerson.name">
            <span v-else class="pr-av-init" :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))">{{ ownerPerson?.initials }}</span>
            {{ ownerPerson?.name ?? 'Unassigned' }}
          </div>
          <div v-if="openDd === 'owner'" class="pr-dd" @click.stop>
            <button v-for="p in people" :key="p.name" class="pr-dd-item" @click="form.owner = p.name; closeDds()">
              <img v-if="p.avatar" :src="p.avatar" class="pr-av" :alt="p.name">
              <span v-else class="pr-av-init" :class="avatarColor(people.findIndex(pp => pp.name === p.name))">{{ p.initials }}</span>
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- Quarter -->
        <div class="pr" @click.stop="toggleDd('quarter', $event)">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Quarter
          </div>
          <div class="pr-val">{{ form.quarter }}</div>
          <div v-if="openDd === 'quarter'" class="pr-dd" @click.stop>
            <button v-for="q in quarterOptions" :key="q" class="pr-dd-item" @click="form.quarter = q; closeDds()">{{ q }}</button>
          </div>
        </div>

        <!-- Due Date -->
        <div class="pr">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            Due Date
          </div>
          <div class="pr-val">
            <input v-model="form.dueDate" type="date" class="pr-date">
          </div>
        </div>

        <!-- Status -->
        <div class="pr" @click.stop="toggleDd('status-row', $event)">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
            Status
          </div>
          <div class="pr-val">
            <span class="pr-dot" :style="{ background: statusDotColor[form.status] }" />
            {{ statusOpt?.label }}
          </div>
          <div v-if="openDd === 'status-row'" class="pr-dd" @click.stop>
            <button v-for="opt in statusOptions" :key="opt.value" class="pr-dd-item" @click="form.status = opt.value; closeDds()">
              <span class="pr-dot" :style="{ background: statusDotColor[opt.value] }" />{{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Progress -->
        <div class="pr pr-progress">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h18M3 6h12M3 18h6"/></svg>
            Progress
          </div>
          <div class="pr-val prog-val">
            <div class="prog-track">
              <div class="prog-fill" :style="{ width: form.progress + '%' }" />
            </div>
            <input v-model.number="form.progress" type="number" min="0" max="100" class="prog-input" @click.stop>
            <span class="prog-pct">%</span>
          </div>
        </div>

        <!-- Labels -->
        <div class="pr">
          <div class="pr-lbl">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>
            Labels
          </div>
          <div class="pr-val">
            <input v-model="form.labels" class="pr-text" placeholder="Product, Q3, …" @click.stop>
          </div>
        </div>

      </div>

      <!-- KPIs -->
      <div class="sec-hdr">KPIs</div>
      <div class="kpi-wrap">
        <div v-for="k in kpis" :key="k.id" class="kpi-row">
          <span class="kpi-name">{{ k.name }}</span>
          <span class="kpi-meta">{{ k.current }} / {{ k.target }}</span>
          <button class="kpi-del" @click="kpis.splice(kpis.indexOf(k), 1)">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div v-if="showAddKpi" class="kpi-add-form" @click.stop>
          <input v-model="newKpi.name" class="kpi-input" placeholder="KPI name" autofocus @keydown.escape="showAddKpi = false">
          <div class="kpi-metrics">
            <input v-model="newKpi.current" class="kpi-input kpi-metric" placeholder="Current">
            <span class="kpi-sep">/</span>
            <input v-model="newKpi.target" class="kpi-input kpi-metric" placeholder="Target" @keydown.enter="addKpi">
          </div>
          <div class="kpi-form-actions">
            <button class="kpi-add-btn" @click="addKpi">Add</button>
            <button class="kpi-cancel-btn" @click="showAddKpi = false">Cancel</button>
          </div>
        </div>
        <button v-else class="add-item-btn" @click="showAddKpi = true">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add KPI
        </button>
      </div>

      <!-- LINKED PROJECTS -->
      <div class="sec-hdr">Linked Projects</div>
      <div class="kpi-wrap">
        <div v-for="p in linkedProjects" :key="p.id" class="kpi-row">
          <span class="kpi-name">{{ p.name }}</span>
          <button class="kpi-del" @click="linkedProjects.splice(linkedProjects.indexOf(p), 1)">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
        </div>
        <button class="add-item-btn" @click="linkedProjects.push({ id: `lp-${Date.now()}`, name: 'New project' })">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Link project
        </button>
      </div>

      <!-- DESCRIPTION -->
      <div class="sec-hdr">Description</div>
      <div class="desc-wrap">
        <textarea
          v-model="form.description"
          class="desc-input"
          rows="3"
          placeholder="Add a description…"
          @input="($event.target as HTMLTextAreaElement).style.height = 'auto'; ($event.target as HTMLTextAreaElement).style.height = ($event.target as HTMLTextAreaElement).scrollHeight + 'px'"
        />
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <button class="icon-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
      </div>
      <div class="footer-right">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn-create" @click="submit">Create goal</button>
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
.chip-ns      { background: #F9FAFB; color: #6B7280; border-color: #E5E7EB; }
.chip-track   { background: #F0FDF4; color: #166534; border-color: #BBF7D0; }
.chip-risk    { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
.chip-delayed { background: #FEF2F2; color: #991B1B; border-color: #FECACA; }
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

/* ── SEC HEADER ── */
.sec-hdr {
  padding: 12px 24px 8px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; color: #9CA3AF;
  border-top: 1px solid #F3F4F6; border-bottom: 1px solid #F9FAFB;
}

/* ── PROP ROWS (single column) ── */
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
.pr-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
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

/* progress row */
.pr-progress { align-items: center; }
.prog-val { flex: 1; display: flex; align-items: center; gap: 8px; }
.prog-track { flex: 1; height: 5px; background: #F3F4F6; border-radius: 3px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 3px; background: oklch(60.6% 0.25 292.717); transition: width .3s; }
.prog-input {
  width: 44px; border: 1px solid #E5E7EB; border-radius: 6px;
  padding: 3px 6px; font-size: 12px; text-align: center;
  font-family: inherit; color: #111827; outline: none;
}
.prog-input:focus { border-color: oklch(60.6% 0.25 292.717); }
.prog-pct { font-size: 12px; color: #9CA3AF; }

/* ── KPIs / linked ── */
.kpi-wrap { padding: 8px 24px 12px; }
.kpi-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0; border-bottom: 1px solid #F9FAFB;
}
.kpi-name { flex: 1; font-size: 13px; color: #374151; }
.kpi-meta { font-size: 12px; color: #9CA3AF; }
.kpi-del {
  display: none; width: 18px; height: 18px; align-items: center; justify-content: center;
  border-radius: 50%; border: none; background: transparent; color: #9CA3AF; cursor: pointer; padding: 0;
}
.kpi-row:hover .kpi-del { display: flex; }
.kpi-del:hover { color: #EF4444; }
.kpi-add-form { padding: 8px 0; display: flex; flex-direction: column; gap: 6px; }
.kpi-input {
  width: 100%; border: 1px solid #E5E7EB; border-radius: 6px;
  padding: 5px 10px; font-size: 13px; outline: none; font-family: inherit;
}
.kpi-input:focus { border-color: oklch(60.6% 0.25 292.717); }
.kpi-metrics { display: flex; align-items: center; gap: 6px; }
.kpi-metric { flex: 1; }
.kpi-sep { color: #9CA3AF; font-size: 14px; }
.kpi-form-actions { display: flex; gap: 6px; }
.kpi-add-btn {
  padding: 4px 12px; background: oklch(60.6% 0.25 292.717); color: #fff; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.kpi-add-btn:hover { background: oklch(52% 0.27 292.717); }
.kpi-cancel-btn {
  padding: 4px 10px; background: #F3F4F6; color: #4B5563; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.add-item-btn {
  display: flex; align-items: center; gap: 7px; width: 100%;
  padding: 8px 10px; border-radius: 8px; border: 1px dashed #E5E7EB;
  background: transparent; color: #9CA3AF; font-size: 12.5px;
  cursor: pointer; font-family: inherit; margin-top: 4px; transition: all .1s;
}
.add-item-btn:hover { border-color: #D1D5DB; color: #6B7280; background: #F9FAFB; }

/* ── DESCRIPTION ── */
.desc-wrap { padding: 8px 24px 16px; }
.desc-input {
  width: 100%; border: none; outline: none; resize: none;
  font-size: 13.5px; line-height: 1.7; color: #374151;
  font-family: inherit; background: transparent; min-height: 72px;
}
.desc-input::placeholder { color: #D1D5DB; }

/* ── FOOTER ── */
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
  border: none; background: oklch(60.6% 0.25 292.717); color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s;
}
.btn-create:hover { background: oklch(52% 0.27 292.717); }
</style>
