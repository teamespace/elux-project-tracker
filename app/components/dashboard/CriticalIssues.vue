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
</script>

<template>
  <div>
    <!-- Section header -->
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

    <!-- Kanban grid -->
    <div class="ci-kanban">
      <!-- High column -->
      <div class="ci-kanban-col">
        <div class="ci-kanban-col-header">
          <span class="ci-kanban-col-dot high" />
          <span class="ci-kanban-col-label">High</span>
          <span class="ci-kanban-col-count">{{ highIssues.length }}</span>
        </div>
        <div>
          <div
            v-for="issue in highIssues"
            :key="issue.id"
            class="ci-kanban-item"
            @click="slideOver.openEdit(issue.id)"
          >
            <div class="ci-kanban-title">{{ issue.title }}</div>
            <div class="ci-kanban-footer">
              <span class="ci-kanban-meta">{{ issue.project }} · {{ issue.assignee ?? 'Unassigned' }}</span>
              <span class="ci-alert-status" :class="issue.status">{{ issue.statusLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium column -->
      <div class="ci-kanban-col">
        <div class="ci-kanban-col-header">
          <span class="ci-kanban-col-dot medium" />
          <span class="ci-kanban-col-label">Medium</span>
          <span class="ci-kanban-col-count">{{ mediumIssues.length }}</span>
        </div>
        <div>
          <div
            v-for="issue in mediumIssues"
            :key="issue.id"
            class="ci-kanban-item"
            @click="slideOver.openEdit(issue.id)"
          >
            <div class="ci-kanban-title">{{ issue.title }}</div>
            <div class="ci-kanban-footer">
              <span class="ci-kanban-meta">{{ issue.project }} · {{ issue.assignee ?? 'Unassigned' }}</span>
              <span class="ci-alert-status" :class="issue.status">{{ issue.statusLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
