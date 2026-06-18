<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Goal',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

type Status = 'on-track' | 'at-risk' | 'delayed' | 'not-started'
type Tab = 'overview' | 'kpis' | 'projects' | 'activity'

interface Owner {
  initials: string
  name: string
}

interface Label {
  id: string
  name: string
  color: string
}

interface Kpi {
  id: string
  name: string
  current: string
  target: string
  progress: number
  status: Status
  statusLabel: string
  owner: Owner
  dueDate: string
}

interface Epic {
  id: string
  title: string
  project: string
  status: Status
  statusLabel: string
  progress: number
  taskCount: number
}

interface ActivityItem {
  id: string
  actor: Owner
  action: string
  target: string
  time: string
}

interface Goal {
  id: string
  title: string
  description: string
  status: Status
  statusLabel: string
  owner: Owner
  quarter: string
  dueDate: string
  progress: number
  kpis: Kpi[]
  epics: Epic[]
  labels: Label[]
  activity: ActivityItem[]
}

const goalMap: Record<string, Goal> = {
  'goal-1': {
    id: 'goal-1',
    title: 'Q3 Ship Product Redesign',
    description: 'Deliver a complete redesign of the core product experience to improve user engagement, reduce churn, and modernize the visual language across all key user journeys.',
    status: 'on-track',
    statusLabel: 'ON TRACK',
    owner: { initials: 'R', name: 'Rasya' },
    quarter: 'Q3 2026',
    dueDate: 'Sep 30, 2026',
    progress: 58,
    labels: [
      { id: 'l-1', name: 'Product', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      { id: 'l-2', name: 'Q3', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    ],
    kpis: [
      { id: 'kpi-1', name: 'NPS Score ≥ 45', current: '38', target: '45', progress: 84, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'R', name: 'Rasya' }, dueDate: 'Sep 30' },
      { id: 'kpi-2', name: 'Reduce page load < 2s', current: '2.1s', target: '2.0s', progress: 95, status: 'on-track', statusLabel: 'ON TRACK', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Aug 15' },
      { id: 'kpi-3', name: 'Launch 3 core features', current: '1', target: '3', progress: 33, status: 'delayed', statusLabel: 'DELAYED', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Sep 30' },
    ],
    epics: [
      { id: 'epic-1', title: 'Auth & Onboarding Redesign', project: 'Alpha Project', status: 'at-risk', statusLabel: 'AT RISK', progress: 62, taskCount: 8 },
      { id: 'epic-2', title: 'Core Dashboard v2', project: 'Alpha Project', status: 'on-track', statusLabel: 'ON TRACK', progress: 78, taskCount: 5 },
    ],
    activity: [
      { id: 'a-1', actor: { initials: 'R', name: 'Rasya' }, action: 'updated progress to', target: '58%', time: '2h ago' },
      { id: 'a-2', actor: { initials: 'M', name: 'Maya' }, action: 'added KPI', target: 'Launch 3 core features', time: '1d ago' },
      { id: 'a-3', actor: { initials: 'D', name: 'Dito' }, action: 'linked project', target: 'Auth & Onboarding Redesign', time: '2d ago' },
    ],
  },
  'goal-2': {
    id: 'goal-2',
    title: 'Q3 Improve Dev Velocity',
    description: 'Increase the speed and quality of software delivery by improving CI/CD pipelines, reducing review times, and raising test coverage across all teams.',
    status: 'at-risk',
    statusLabel: 'AT RISK',
    owner: { initials: 'M', name: 'Maya' },
    quarter: 'Q3 2026',
    dueDate: 'Sep 30, 2026',
    progress: 28,
    labels: [
      { id: 'l-3', name: 'Engineering', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    ],
    kpis: [
      { id: 'kpi-4', name: 'Deploy frequency ≥ 3x/week', current: '1.5', target: '3', progress: 50, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Sep 30' },
      { id: 'kpi-5', name: 'PR review time < 4h', current: '6h', target: '4h', progress: 67, status: 'at-risk', statusLabel: 'AT RISK', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Aug 30' },
      { id: 'kpi-6', name: 'Test coverage ≥ 80%', current: '72%', target: '80%', progress: 90, status: 'on-track', statusLabel: 'ON TRACK', owner: { initials: 'R', name: 'Rara' }, dueDate: 'Sep 15' },
    ],
    epics: [
      { id: 'epic-3', title: 'API Documentation', project: 'Beta Launch', status: 'on-track', statusLabel: 'ON TRACK', progress: 80, taskCount: 3 },
    ],
    activity: [
      { id: 'a-4', actor: { initials: 'M', name: 'Maya' }, action: 'flagged as at risk', target: 'Deploy frequency KPI', time: '4h ago' },
      { id: 'a-5', actor: { initials: 'D', name: 'Dito' }, action: 'updated status to', target: 'At Risk', time: '1d ago' },
    ],
  },
  'goal-3': {
    id: 'goal-3',
    title: 'Q4 Launch Beta to 100 Users',
    description: 'Acquire and onboard the first 100 beta users, gather qualitative feedback, and achieve a healthy early retention rate before the public launch.',
    status: 'not-started',
    statusLabel: 'NOT STARTED',
    owner: { initials: 'D', name: 'Dito' },
    quarter: 'Q4 2026',
    dueDate: 'Dec 31, 2026',
    progress: 0,
    labels: [
      { id: 'l-4', name: 'Beta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
      { id: 'l-5', name: 'Growth', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    ],
    kpis: [
      { id: 'kpi-7', name: 'Beta user signups ≥ 100', current: '0', target: '100', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', owner: { initials: 'D', name: 'Dito' }, dueDate: 'Dec 31' },
      { id: 'kpi-8', name: 'User retention ≥ 60%', current: '0%', target: '60%', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', owner: { initials: 'M', name: 'Maya' }, dueDate: 'Dec 31' },
    ],
    epics: [],
    activity: [
      { id: 'a-6', actor: { initials: 'D', name: 'Dito' }, action: 'created goal', target: 'Q4 Launch Beta to 100 Users', time: '3d ago' },
    ],
  },
}

const goal = computed(() => goalMap[id.value])

const activeTab = ref<Tab>('overview')
const isStarred = ref(false)
const showCopied = ref(false)

const editable = reactive({
  owner: goal.value?.owner.name ?? '',
  quarter: goal.value?.quarter ?? '',
  dueDate: goal.value?.dueDate ?? '',
  status: goal.value?.status ?? 'not-started',
  progress: goal.value?.progress ?? 0,
})

watch(() => goal.value, (next) => {
  if (next) {
    editable.owner = next.owner.name
    editable.quarter = next.quarter
    editable.dueDate = next.dueDate
    editable.status = next.status
    editable.progress = next.progress
  }
}, { immediate: true })

const statusOptions: { value: Status; label: string }[] = [
  { value: 'on-track', label: 'On Track' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'not-started', label: 'Not Started' },
]

function statusClasses(status: Status) {
  const map: Record<Status, string> = {
    'on-track': 'bg-green-50 text-green-600 border-green-200',
    'at-risk': 'bg-amber-50 text-amber-600 border-amber-200',
    'delayed': 'bg-red-50 text-red-600 border-red-200',
    'not-started': 'bg-gray-50 text-gray-500 border-gray-200',
  }
  return map[status] ?? map['not-started']
}

function progressBarColor(progress: number) {
  if (progress >= 75) return 'bg-green-600'
  if (progress >= 25) return 'bg-amber-600'
  return 'bg-gray-500'
}

function copyLink() {
  navigator.clipboard?.writeText(window.location.href)
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 1500)
}

function shareGoal() {
  // Placeholder for share action
}

const computedProgress = computed(() => {
  if (!goal.value) return 0
  return Math.min(100, Math.max(0, editable.progress))
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center gap-2 text-[15px] font-semibold">
      <NuxtLink to="/goals" class="text-gray-500 transition-colors hover:text-gray-700">
        Goals
      </NuxtLink>
      <span class="text-gray-400"> / </span>
      <span class="text-gray-900">{{ goal?.title }}</span>
    </div>

    <div v-if="!goal" class="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center">
      <UIcon name="ph:target" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-base text-gray-500">Goal not found</p>
      <NuxtLink to="/goals" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Goals</NuxtLink>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-xl font-semibold text-gray-900">{{ goal.title }}</h1>
              <span
                class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                :class="statusClasses(goal.status)"
              >
                {{ goal.statusLabel }}
              </span>
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-gray-500">
              <span class="inline-flex items-center gap-1.5">
                <span class="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                  {{ goal.owner.initials }}
                </span>
                <span class="text-gray-700">{{ goal.owner.name }}</span>
              </span>
              <span class="inline-flex items-center gap-1">
                <UIcon name="ph:calendar-blank" class="size-4 text-gray-400" />
                Due {{ goal.dueDate }}
              </span>
              <span class="inline-flex items-center gap-1">
                <UIcon name="ph:chart-pie-slice" class="size-4 text-gray-400" />
                {{ goal.kpis.length }} KPIs
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              @click="shareGoal"
            >
              <UIcon name="ph:share-network" class="size-4 text-gray-500" />
              Share
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              @click="copyLink"
            >
              <UIcon name="ph:link" class="size-4 text-gray-500" />
              {{ showCopied ? 'Copied' : 'Copy link' }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50"
              :class="isStarred ? 'text-amber-500' : 'text-gray-500'"
              @click="isStarred = !isStarred"
            >
              <UIcon :name="isStarred ? 'ph:star-fill' : 'ph:star'" class="size-4" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <UIcon name="ph:dots-three-outline-vertical" class="size-4" />
            </button>
          </div>
        </div>

        <div class="mt-5">
          <div class="flex items-center justify-between gap-3 text-[13px]">
            <span class="font-medium text-gray-700">Progress</span>
            <span class="tabular-nums font-semibold text-gray-900">{{ goal.progress }}%</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full transition-all"
              :class="progressBarColor(goal.progress)"
              :style="{ width: `${goal.progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mt-6 flex border-b border-gray-200">
        <button
          v-for="tab in (['overview', 'kpis', 'projects', 'activity'] as const)"
          :key="tab"
          type="button"
          class="relative px-4 pb-2.5 text-[13px] font-medium transition-colors"
          :class="activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab"
        >
          {{ tab === 'overview' ? 'Overview' : tab === 'kpis' ? `KPIs (${goal.kpis.length})` : tab === 'projects' ? `Projects (${goal.epics.length})` : 'Activity' }}
          <div
            v-if="activeTab === tab"
            class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600"
          />
        </button>
      </div>

      <!-- Content -->
      <div class="mt-5 flex flex-col gap-5 lg:flex-row">
        <!-- Left column -->
        <div class="min-w-0 flex-[1.85] space-y-5">
          <!-- Overview -->
          <div v-if="activeTab === 'overview'" class="space-y-5">
            <div class="rounded-xl border border-gray-200 bg-white p-5">
              <h3 class="text-[14px] font-semibold text-gray-900">Description</h3>
              <textarea
                v-model="goal.description"
                rows="4"
                class="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-[14px] leading-relaxed text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="Add a description..."
              />
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-5">
              <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-semibold text-gray-900">Key Results / KPIs</h3>
                <span class="text-[12px] text-gray-500">{{ goal.kpis.length }}</span>
              </div>
              <div v-if="goal.kpis.length === 0" class="mt-4 rounded-lg border border-dashed border-gray-200 p-8 text-center">
                <UIcon name="ph:chart-bar" class="mx-auto size-8 text-gray-400" />
                <p class="mt-2 text-[13px] text-gray-500">No KPIs defined yet</p>
              </div>
              <div v-else class="mt-4 grid gap-3">
                <div
                  v-for="kpi in goal.kpis"
                  :key="kpi.id"
                  class="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0 flex-1">
                      <h4 class="text-[14px] font-medium text-gray-900">{{ kpi.name }}</h4>
                      <p class="mt-0.5 text-[12px] text-gray-500">
                        Current: <span class="font-medium text-gray-700">{{ kpi.current }}</span>
                        <span class="mx-1 text-gray-300">/</span>
                        Target: <span class="font-medium text-gray-700">{{ kpi.target }}</span>
                      </p>
                    </div>
                    <span
                      class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                      :class="statusClasses(kpi.status)"
                    >
                      {{ kpi.statusLabel }}
                    </span>
                  </div>
                  <div class="mt-3 flex items-center gap-2">
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="progressBarColor(kpi.progress)"
                        :style="{ width: `${kpi.progress}%` }"
                      />
                    </div>
                    <span class="w-10 text-right text-[11px] tabular-nums text-gray-500">{{ kpi.progress }}%</span>
                  </div>
                  <div class="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                    <span class="inline-flex items-center gap-1">
                      <span class="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white">
                        {{ kpi.owner.initials }}
                      </span>
                      {{ kpi.owner.name }}
                    </span>
                    <span class="text-gray-300">·</span>
                    <span>Due {{ kpi.dueDate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-5">
              <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-semibold text-gray-900">Linked Projects</h3>
                <span class="text-[12px] text-gray-500">{{ goal.epics.length }}</span>
              </div>
              <div v-if="goal.epics.length === 0" class="mt-4 rounded-lg border border-dashed border-gray-200 p-8 text-center">
                <UIcon name="ph:lightning" class="mx-auto size-8 text-gray-400" />
                <p class="mt-2 text-[13px] text-gray-500">No projects linked yet</p>
              </div>
              <div v-else class="mt-4 flex flex-col gap-2">
                <NuxtLink
                  v-for="epic in goal.epics"
                  :key="epic.id"
                  :to="`/projects/${epic.id}`"
                  class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
                >
                  <UIcon name="ph:lightning" class="size-5 shrink-0 text-blue-600" />
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <h4 class="text-[14px] font-medium text-gray-900">{{ epic.title }}</h4>
                      <span
                        class="inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                        :class="statusClasses(epic.status)"
                      >
                        {{ epic.statusLabel }}
                      </span>
                    </div>
                    <p class="mt-0.5 text-[12px] text-gray-500">{{ epic.project }} · {{ epic.taskCount }} tasks</p>
                  </div>
                  <div class="flex w-24 items-center gap-2">
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="progressBarColor(epic.progress)"
                        :style="{ width: `${epic.progress}%` }"
                      />
                    </div>
                    <span class="text-[11px] tabular-nums text-gray-500">{{ epic.progress }}%</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- KPIs tab -->
          <div v-if="activeTab === 'kpis'" class="rounded-xl border border-gray-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[14px] font-semibold text-gray-900">Key Results / KPIs</h3>
              <span class="text-[12px] text-gray-500">{{ goal.kpis.length }}</span>
            </div>
            <div v-if="goal.kpis.length === 0" class="mt-4 rounded-lg border border-dashed border-gray-200 p-8 text-center">
              <UIcon name="ph:chart-bar" class="mx-auto size-8 text-gray-400" />
              <p class="mt-2 text-[13px] text-gray-500">No KPIs defined yet</p>
            </div>
            <div v-else class="mt-4 grid gap-3">
              <div
                v-for="kpi in goal.kpis"
                :key="kpi.id"
                class="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <h4 class="text-[14px] font-medium text-gray-900">{{ kpi.name }}</h4>
                    <p class="mt-0.5 text-[12px] text-gray-500">
                      Current: <span class="font-medium text-gray-700">{{ kpi.current }}</span>
                      <span class="mx-1 text-gray-300">/</span>
                      Target: <span class="font-medium text-gray-700">{{ kpi.target }}</span>
                    </p>
                  </div>
                  <span
                    class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                    :class="statusClasses(kpi.status)"
                  >
                    {{ kpi.statusLabel }}
                  </span>
                </div>
                <div class="mt-3 flex items-center gap-2">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="progressBarColor(kpi.progress)"
                      :style="{ width: `${kpi.progress}%` }"
                    />
                  </div>
                  <span class="w-10 text-right text-[11px] tabular-nums text-gray-500">{{ kpi.progress }}%</span>
                </div>
                <div class="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                  <span class="inline-flex items-center gap-1">
                    <span class="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white">
                      {{ kpi.owner.initials }}
                    </span>
                    {{ kpi.owner.name }}
                  </span>
                  <span class="text-gray-300">·</span>
                  <span>Due {{ kpi.dueDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects tab -->
          <div v-if="activeTab === 'projects'" class="rounded-xl border border-gray-200 bg-white p-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[14px] font-semibold text-gray-900">Linked Projects</h3>
              <span class="text-[12px] text-gray-500">{{ goal.epics.length }}</span>
            </div>
            <div v-if="goal.epics.length === 0" class="mt-4 rounded-lg border border-dashed border-gray-200 p-8 text-center">
              <UIcon name="ph:lightning" class="mx-auto size-8 text-gray-400" />
              <p class="mt-2 text-[13px] text-gray-500">No projects linked yet</p>
            </div>
            <div v-else class="mt-4 flex flex-col gap-2">
              <NuxtLink
                v-for="epic in goal.epics"
                :key="epic.id"
                :to="`/projects/${epic.id}`"
                class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
              >
                <UIcon name="ph:lightning" class="size-5 shrink-0 text-blue-600" />
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h4 class="text-[14px] font-medium text-gray-900">{{ epic.title }}</h4>
                    <span
                      class="inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                      :class="statusClasses(epic.status)"
                    >
                      {{ epic.statusLabel }}
                    </span>
                  </div>
                  <p class="mt-0.5 text-[12px] text-gray-500">{{ epic.project }} · {{ epic.taskCount }} tasks</p>
                </div>
                <div class="flex w-24 items-center gap-2">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="progressBarColor(epic.progress)"
                      :style="{ width: `${epic.progress}%` }"
                    />
                  </div>
                  <span class="text-[11px] tabular-nums text-gray-500">{{ epic.progress }}%</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Activity tab -->
          <div v-if="activeTab === 'activity'" class="rounded-xl border border-gray-200 bg-white p-5">
            <h3 class="text-[14px] font-semibold text-gray-900">Activity</h3>
            <div class="mt-4 flex flex-col gap-4">
              <div v-for="item in goal.activity" :key="item.id" class="flex gap-3">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                  {{ item.actor.initials }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] text-gray-700">
                    <span class="font-medium text-gray-900">{{ item.actor.name }}</span>
                    {{ item.action }}
                    <span class="font-medium text-gray-900">{{ item.target }}</span>
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-400">{{ item.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="w-full shrink-0 lg:w-[35%]">
          <div class="rounded-xl border border-gray-200 bg-white p-5">
            <h3 class="text-[14px] font-semibold text-gray-900">Properties</h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Owner</label>
                <div class="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
                  <span class="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                    {{ goal.owner.initials }}
                  </span>
                  <input
                    v-model="editable.owner"
                    type="text"
                    class="min-w-0 flex-1 bg-transparent text-[13px] text-gray-700 focus:outline-none"
                  >
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Quarter</label>
                <input
                  v-model="editable.quarter"
                  type="text"
                  class="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
              </div>

              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Due date</label>
                <input
                  v-model="editable.dueDate"
                  type="text"
                  class="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
              </div>

              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Status</label>
                <select
                  v-model="editable.status"
                  class="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                >
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Progress</label>
                <div class="mt-1.5 flex items-center gap-3">
                  <input
                    v-model.number="editable.progress"
                    type="number"
                    min="0"
                    max="100"
                    class="w-20 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                  <span class="text-[13px] text-gray-500">%</span>
                </div>
                <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    class="h-full rounded-full bg-blue-600 transition-all"
                    :style="{ width: `${computedProgress}%` }"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Labels / Tags</label>
                <div class="mt-1.5 flex flex-wrap gap-2">
                  <span
                    v-for="label in goal.labels"
                    :key="label.id"
                    class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                    :class="label.color"
                  >
                    {{ label.name }}
                  </span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                  >
                    <UIcon name="ph:plus" class="size-3" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
