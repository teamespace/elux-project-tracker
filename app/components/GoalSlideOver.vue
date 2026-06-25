<script setup lang="ts">
import { useGoalSlideOver } from '~/composables/useGoalSlideOver'
import { addGoal, goalById, statusClasses, statusOptions, type Goal, type Label, type Status } from '~/shared/goals'
import { findPerson, people } from '~/shared/projects'

const { state, close } = useGoalSlideOver()

const view = ref<'side' | 'center'>('side')
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const layoutOptions = [
  { value: 'side', label: 'Side peek', icon: 'ph:sidebar' },
  { value: 'center', label: 'Center peek', icon: 'ph:rectangle' },
] as const

function setView(next: 'side' | 'center') {
  view.value = next
  menuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) close()
}

function onDocumentClick(event: MouseEvent) {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onDocumentClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onDocumentClick)
})

/* ── EDIT FORM (keep existing logic for edit mode) ── */
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
  return { title: '', description: '', ownerName: defaultOwner, quarter: 'Q3 2026', dueDate: '', status: 'not-started', progress: 0, labels: '' }
}

const form = ref<Draft>(createDraft())

function loadDraftFromGoal(goal: Goal): Draft {
  return {
    title: goal.title, description: goal.description, ownerName: goal.owner.name,
    quarter: goal.quarter, dueDate: goal.dueDate, status: goal.status,
    progress: goal.progress, labels: goal.labels.map(l => l.name).join(', '),
  }
}

watch(() => state.value.isOpen, (isOpen) => {
  if (!isOpen) return
  if (state.value.mode === 'edit' && state.value.goalId) {
    const goal = goalById(state.value.goalId)
    form.value = goal ? loadDraftFromGoal(goal) : createDraft()
  } else {
    form.value = createDraft()
  }
}, { immediate: true })

const ownerOptions = people.map(p => ({ label: p.name, value: p.name }))
const quarterOptions = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map(v => ({ label: v, value: v }))

function statusLabelFor(s: Status): string {
  return statusOptions.find(o => o.value === s)?.label.toUpperCase() ?? 'NOT STARTED'
}

function save() {
  const title = form.value.title.trim()
  if (!title) return
  const owner = findPerson(form.value.ownerName) ?? people[0] ?? { initials: 'R', name: 'Rasya' }
  const labels: Label[] = form.value.labels.split(',').map(l => l.trim()).filter(Boolean)
    .map((name, i) => ({ id: `lbl-${i}`, name, color: 'bg-blue-50 text-blue-600 border-blue-200' }))
  const progress = Math.min(100, Math.max(0, Number(form.value.progress) || 0))
  const common = { title, description: form.value.description, owner, quarter: form.value.quarter, dueDate: form.value.dueDate, status: form.value.status, statusLabel: statusLabelFor(form.value.status), progress, labels }

  if (state.value.mode === 'edit' && state.value.goalId) {
    const existing = goalById(state.value.goalId)
    if (existing) Object.assign(existing, common)
  } else {
    addGoal({ id: `goal-${Date.now()}`, ...common, kpis: [], linkedProjects: [], activity: [{ id: `act-${Date.now()}`, actor: owner, action: 'created goal', target: title, time: 'Just now' }] })
  }
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="state.isOpen" class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" @click.self="close" />
    </Transition>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-[0.98]" enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-[0.98]">
      <div
        v-if="state.isOpen"
        :class="[
          view === 'center'
            ? 'left-1/2 top-1/2 h-[85vh] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2'
            : 'bottom-2 right-2 top-2 h-[calc(100vh-16px)] w-full max-w-[600px]',
        ]"
        class="fixed z-50 flex flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
          <div ref="menuRef" class="relative flex items-center gap-1">
            <UButton variant="ghost" color="neutral" size="xs" square icon="ph:arrows-out" title="Expand to center" @click="setView('center')" />
            <div class="h-4 w-px bg-gray-200" />
            <UButton variant="ghost" color="neutral" size="xs" square icon="ph:layout" title="Change view" @click="menuOpen = !menuOpen" />
            <div v-if="menuOpen" class="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <button
                v-for="opt in layoutOptions" :key="opt.value"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                @click="setView(opt.value)"
              >
                <UIcon :name="opt.icon" class="size-4 shrink-0 text-gray-500" />
                <span>{{ opt.label }}</span>
                <UIcon v-if="view === opt.value" name="ph:check" class="ml-auto size-4 text-blue-600" />
              </button>
            </div>
          </div>
          <UButton variant="ghost" color="neutral" size="xs" square icon="ph:x" title="Close" @click="close" />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-hidden">
          <!-- CREATE mode → new component -->
          <GoalCreateContent v-if="state.mode === 'create'" @close="close" />

          <!-- EDIT mode → existing inline form -->
          <div v-else class="flex h-full flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-6">
              <div class="flex flex-col gap-5">
                <div>
                  <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Title</label>
                  <UInput v-model="form.title" placeholder="Enter goal title" required />
                </div>
                <div>
                  <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Description</label>
                  <UTextarea v-model="form.description" :rows="4" placeholder="Add a description..." />
                </div>
                <div class="grid grid-cols-2 gap-5">
                  <div>
                    <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Owner</label>
                    <USelect v-model="form.ownerName" :items="ownerOptions" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Quarter</label>
                    <USelect v-model="form.quarter" :items="quarterOptions" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Due date</label>
                    <UInput v-model="form.dueDate" type="date" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Status</label>
                    <USelect v-model="form.status" :items="statusOptions" />
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
              </div>
            </div>
            <div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-3">
              <UButton variant="ghost" color="neutral" @click="close">Cancel</UButton>
              <UButton color="primary" @click="save">Save</UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
