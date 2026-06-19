<script setup lang="ts">
interface Project {
  id: string
  name: string
  status: 'on-track' | 'at-risk' | 'delayed' | 'not-started'
  statusLabel: string
  description: string
  progress: number
  openTasks: number
  atRiskTasks: number
  dueDate: string
  createdDate?: string
  assignees: { initials: string }[]
}

const props = defineProps<{
  projects: Project[]
}>()

const projectSlideOver = useProjectSlideOver()

const statusClass = (status: string) => ({
  'on-track': 'text-green-600 bg-green-50 border-green-200',
  'at-risk': 'text-amber-600 bg-amber-50 border-amber-200',
  'delayed': 'text-red-600 bg-red-50 border-red-200',
  'not-started': 'text-gray-500 bg-gray-50 border-gray-200',
}[status] || '')

const progressColor = (pct: number) => {
  if (pct === 0) return 'bg-gray-500'
  if (pct <= 33) return 'bg-amber-600'
  if (pct <= 66) return 'bg-blue-600'
  if (pct < 100) return 'bg-green-600'
  return 'bg-blue-600'
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-[16px] font-semibold text-gray-900">
        Projects <span class="font-normal text-gray-500">({{ props.projects.length }})</span>
      </h3>
      <div class="flex items-center gap-2">
        <NuxtLink to="/projects" class="text-[13px] text-gray-500 transition-colors hover:text-gray-700">
          View all
        </NuxtLink>
        <button
          type="button"
          class="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[13px] text-gray-700 transition-colors hover:bg-gray-100"
          @click="projectSlideOver.openCreate()"
        >
          <UIcon name="ph:plus" class="size-3.5" />
          New
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="project in props.projects"
        :key="project.id"
        class="cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300"
        @click="projectSlideOver.openView(project.id)"
      >
        <div class="mb-3 flex items-start justify-between">
          <span
            class="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium"
            :class="statusClass(project.status)"
          >
            {{ project.statusLabel }}
          </span>
        </div>

        <h4 class="mb-1 text-[17px] font-bold text-gray-900">
          {{ project.name }}
        </h4>
        <p class="mb-4 line-clamp-2 text-[13px] text-gray-500">
          {{ project.description }}
        </p>

        <div class="mb-4">
          <div class="mb-1.5 flex items-center justify-between">
            <span class="text-[12px] text-gray-500">Progress</span>
            <span class="text-[12px] font-semibold text-gray-700">{{ project.progress }}%</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="progressColor(project.progress)"
              :style="{ width: project.progress + '%' }"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex -space-x-1.5">
              <div
                v-for="(a, i) in project.assignees.slice(0, 3)"
                :key="i"
                class="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white ring-2 ring-white"
              >
                {{ a.initials }}
              </div>
              <div
                v-if="project.assignees.length > 3"
                class="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 ring-2 ring-white"
              >
                +{{ project.assignees.length - 3 }}
              </div>
            </div>
            <span class="text-[12px] text-gray-500">
              {{ project.openTasks }} open
            </span>
          </div>

          <div class="flex items-center gap-2.5">
            <span
              v-if="project.atRiskTasks > 0"
              class="inline-flex items-center rounded-sm border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600"
            >
              {{ project.atRiskTasks }} at risk
            </span>
            <span class="flex items-center gap-1 text-[11px] text-gray-500">
              <UIcon name="ph:calendar-blank" class="size-3" />
              <span v-if="project.dueDate">Due {{ project.dueDate }}</span>
              <span v-else-if="project.createdDate">Created {{ project.createdDate }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
