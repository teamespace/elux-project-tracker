<script setup lang="ts">
import { useGoalSlideOver } from '~/composables/useGoalSlideOver'
import { addGoal, goalById, progressBarColor, statusClasses, statusOptions, type Goal, type Label, type Status } from '~/shared/goals'
import { findPerson, people } from '~/shared/projects'

const { state, close } = useGoalSlideOver()

const open = computed({
  get: () => state.value.isOpen,
  set: (value) => {
    if (!value) close()
  },
})

interface Draft {
  title: string
  description: string
  ownerName: string
  quarter: string
  dueDate: string
  status: Status
  progress: number
  labels: string
}

const defaultOwner = people[0]?.name ?? ''

function createDraft(): Draft {
  return {
    title: '',
    description: '',
    ownerName: defaultOwner,
    quarter: 'Q3 2026',
    dueDate: '',
    status: 'not-started',
    progress: 0,
    labels: '',
  }
}

const form = ref<Draft>(createDraft())

function loadDraftFromGoal(goal: Goal): Draft {
  return {
    title: goal.title,
    description: goal.description,
    ownerName: goal.owner.name,
    quarter: goal.quarter,
    dueDate: goal.dueDate,
    status: goal.status,
    progress: goal.progress,
    labels: goal.labels.map(label => label.name).join(', '),
  }
}

watch(() => state.value.isOpen, (isOpen) => {
  if (!isOpen) return

  if (state.value.mode === 'edit' && state.value.goalId) {
    const goal = goalById(state.value.goalId)
    form.value = goal ? loadDraftFromGoal(goal) : createDraft()
  }
  else {
    form.value = createDraft()
  }
}, { immediate: true })

const ownerOptions = people.map(person => ({ label: person.name, value: person.name }))

const quarterOptions = [
  { label: 'Q1 2026', value: 'Q1 2026' },
  { label: 'Q2 2026', value: 'Q2 2026' },
  { label: 'Q3 2026', value: 'Q3 2026' },
  { label: 'Q4 2026', value: 'Q4 2026' },
]

function parseLabels(input: string): Label[] {
  return input
    .split(',')
    .map(name => name.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: `label-${Date.now()}-${index}`,
      name,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    }))
}

function statusLabelFor(status: Status): string {
  return statusOptions.find(option => option.value === status)?.label.toUpperCase() ?? 'NOT STARTED'
}

function save() {
  const title = form.value.title.trim()
  if (!title) return

  const owner = findPerson(form.value.ownerName) ?? people[0] ?? { initials: 'R', name: 'Rasya' }
  const labels = parseLabels(form.value.labels)
  const progress = Math.min(100, Math.max(0, Number(form.value.progress) || 0))

  const common = {
    title,
    description: form.value.description,
    owner,
    quarter: form.value.quarter,
    dueDate: form.value.dueDate,
    status: form.value.status,
    statusLabel: statusLabelFor(form.value.status),
    progress,
    labels,
  }

  if (state.value.mode === 'edit' && state.value.goalId) {
    const existing = goalById(state.value.goalId)
    if (existing) {
      Object.assign(existing, common)
    }
  }
  else {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...common,
      kpis: [],
      linkedProjects: [],
      activity: [
        { id: `activity-${Date.now()}`, actor: owner, action: 'created goal', target: title, time: 'Just now' },
      ],
    }
    addGoal(newGoal)
  }

  close()
}
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :overlay="true"
    class="max-w-[720px]"
  >
    <template #title>
      {{ state.mode === 'create' ? 'Create goal' : 'Edit goal' }}
    </template>

    <template #body>
      <div class="flex flex-col gap-5">
        <div>
          <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Title</label>
          <UInput v-model="form.title" placeholder="Enter goal title" required />
        </div>

        <div>
          <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Description</label>
          <UTextarea v-model="form.description" :rows="4" placeholder="Add a description..." />
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Owner</label>
            <USelect v-model="form.ownerName" :items="ownerOptions" placeholder="Select owner" />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Quarter</label>
            <USelect v-model="form.quarter" :items="quarterOptions" placeholder="Select quarter" />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Due date</label>
            <UInput v-model="form.dueDate" type="date" />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Status</label>
            <USelect v-model="form.status" :items="statusOptions" placeholder="Select status" />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Progress</label>
            <UInput v-model.number="form.progress" type="number" min="0" max="100" placeholder="0-100" />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Labels</label>
            <UInput v-model="form.labels" placeholder="Product, Q3" />
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Preview</label>
          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <h3 class="text-[15px] font-semibold text-gray-900">
                  {{ form.title || 'Untitled goal' }}
                </h3>
                <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                  <span class="inline-flex items-center gap-1.5">
                    <UAvatar
                      :src="(findPerson(form.ownerName) ?? people[0] ?? { avatar: undefined }).avatar"
                      :text="(findPerson(form.ownerName) ?? people[0] ?? { initials: 'R' }).initials"
                      size="xs"
                    />
                    {{ form.ownerName }}
                  </span>
                  <span>{{ form.quarter }}</span>
                  <span v-if="form.dueDate" class="text-gray-400">·</span>
                  <span v-if="form.dueDate">Due {{ form.dueDate }}</span>
                </div>
              </div>
              <span
                class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                :class="statusClasses(form.status)"
              >
                {{ statusLabelFor(form.status) }}
              </span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <div class="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="progressBarColor(form.progress)"
                  :style="{ width: `${Math.min(100, Math.max(0, form.progress))}%` }"
                />
              </div>
              <span class="w-10 text-right text-[11px] tabular-nums text-gray-500">{{ Math.min(100, Math.max(0, form.progress)) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" color="neutral" @click="close">
          Cancel
        </UButton>
        <UButton color="primary" @click="save">
          Save
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
