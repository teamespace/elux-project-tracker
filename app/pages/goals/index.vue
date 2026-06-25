<script setup lang="ts">
import { goals } from '~/shared/goals'

definePageMeta({ layout: 'default', title: 'Goals' })

const openDd = ref('')
const statusFilter = ref('all')
const viewMode = ref<'card' | 'list'>('card')

function toggleDd(e: Event, id: string) {
  e.stopPropagation()
  openDd.value = openDd.value === id ? '' : id
}
function closeDd() { openDd.value = '' }
onMounted(() => document.addEventListener('click', closeDd))
onUnmounted(() => document.removeEventListener('click', closeDd))

const statusOptions = [
  { label: 'All Statuses', value: 'all',          dot: '' },
  { label: 'On Track',     value: 'on-track',      dot: '#22C55E' },
  { label: 'At Risk',      value: 'at-risk',        dot: '#F59E0B' },
  { label: 'Delayed',      value: 'delayed',        dot: '#EF4444' },
  { label: 'Not Started',  value: 'not-started',    dot: '#9CA3AF' },
]

const selectedStatusLabel = computed(() =>
  statusOptions.find(o => o.value === statusFilter.value)?.label ?? 'Status'
)

const filteredGoals = computed(() =>
  statusFilter.value === 'all'
    ? goals.value
    : goals.value.filter(g => g.status === statusFilter.value)
)

function goalBarClass(status: string) {
  const map: Record<string, string> = {
    'on-track': 'green', 'at-risk': 'amber', 'delayed': 'red', 'not-started': 'gray', 'complete': 'complete',
  }
  return map[status] ?? 'blue'
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="page-toolbar">
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="df-wrap" @click.stop="toggleDd($event, 'status')">
          <button class="df-btn" :class="{ 'has-filter': statusFilter !== 'all' }">
            <span>{{ selectedStatusLabel }}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="df-dropdown" :class="{ open: openDd === 'status' }">
            <div
              v-for="opt in statusOptions" :key="opt.value"
              class="df-item" :class="{ 'active-item': statusFilter === opt.value }"
              @click="statusFilter = opt.value; openDd = ''"
            >
              <span v-if="opt.dot" class="df-dot" :style="{ background: opt.dot }" />
              <span class="df-item-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="proj-view-switcher">
        <button class="proj-view-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
          Cards
        </button>
        <button class="proj-view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>
          List
        </button>
      </div>
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'card'" class="goals-grid">
      <NuxtLink
        v-for="goal in filteredGoals" :key="goal.id"
        :to="`/goals/${goal.id}`"
        class="goal-card"
      >
        <div class="goal-card-top">
          <span class="goal-cat-tag">Q{{ goal.quarter }}</span>
          <span class="goal-status-pill" :class="goal.status">{{ goal.statusLabel }}</span>
        </div>
        <div class="goal-card-title">{{ goal.title }}</div>
        <div class="goal-card-desc">{{ goal.description }}</div>

        <div class="goal-progress-section">
          <div class="goal-progress-row">
            <span class="goal-progress-label">Progress</span>
            <span class="goal-progress-count">{{ goal.progress }}%</span>
          </div>
          <div class="goal-bar-track">
            <div class="goal-bar-fill" :class="goalBarClass(goal.status)" :style="{ width: `${goal.progress}%` }" />
          </div>
          <div v-if="goal.linkedProjects?.length" class="goal-progress-hint">
            {{ goal.linkedProjects.filter((p: any) => p.status === 'on-track' || p.status === 'completed').length }}/{{ goal.linkedProjects.length }} projects on track
          </div>
        </div>

        <div v-if="goal.linkedProjects?.length" class="goal-linked">
          <span class="goal-linked-label">Projects</span>
          <span v-for="lp in goal.linkedProjects" :key="lp.id" class="goal-proj-chip">
            <span class="goal-proj-chip-key">{{ lp.project }}</span>
            {{ lp.title }}
          </span>
        </div>

        <div class="goal-card-footer">
          <span class="goal-due">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ goal.dueDate }}
          </span>
          <div class="goal-members">
            <div class="av-stack">
              <img class="av-circle" :src="goal.owner.avatar" :alt="goal.owner.name">
            </div>
            <span class="goal-member-count">{{ goal.owner.name }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- List View -->
    <div v-else style="flex:1;overflow-y:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr>
            <th class="list-th">Goal</th>
            <th class="list-th" style="width:110px">Status</th>
            <th class="list-th" style="width:140px">Progress</th>
            <th class="list-th" style="width:80px">Quarter</th>
            <th class="list-th" style="width:100px">Due</th>
            <th class="list-th" style="width:140px">Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="goal in filteredGoals" :key="goal.id"
            class="list-tr"
            @click="navigateTo(`/goals/${goal.id}`)"
          >
            <td class="list-td" style="font-weight:600;color:#111827;">{{ goal.title }}</td>
            <td class="list-td">
              <span class="goal-status-pill" :class="goal.status">{{ goal.statusLabel }}</span>
            </td>
            <td class="list-td">
              <div style="display:flex;align-items:center;gap:8px;">
                <div class="goal-bar-track" style="flex:1;">
                  <div class="goal-bar-fill" :class="goalBarClass(goal.status)" :style="{ width: `${goal.progress}%` }" />
                </div>
                <span style="font-size:12px;color:#6B7280;min-width:30px;text-align:right;">{{ goal.progress }}%</span>
              </div>
            </td>
            <td class="list-td" style="color:#6B7280;">Q{{ goal.quarter }}</td>
            <td class="list-td" style="color:#9CA3AF;font-size:12px;">{{ goal.dueDate }}</td>
            <td class="list-td">
              <div style="display:flex;align-items:center;gap:6px;">
                <img :src="goal.owner.avatar" :alt="goal.owner.name" style="width:20px;height:20px;border-radius:50%;object-fit:cover;">
                <span style="font-size:12px;color:#4B5563;">{{ goal.owner.name }}</span>
              </div>
            </td>
          </tr>
          <tr v-if="filteredGoals.length === 0">
            <td colspan="6" style="padding:40px;text-align:center;color:#9CA3AF;font-size:14px;">No goals match the selected filter.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
