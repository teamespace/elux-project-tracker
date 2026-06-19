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
  assignees: { initials: string; name: string; avatar: string }[]
}

const props = defineProps<{
  projects: Project[]
}>()

const projectSlideOver = useProjectSlideOver()

const statusClass = (status: string) => ({
  'on-track': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'at-risk': 'text-amber-600 bg-amber-50 border-amber-200',
  'delayed': 'text-rose-500 bg-rose-50 border-rose-200',
  'not-started': 'text-neutral-500 bg-neutral-100 border-neutral-200',
}[status] || '')

const progressColor = (status: string) => {
  switch (status) {
    case 'on-track': return 'bg-emerald-600'
    case 'at-risk': return 'bg-amber-600'
    case 'delayed': return 'bg-rose-500'
    case 'not-started': return 'bg-neutral-400'
    default: return 'bg-neutral-900'
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-[15px] font-semibold tracking-tight text-neutral-900">
        Projects <span class="font-normal text-neutral-500">({{ props.projects.length }})</span>
      </h3>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/projects"
          class="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          View all
        </NuxtLink>
        <button
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          @click="projectSlideOver.openCreate()"
        >
          <UIcon name="ph:plus" class="size-3.5" />
          New
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        v-for="project in props.projects"
        :key="project.id"
        class="group flex cursor-pointer flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-sm"
        @click="projectSlideOver.openView(project.id)"
      >
        <div class="mb-3 flex items-start justify-between">
          <span
            class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
            :class="statusClass(project.status)"
          >
            {{ project.statusLabel }}
          </span>
          <UIcon
            name="ph:caret-right"
            class="size-4 text-neutral-300 transition-colors group-hover:text-neutral-500"
          />
        </div>

        <h4 class="mb-1 text-[17px] font-semibold tracking-tight text-neutral-900">
          {{ project.name }}
        </h4>
        <p class="mb-4 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
          {{ project.description }}
        </p>

        <div class="mb-4">
          <div class="mb-1.5 flex items-center justify-between">
            <span class="text-[12px] text-neutral-500">Progress</span>
            <span class="text-[12px] font-semibold tabular-nums text-neutral-900">{{ project.progress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="progressColor(project.status)"
              :style="{ width: project.progress + '%' }"
            />
          </div>
        </div>

        <div class="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
          <div class="flex items-center gap-3">
            <div class="flex -space-x-1.5">
              <UAvatar
                v-for="(a, i) in project.assignees.slice(0, 3)"
                :key="i"
                :src="a.avatar"
                :text="a.initials"
                size="xs"
                class="ring-2 ring-white"
              />
              <div
                v-if="project.assignees.length > 3"
                class="flex size-6 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-medium text-neutral-500 ring-2 ring-white"
              >
                +{{ project.assignees.length - 3 }}
              </div>
            </div>
            <span class="text-[12px] text-neutral-500">
              {{ project.openTasks }} open
            </span>
          </div>

          <div class="flex items-center gap-2.5">
            <span
              v-if="project.atRiskTasks > 0"
              class="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-500"
            >
              {{ project.atRiskTasks }} at risk
            </span>
            <span class="flex items-center gap-1 text-[11px] text-neutral-500">
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
