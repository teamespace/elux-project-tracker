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

const displayedIssues = computed(() => props.issues.slice(0, 5))

const onRowClick = (issue: CriticalIssue) => {
  slideOver.openEdit(issue.id)
}

const riskClass = (level: CriticalIssue['riskLevel']) => {
  switch (level) {
    case 'HIGH':
      return 'text-red-700 bg-red-50 border-red-200'
    case 'MEDIUM':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'LOW':
      return 'text-green-700 bg-green-50 border-green-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

const issueStatusClass = (status: CriticalIssue['status']) => {
  switch (status) {
    case 'overdue':
      return 'text-red-700 bg-red-50 border-red-200'
    case 'at-risk':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'not-started':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'done':
      return 'text-blue-700 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
</script>

<template>
  <div class="w-full rounded-xl border border-gray-200 bg-white">
    <div class="flex items-center justify-between px-5 py-4">
      <div class="flex items-center gap-2.5">
        <span class="size-2 rounded-full bg-red-500" />
        <h3 class="text-base font-semibold text-gray-900">Critical Issues</h3>
        <span class="inline-flex size-5 items-center justify-center rounded-full bg-red-100 text-[11px] font-semibold text-red-700">
          {{ props.issues.length }}
        </span>
      </div>

      <NuxtLink
        to="/board"
        class="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        View all issues &rarr;
      </NuxtLink>
    </div>

    <div class="flex flex-col px-5 pb-5">
      <div
        v-if="displayedIssues.length === 0"
        class="flex items-center justify-center py-8"
      >
        <p class="text-[13px] text-gray-500">No critical issues</p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="(issue, index) in displayedIssues"
          :key="issue.id"
          :class="[
            'flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-gray-50',
            index !== 0 ? 'border-t border-gray-100' : '',
          ]"
          @click="onRowClick(issue)"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <span
              :class="[
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                riskClass(issue.riskLevel),
              ]"
            >
              <span class="size-1.5 rounded-full bg-current" />
              {{ issue.riskLabel }}
            </span>
            <p class="truncate text-[13px] font-medium text-gray-900">
              {{ issue.title }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-3">
            <div class="flex items-center gap-1.5 text-[12px] text-gray-500">
              <span class="truncate">{{ issue.project }}</span>
              <span class="shrink-0">·</span>
              <span class="truncate">
                {{ issue.assignee ?? 'Unassigned' }}
              </span>
            </div>
            <span
              :class="[
                'inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                issueStatusClass(issue.status),
              ]"
            >
              {{ issue.statusLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
