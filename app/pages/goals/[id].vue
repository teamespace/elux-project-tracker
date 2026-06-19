<script setup lang="ts">
import { goalById, progressBarColor, statusClasses } from '~/shared/goals'

const { openEdit } = useGoalSlideOver()

definePageMeta({
  layout: 'default',
  title: 'Goal',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

const goal = computed(() => goalById(id.value))

const isStarred = ref(false)
const showCopied = ref(false)

function copyLink() {
  navigator.clipboard?.writeText(window.location.href)
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 1500)
}

function shareGoal() {
  // Placeholder for share action
}

function addKpi() {
  // Placeholder for add KPI action
}

function addProject() {
  // Placeholder for add project action
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center gap-2 text-[15px] font-semibold">
      <NuxtLink to="/goals" class="text-gray-500 transition-colors hover:text-gray-700">
        Goals
      </NuxtLink>
      <span class="text-gray-400"> / </span>
      <span class="truncate text-gray-900">{{ goal?.title }}</span>
    </div>

    <div v-if="!goal" class="rounded-xl border border-gray-200 bg-white p-12 text-center">
      <UIcon name="ph:target" class="mx-auto size-10 text-gray-400" />
      <p class="mt-3 text-base text-gray-500">Goal not found</p>
      <NuxtLink to="/goals" class="mt-2 inline-block text-sm text-blue-600 hover:underline">Back to Goals</NuxtLink>
    </div>

    <template v-else>
      <!-- Header card -->
      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <!-- Title row -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-xl font-semibold text-gray-900">{{ goal.title }}</h1>
            <UBadge
              variant="outline"
              size="sm"
              :class="statusClasses(goal.status)"
              class="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
            >
              {{ goal.statusLabel }}
            </UBadge>
          </div>

          <!-- Action row -->
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              icon="ph:share-network"
              label="Share"
              @click="shareGoal"
            />
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              icon="ph:link"
              :label="showCopied ? 'Copied' : 'Copy link'"
              @click="copyLink"
            />
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              :icon="isStarred ? 'ph:star-fill' : 'ph:star'"
              :class="isStarred ? 'text-amber-500' : 'text-gray-700'"
              @click="isStarred = !isStarred"
            />
            <UButton
              color="primary"
              size="sm"
              icon="ph:pencil-simple"
              label="Edit"
              @click="openEdit(goal.id)"
            />
          </div>
        </div>

        <!-- Meta row -->
        <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-gray-500">
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
          <span class="inline-flex items-center gap-1">
            <UIcon name="ph:chart-bar" class="size-4 text-gray-400" />
            {{ goal.progress }}% progress
          </span>
        </div>

        <!-- Progress bar -->
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

      <!-- KPIs section -->
      <div class="mt-5 rounded-xl border border-gray-200 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <h2 class="text-[15px] font-semibold text-gray-900">KPIs</h2>
            <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              {{ goal.kpis.length }}
            </span>
          </div>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="ph:plus"
            label="Add KPI"
            @click="addKpi"
          />
        </div>

        <div v-if="goal.kpis.length === 0" class="mt-6 rounded-lg border border-dashed border-gray-200 p-10 text-center">
          <UIcon name="ph:chart-bar" class="mx-auto size-8 text-gray-400" />
          <p class="mt-2 text-[13px] text-gray-500">No KPIs defined yet</p>
        </div>

        <div v-else class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="kpi in goal.kpis"
            :key="kpi.id"
            class="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] font-medium text-gray-900">{{ kpi.name }}</h3>
                <p class="mt-0.5 text-[12px] text-gray-500">
                  <span class="font-medium text-gray-700">{{ kpi.current }}</span>
                  <span class="mx-1 text-gray-300">/</span>
                  <span class="font-medium text-gray-700">{{ kpi.target }}</span>
                </p>
              </div>
              <UBadge
                variant="outline"
                size="sm"
                :class="statusClasses(kpi.status)"
                class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
              >
                {{ kpi.statusLabel }}
              </UBadge>
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
              <span class="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white">
                {{ kpi.owner.initials }}
              </span>
              <span class="truncate">{{ kpi.owner.name }}</span>
              <span class="text-gray-300">·</span>
              <span>Due {{ kpi.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Linked Projects section -->
      <div class="mt-5 rounded-xl border border-gray-200 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <h2 class="text-[15px] font-semibold text-gray-900">Linked Projects</h2>
            <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              {{ goal.linkedProjects.length }}
            </span>
          </div>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            icon="ph:plus"
            label="Add project"
            @click="addProject"
          />
        </div>

        <div v-if="goal.linkedProjects.length === 0" class="mt-6 rounded-lg border border-dashed border-gray-200 p-10 text-center">
          <UIcon name="ph:squares-four" class="mx-auto size-8 text-gray-400" />
          <p class="mt-2 text-[13px] text-gray-500">No projects linked yet</p>
        </div>

        <div v-else class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="epic in goal.linkedProjects"
            :key="epic.id"
            :to="`/projects/${epic.id}`"
            class="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] font-medium text-gray-900">{{ epic.title }}</h3>
                <p class="mt-0.5 text-[12px] text-gray-500">{{ epic.project }}</p>
              </div>
              <UBadge
                variant="outline"
                size="sm"
                :class="statusClasses(epic.status)"
                class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
              >
                {{ epic.statusLabel }}
              </UBadge>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="progressBarColor(epic.progress)"
                  :style="{ width: `${epic.progress}%` }"
                />
              </div>
              <span class="w-10 text-right text-[11px] tabular-nums text-gray-500">{{ epic.progress }}%</span>
            </div>
            <div class="mt-2 flex items-center gap-1 text-[12px] text-gray-500">
              <UIcon name="ph:check-circle" class="size-4 text-gray-400" />
              <span>{{ epic.taskCount }} {{ epic.taskCount === 1 ? 'task' : 'tasks' }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
