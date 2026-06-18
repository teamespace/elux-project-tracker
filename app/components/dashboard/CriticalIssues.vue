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

const onGo = (issue: CriticalIssue) => {
  slideOver.openEdit(issue.id)
}

const riskClass = (level: CriticalIssue['riskLevel']) => {
  switch (level) {
    case 'HIGH':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'MEDIUM':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const issueStatusClass = (status: CriticalIssue['status']) => {
  switch (status) {
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'at-risk':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'not-started':
      return 'text-gray-500 bg-gray-50 border-gray-200'
    case 'done':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200'
  }
}
</script>

<template>
  <div class="flex flex-col rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
      <h3 class="text-[16px] font-semibold text-gray-900">Critical Issues</h3>
      <NuxtLink
        to="/board"
        class="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        View all issues
      </NuxtLink>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <div
        v-if="displayedIssues.length === 0"
        class="flex flex-1 items-center justify-center"
      >
        <p class="text-[13px] text-gray-500">No critical issues</p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="(issue, index) in displayedIssues"
          :key="issue.id"
          :class="[
            'flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0',
            index !== displayedIssues.length - 1 ? 'border-b border-gray-100' : '',
          ]"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
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
            <div class="mt-1 flex items-center gap-2 text-[12px] text-gray-500">
              <span class="truncate">{{ issue.project }}</span>
              <span class="shrink-0">•</span>
              <span class="truncate">
                {{ issue.assignee ? `Assigned to ${issue.assignee}` : 'Unassigned' }}
              </span>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-3">
            <span
              :class="[
                'rounded-full border px-2 py-0.5 text-[11px] font-medium',
                issueStatusClass(issue.status),
              ]"
            >
              {{ issue.statusLabel }}
            </span>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700"
              @click="onGo(issue)"
            >
              Go
              <UIcon name="ph:caret-right" class="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
