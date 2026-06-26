<script setup lang="ts">
const { data: peopleData } = await useAsyncData('kpi-people', () =>
  $fetch('/api/people')
)
const people = computed(() => peopleData.value ?? [])

function findPerson(name: string) {
  return people.value.find((p: any) => p.name === name)
}

function avatarColor(index: number) {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600', 'bg-indigo-600']
  return colors[Math.abs(index) % colors.length]
}

export interface KpiPayload {
  name: string
  current: number
  target: number
  unit: string
  dueDate: string
  owner: { name: string; initials: string; bg: string; color: string }
  status: string
  statusClass: string
  statusLabel: string
}

const emit = defineEmits<{
  submit: [payload: KpiPayload]
  close: []
}>()

const form = reactive({
  name: '',
  current: 0,
  target: 0,
  unit: '',
  dueDate: '',
  owner: '',
})

if (people.value.length > 0) {
  form.owner = people.value[0].name
}

const ownerPerson = computed(() => findPerson(form.owner) ?? people.value[0])

function submit() {
  const name = form.name.trim()
  if (!name || form.target <= 0) return
  const person = ownerPerson.value ?? { name: 'Rasya', initials: 'RA' }
  emit('submit', {
    name,
    current: Number(form.current) || 0,
    target: Number(form.target) || 0,
    unit: form.unit.trim(),
    dueDate: form.dueDate.trim(),
    owner: { name: person.name, initials: person.initials, bg: '#DBEAFE', color: '#2563EB' },
    status: 'not-started',
    statusClass: 'gs-new',
    statusLabel: 'Not started',
  })
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto px-6 py-5">
      <div class="mb-5 text-lg font-semibold text-gray-900">Add KPI</div>

      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-gray-500">KPI name</label>
          <input v-model="form.name" class="kpi-input" placeholder="e.g. Monthly shots published">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-500">Current</label>
            <input v-model.number="form.current" type="number" class="kpi-input" placeholder="0">
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-500">Target</label>
            <input v-model.number="form.target" type="number" class="kpi-input" placeholder="0">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-500">Unit</label>
            <input v-model="form.unit" class="kpi-input" placeholder="e.g. shots">
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-medium text-gray-500">Due date</label>
            <input v-model="form.dueDate" class="kpi-input" placeholder="e.g. Dec 2026">
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-xs font-medium text-gray-500">Owner</label>
          <div class="kpi-owner-row">
            <img v-if="ownerPerson?.avatar" :src="ownerPerson.avatar" class="kpi-av" :alt="ownerPerson.name">
            <span v-else class="kpi-av-init" :class="avatarColor(people.findIndex(p => p.name === ownerPerson?.name))">{{ ownerPerson?.initials }}</span>
            <select v-model="form.owner" class="kpi-select">
              <option v-for="p in people" :key="p.name" :value="p.name">{{ p.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
      <button class="kpi-btn-ghost" @click="$emit('close')">Cancel</button>
      <button class="kpi-btn-primary" :disabled="!form.name.trim() || form.target <= 0" @click="submit">Add KPI</button>
    </div>
  </div>
</template>

<style scoped>
.kpi-input {
  width: 100%; border: 1px solid #E5E7EB; border-radius: 8px;
  padding: 8px 12px; font-size: 13px; color: #111827; outline: none; font-family: inherit;
}
.kpi-input:focus { border-color: oklch(60.6% 0.25 292.717); }
.kpi-input::placeholder { color: #D1D5DB; }
.kpi-owner-row { display: flex; align-items: center; gap: 8px; }
.kpi-av { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; }
.kpi-av-init {
  width: 22px; height: 22px; border-radius: 50%; font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.kpi-select {
  flex: 1; border: 1px solid #E5E7EB; border-radius: 8px;
  padding: 8px 12px; font-size: 13px; color: #111827; outline: none; font-family: inherit; background: #fff;
}
.kpi-select:focus { border-color: oklch(60.6% 0.25 292.717); }
.kpi-btn-ghost {
  height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid #E5E7EB; background: #fff; color: #4B5563;
  font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit;
}
.kpi-btn-ghost:hover { background: #F9FAFB; }
.kpi-btn-primary {
  height: 34px; padding: 0 16px; border-radius: 8px;
  border: none; background: oklch(60.6% 0.25 292.717); color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background .15s;
}
.kpi-btn-primary:hover { background: oklch(52% 0.27 292.717); }
.kpi-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
</style>
