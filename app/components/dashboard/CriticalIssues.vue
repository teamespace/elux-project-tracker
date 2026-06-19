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

function onGo(issue: CriticalIssue) {
  slideOver.openEdit(issue.id)
}

const riskClass = (level: CriticalIssue['riskLevel']) => {
  switch (level) {
    case 'HIGH':
      return 'text-rose-500 bg-rose-50 border-rose-200'
    case 'MEDIUM':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'LOW':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    default:
      return 'text-neutral-600 bg-neutral-100 border-neutral-200'
  }
}

const issueStatusClass = (status: CriticalIssue['status']) => {
  switch (status) {
    case 'overdue':
      return 'text-rose-500 bg-rose-50 border-rose-200'
    case 'at-risk':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'not-started':
      return 'text-neutral-500 bg-neutral-100 border-neutral-200'
    case 'done':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200'
    default:
      return 'text-neutral-500 bg-neutral-100 border-neutral-200'
  }
}
</script>

<template>
  <div class="flex flex-col rounded-xl border border-neutral-200 bg-white">
    <div class="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
      <h3 class="text-[15px] font-semibold tracking-tight text-neutral-900">Critical Issues</h3>
      <NuxtLink
        to="/board"
        class="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
      >
        View all issues
      </NuxtLink>
    </div>

    <div class="flex flex-1 flex-col">
      <div
        v-if="displayedIssues.length === 0"
        class="flex flex-1 items-center justify-center py-10"
      >
        <p class="text-[13px] text-neutral-500">No critical issues</p>
      </div>

      <div v-else class="flex flex-col">
        <!-- Header -->
        <div class="hidden px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400 sm:grid sm:grid-cols-[1fr_120px_80px]">
          <span>Issue</span>
          <span class="text-center">Status</span>
          <span class="text-right">Action</span>
        </div>

        <div
          v-for="(issue, index) in displayedIssues"
          :key="issue.id"
          class="group flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50"
          :class="index !== displayedIssues.length - 1 ? 'border-b border-neutral-100' : ''"
          @click="onGo(issue)"
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
              <p class="truncate text-[13px] font-medium text-neutral-900">
                {{ issue.title }}
              </p>
            </div>
            <div class="mt-1 flex items-center gap-2 text-[12px] text-neutral-500">
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
              class="inline-flex h-7 items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              @click.stop="onGo(issue)"
            >
              Open
              <UIcon name="ph:caret-right" class="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
