# OPENCODE PROMPT — Critical Issues (Kanban Card Style)

## Goal
Update `app/components/dashboard/CriticalIssues.vue` to use the `.ci-kanban` CSS class structure from `dashboard-mockup-v3.html`. The current version uses Tailwind utility classes directly on elements. The target switches to plain CSS class names for the kanban columns and cards, matching the mockup's visual style exactly — including status badge colors with dot indicators.

The logic (high/medium split, props, computed, click handlers) stays the same. Only the template structure and CSS change.

## Target file
- `app/components/dashboard/CriticalIssues.vue` — template + script update
- `app/assets/css/main.css` — add CSS classes

---

## 1. Add these CSS classes to `app/assets/css/main.css`

```css
/* ─── CRITICAL ISSUES KANBAN ─── */
.ci-kanban { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ci-kanban-col { border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden; background: white; }
.ci-kanban-col-header { display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; padding: 7px 12px; }
.ci-kanban-col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ci-kanban-col-dot.high { background: #EF4444; }
.ci-kanban-col-dot.medium { background: #F59E0B; }
.ci-kanban-col-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #6B7280; }
.ci-kanban-col-count { margin-left: 2px; background: #E5E7EB; border-radius: 20px; padding: 0 6px; font-size: 11px; font-weight: 600; color: #9CA3AF; }
.ci-kanban-item { display: flex; flex-direction: column; gap: 6px; border-bottom: 1px solid #F3F4F6; padding: 10px 12px; cursor: pointer; transition: background .12s; }
.ci-kanban-item:last-child { border-bottom: none; }
.ci-kanban-item:hover { background: #F9FAFB; }
.ci-kanban-title { font-size: 12.5px; font-weight: 500; color: #111827; line-height: 1.4; }
.ci-kanban-footer { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.ci-kanban-meta { font-size: 11px; color: #9CA3AF; }
.ci-alert-status { display: inline-flex; align-items: center; gap: 4px; border-radius: 5px; padding: 2px 7px; font-size: 11px; font-weight: 600; flex-shrink: 0; }
.ci-alert-status::before { content: ''; display: block; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.ci-alert-status.overdue { background: #FEE2E2; color: #DC2626; }
.ci-alert-status.overdue::before { background: #DC2626; }
.ci-alert-status.at-risk { background: #FEF3C7; color: #92400E; }
.ci-alert-status.at-risk::before { background: #F59E0B; }
.ci-alert-status.not-started { background: #F3F4F6; color: #6B7280; }
.ci-alert-status.not-started::before { background: #9CA3AF; }
.ci-alert-status.done { background: oklch(96% 0.04 292.717); color: oklch(52% 0.27 292.717); }
.ci-alert-status.done::before { background: oklch(60.6% 0.25 292.717); }
```

---

## 2. Updated `app/components/dashboard/CriticalIssues.vue`

The script section is unchanged except removing `statusClass()` (no longer needed):

```vue
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
          <span class="ci-kanban-col-dot high"></span>
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
          <span class="ci-kanban-col-dot medium"></span>
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
```

## Key notes
- `statusClass()` function removed — status badge now uses `.ci-alert-status` + `:class="issue.status"` (the status value maps directly to the CSS modifier class)
- The `status` values (`overdue`, `at-risk`, `not-started`, `done`) already match the CSS class names exactly — no mapping needed
- `.ci-alert-status::before` renders the colored dot inside each badge via pure CSS — no extra markup needed
- `done` status uses oklch purple instead of blue
- The section header (pulsing dot + "Critical Issues" label + "View all" button) is preserved unchanged from the original
