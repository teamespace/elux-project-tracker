// styled: agent-6
<script setup lang="ts">
import { ref } from 'vue'
import { criticalIssues, type CriticalIssuePriority, type CriticalIssueStatus } from '~/shared/criticalIssues'

const { state, close, setView } = useCriticalIssuesSlideOver()

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const layoutOptions = [
  { value: 'side', label: 'Side peek', icon: 'ph:sidebar' },
  { value: 'center', label: 'Center peek', icon: 'ph:rectangle' },
  { value: 'full', label: 'Full page', icon: 'ph:arrows-out' },
  { value: 'newtab', label: 'New tab', icon: 'ph:arrow-square-out' },
] as const

function setLayout(view: 'side' | 'center' | 'full' | 'newtab') {
  if (view === 'full') {
    close()
    navigateTo('/critical-issues')
    return
  }
  if (view === 'newtab') {
    window.open('/critical-issues', '_blank')
    close()
    return
  }
  setView(view)
  menuOpen.value = false
}

const search = ref('')

const statusOptions: CriticalIssueStatus[] = ['Overdue', 'At Risk', 'Not Started']
const selectedStatuses = ref<CriticalIssueStatus[]>([...statusOptions])

const priorityOptions: CriticalIssuePriority[] = ['High', 'Medium']
const selectedPriorities = ref<CriticalIssuePriority[]>([...priorityOptions])

const statusOpen = ref(false)
const priorityOpen = ref(false)
const statusRef = ref<HTMLElement | null>(null)
const priorityRef = ref<HTMLElement | null>(null)

const filteredIssues = computed(() => {
  const q = search.value.trim().toLowerCase()
  return criticalIssues.filter((issue) => {
    const text = `${issue.title} ${issue.subtitle} ${issue.project} ${issue.assignee}`.toLowerCase()
    const matchesSearch = !q || text.includes(q)
    const matchesStatus = selectedStatuses.value.length === 0 || selectedStatuses.value.includes(issue.status)
    const matchesPriority = selectedPriorities.value.length === 0 || selectedPriorities.value.includes(issue.priority)
    return matchesSearch && matchesStatus && matchesPriority
  })
})

function statusClasses(status: CriticalIssueStatus) {
  switch (status) {
    case 'Overdue': return 'bg-red-100 text-red-600'
    case 'At Risk': return 'bg-amber-100 text-amber-800'
    case 'Not Started': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-500'
  }
}

function priorityClasses(priority: CriticalIssuePriority) {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700'
    case 'Medium': return 'bg-amber-100 text-amber-700'
    default: return 'bg-gray-100 text-gray-500'
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) {
    close()
  }
}

function onDocumentClick(event: MouseEvent) {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
  if (statusOpen.value && statusRef.value && !statusRef.value.contains(event.target as Node)) {
    statusOpen.value = false
  }
  if (priorityOpen.value && priorityRef.value && !priorityRef.value.contains(event.target as Node)) {
    priorityOpen.value = false
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
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-[0.98]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <div
        v-if="state.isOpen"
        :class="[
          state.view === 'center'
            ? 'left-1/2 top-1/2 h-[85vh] w-full max-w-[680px] -translate-x-1/2 -translate-y-1/2'
            : 'bottom-2 right-2 top-2 h-[calc(100vh-16px)] w-full max-w-[640px]',
        ]"
        class="fixed z-50 flex flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Critical Issues"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
          <div ref="menuRef" class="relative flex items-center gap-1">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              square
              icon="ph:arrows-out"
              title="Open full page"
              @click="setLayout('full')"
            />
            <div class="h-4 w-px bg-gray-200" />
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              square
              icon="ph:layout"
              title="Change view"
              @click="menuOpen = !menuOpen"
            />

            <!-- Layout menu -->
            <div
              v-if="menuOpen"
              class="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <button
                v-for="opt in layoutOptions"
                :key="opt.value"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                @click="setLayout(opt.value)"
              >
                <UIcon :name="opt.icon" class="size-4 shrink-0 text-gray-500" />
                <span>{{ opt.label }}</span>
                <UIcon
                  v-if="(opt.value === 'side' || opt.value === 'center') && state.view === opt.value"
                  name="ph:check"
                  class="ml-auto size-4 text-blue-600"
                />
              </button>
            </div>
          </div>

          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            square
            icon="ph:x"
            title="Close"
            @click="close"
          />
        </div>

        <!-- Head -->
        <div class="shrink-0 px-5 pt-5">
          <h2 class="mb-3 text-[17px] font-bold text-gray-900">Critical Issues</h2>

          <!-- Search -->
          <div class="mb-2.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <UIcon name="ph:magnifying-glass" class="size-3.5 shrink-0 text-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Search issues..."
              class="min-w-0 flex-1 bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
            >
          </div>

          <!-- Filter bar -->
          <div class="flex flex-wrap gap-1.5 border-b border-gray-100 pb-3">
            <div ref="statusRef" class="relative">
              <button
                :class="statusOpen ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                @click="statusOpen = !statusOpen"
              >
                Status
                <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="statusOpen ? 'rotate-180' : ''" />
              </button>
              <div
                v-if="statusOpen"
                class="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              >
                <label
                  v-for="s in statusOptions"
                  :key="s"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <input
                    v-model="selectedStatuses"
                    type="checkbox"
                    :value="s"
                    class="size-3.5 shrink-0 accent-blue-600"
                  >
                  <span>{{ s }}</span>
                </label>
              </div>
            </div>

            <div ref="priorityRef" class="relative">
              <button
                :class="priorityOpen ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                @click="priorityOpen = !priorityOpen"
              >
                Priority
                <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="priorityOpen ? 'rotate-180' : ''" />
              </button>
              <div
                v-if="priorityOpen"
                class="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              >
                <label
                  v-for="p in priorityOptions"
                  :key="p"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <input
                    v-model="selectedPriorities"
                    type="checkbox"
                    :value="p"
                    class="size-3.5 shrink-0 accent-blue-600"
                  >
                  <span>{{ p }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400" style="width:80px">Priority</th>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">Issue</th>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400" style="width:140px">Project</th>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400" style="width:110px">Assignee</th>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400" style="width:120px">Status</th>
                <th class="sticky top-0 bg-white px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400" style="width:48px" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="issue in filteredIssues"
                :key="issue.id"
                class="border-b border-gray-100 transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-3 align-middle">
                  <span class="rounded px-2 py-0.5 text-[10px] font-bold tracking-wider" :class="priorityClasses(issue.priority)">
                    {{ issue.priority.toUpperCase() }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <div class="text-[13px] font-medium text-gray-900">{{ issue.title }}</div>
                  <div class="mt-0.5 text-[11.5px] text-gray-400">{{ issue.subtitle }}</div>
                </td>
                <td class="px-4 py-3 align-middle text-[12.5px] text-gray-500">{{ issue.project }}</td>
                <td class="px-4 py-3 align-middle text-[12.5px] text-gray-600">{{ issue.assignee }}</td>
                <td class="px-4 py-3 align-middle">
                  <span class="rounded px-2 py-0.5 text-[11px] font-semibold" :class="statusClasses(issue.status)">
                    {{ issue.status }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <button class="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[12px] font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredIssues.length === 0" class="py-10 text-center text-[13px] text-gray-400">
            No issues match your filters.
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
