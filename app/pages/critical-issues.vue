// styled: agent-7
<script setup lang="ts">
import { issuePriorityOptions, issueStatusOptions, type CriticalIssue } from '~/shared/criticalIssues'

const { data: issuesData } = await useAsyncData('critical-issues', () =>
  $fetch('/api/critical-issues')
)
const criticalIssues = computed(() => issuesData.value ?? [])

interface FilterState {
  open: boolean
  selected: string[]
}

definePageMeta({
  layout: 'default',
  title: 'Critical Issues',
  middleware: 'auth',
})

const search = ref('')
const statusFilter = reactive<FilterState>({ open: false, selected: [...issueStatusOptions] })
const priorityFilter = reactive<FilterState>({ open: false, selected: [...issuePriorityOptions] })

const highCount = computed(() => criticalIssues.filter(i => i.priority === 'High').length)
const overdueCount = computed(() => criticalIssues.filter(i => i.status === 'Overdue').length)

const statusClass = (status: CriticalIssue['status']) => {
  switch (status) {
    case 'Overdue': return 'bg-red-100 text-red-600'
    case 'At Risk': return 'bg-amber-100 text-amber-800'
    case 'Not Started': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-500'
  }
}

const priorityClass = (priority: CriticalIssue['priority']) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800'
    case 'Medium': return 'bg-amber-100 text-amber-800'
    default: return 'bg-gray-100 text-gray-500'
  }
}

const filteredIssues = computed(() => {
  const q = search.value.trim().toLowerCase()
  return criticalIssues.filter((issue) => {
    const text = `${issue.title} ${issue.subtitle} ${issue.project} ${issue.assignee ?? ''}`.toLowerCase()
    const matchesSearch = !q || text.includes(q)
    const matchesStatus = statusFilter.selected.includes(issue.status)
    const matchesPriority = priorityFilter.selected.includes(issue.priority)
    return matchesSearch && matchesStatus && matchesPriority
  })
})

function toggleFilterItem(filter: FilterState, value: string) {
  if (filter.selected.includes(value)) {
    filter.selected = filter.selected.filter(v => v !== value)
  }
  else {
    filter.selected = [...filter.selected, value]
  }
}

function filterLabel(filter: FilterState, fallback: string) {
  if (filter.selected.length === 0) return `${fallback}: None`
  if (filter.selected.length === 1) return `${fallback}: ${filter.selected[0]}`
  return `${fallback}: ${filter.selected.length} selected`
}

function closeFilters() {
  statusFilter.open = false
  priorityFilter.open = false
}

function onWindowClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeFilters()
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-5">
      <div class="mb-1.5 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="size-1.5 rounded-full bg-red-500 shadow-[0_0_0_2.5px_rgba(239,68,68,0.2)]" />
          <h1 class="text-[22px] font-bold text-gray-900">
            Critical Issues
          </h1>
          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[14px] font-medium text-gray-400">
            {{ criticalIssues.length }}
          </span>
        </div>
        <button class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 text-[13px] font-medium text-white hover:bg-gray-800">
          <UIcon name="ph:plus" class="size-3.5" />
          New Issue
        </button>
      </div>
      <div class="flex items-center gap-3 text-[13px] text-gray-400">
        <span>{{ highCount }} High priority</span>
        <span>·</span>
        <span>{{ overdueCount }} Overdue</span>
        <span>·</span>
        <span>Last updated 10m ago</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <div class="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 max-w-xs">
        <UIcon name="ph:magnifying-glass" class="size-3.5 shrink-0 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search issues..."
          class="w-full bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
        >
      </div>

      <div class="relative">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50"
          :class="{ 'border-blue-500 bg-blue-50 text-blue-600': statusFilter.open }"
          @click="statusFilter.open = !statusFilter.open; priorityFilter.open = false"
        >
          {{ filterLabel(statusFilter, 'Status') }}
          <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="{ 'rotate-180': statusFilter.open }" />
        </button>
        <div
          v-if="statusFilter.open"
          class="absolute top-full left-0 z-20 mt-1.5 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <label
            v-for="status in issueStatusOptions"
            :key="status"
            class="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              class="size-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="statusFilter.selected.includes(status)"
              @change="toggleFilterItem(statusFilter, status)"
            >
            {{ status }}
          </label>
        </div>
      </div>

      <div class="relative">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50"
          :class="{ 'border-blue-500 bg-blue-50 text-blue-600': priorityFilter.open }"
          @click="priorityFilter.open = !priorityFilter.open; statusFilter.open = false"
        >
          {{ filterLabel(priorityFilter, 'Priority') }}
          <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="{ 'rotate-180': priorityFilter.open }" />
        </button>
        <div
          v-if="priorityFilter.open"
          class="absolute top-full left-0 z-20 mt-1.5 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <label
            v-for="priority in issuePriorityOptions"
            :key="priority"
            class="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              class="size-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="priorityFilter.selected.includes(priority)"
              @change="toggleFilterItem(priorityFilter, priority)"
            >
            {{ priority }}
          </label>
        </div>
      </div>
    </div>

    <!-- Table card -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white" @click="closeFilters">
      <table class="w-full border-collapse text-[13px]">
        <thead>
          <tr class="border-b border-gray-200 text-left text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">
            <th class="w-[90px] px-4 py-2.5">
              Priority
            </th>
            <th class="px-4 py-2.5">
              Issue
            </th>
            <th class="w-[160px] px-4 py-2.5">
              Project
            </th>
            <th class="w-[130px] px-4 py-2.5">
              Assignee
            </th>
            <th class="w-[130px] px-4 py-2.5">
              Status
            </th>
            <th class="w-[60px] px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="issue in filteredIssues"
            :key="issue.id"
            class="border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
          >
            <td class="px-4 py-3">
              <span class="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide" :class="priorityClass(issue.priority)">
                {{ issue.priorityLabel }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="font-medium text-gray-900">
                {{ issue.title }}
              </div>
              <div class="mt-0.5 text-[11.5px] text-gray-400">
                {{ issue.subtitle }}
              </div>
            </td>
            <td class="px-4 py-3 text-[13px] text-gray-500">
              {{ issue.project }}
            </td>
            <td class="px-4 py-3 text-[13px]" :class="issue.assignee === 'Unassigned' ? 'text-gray-400' : 'text-gray-600'">
              {{ issue.assignee }}
            </td>
            <td class="px-4 py-3">
              <span class="rounded px-2 py-0.5 text-[11px] font-semibold" :class="statusClass(issue.status)">
                {{ issue.statusLabel }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button class="rounded-md border border-gray-200 bg-white px-2 py-1 text-[12px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-900">
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredIssues.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-[13px] text-gray-500">
              No issues match the selected filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
