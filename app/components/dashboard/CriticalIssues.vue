// styled: agent-4
<script setup lang="ts">
interface CriticalIssue {
  id: string
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  riskLabel: string
  title: string
  project: string
  assignee: string | null
  status: 'overdue' | 'at-risk' | 'not-started' | 'done'
  statusLabel: string
}

const props = defineProps<{
  issues: CriticalIssue[]
}>()

const slideOver = useTaskSlideOver()
const ciSlideOver = useCriticalIssuesSlideOver()

const highIssues = computed(() => props.issues.filter(i => i.riskLevel === 'HIGH'))
const mediumIssues = computed(() => props.issues.filter(i => i.riskLevel !== 'HIGH'))

const statusClass = (status: CriticalIssue['status']) => {
  switch (status) {
    case 'overdue': return 'bg-red-100 text-red-600'
    case 'at-risk': return 'bg-amber-100 text-amber-800'
    case 'not-started': return 'bg-gray-100 text-gray-500'
    case 'done': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-500'
  }
}
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-red-500 shadow-[0_0_0_2.5px_rgba(239,68,68,0.2)]" />
        <span class="text-[12px] font-semibold uppercase tracking-wide text-gray-500">Critical Issues</span>
        <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-500">{{ props.issues.length }}</span>
      </div>
      <button class="text-[12px] text-gray-400 transition-colors hover:text-gray-700" @click="ciSlideOver.open()">
        View all
      </button>
    </div>

    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <!-- High -->
      <div class="rounded-[10px] border border-gray-200 bg-white overflow-hidden">
        <div class="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-3 py-[7px]">
          <span class="size-2 rounded-full bg-red-500" />
          <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">High</span>
          <span class="ml-0.5 rounded-full bg-gray-200 px-1.5 text-[11px] font-semibold text-gray-400">{{ highIssues.length }}</span>
        </div>
        <div class="flex flex-col">
          <div
            v-for="issue in highIssues"
            :key="issue.id"
            class="group flex cursor-pointer flex-col gap-1.5 border-b border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 last:border-b-0"
            @click="slideOver.openEdit(issue.id)"
          >
            <p class="text-[12.5px] font-medium leading-snug text-gray-900">{{ issue.title }}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] text-gray-400">{{ issue.project }} · {{ issue.assignee ?? 'Unassigned' }}</span>
              <span class="shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold" :class="statusClass(issue.status)">
                {{ issue.statusLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium -->
      <div class="rounded-[10px] border border-gray-200 bg-white overflow-hidden">
        <div class="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-3 py-[7px]">
          <span class="size-2 rounded-full bg-amber-500" />
          <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Medium</span>
          <span class="ml-0.5 rounded-full bg-gray-200 px-1.5 text-[11px] font-semibold text-gray-400">{{ mediumIssues.length }}</span>
        </div>
        <div class="flex flex-col">
          <div
            v-for="issue in mediumIssues"
            :key="issue.id"
            class="group flex cursor-pointer flex-col gap-1.5 border-b border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 last:border-b-0"
            @click="slideOver.openEdit(issue.id)"
          >
            <p class="text-[12.5px] font-medium leading-snug text-gray-900">{{ issue.title }}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] text-gray-400">{{ issue.project }} · {{ issue.assignee ?? 'Unassigned' }}</span>
              <span class="shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold" :class="statusClass(issue.status)">
                {{ issue.statusLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
