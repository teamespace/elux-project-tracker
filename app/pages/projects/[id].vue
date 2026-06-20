// styled: agent-6
<script setup lang="ts">
import { projectById } from '~/shared/projects'

definePageMeta({
  layout: false,
  title: 'Project',
})

const route = useRoute()
const id = computed(() => route.params.id as string)
const project = computed(() => projectById(id.value))
</script>

<template>
  <NuxtLayout name="default">
    <div class="mx-auto w-full max-w-[800px]">
      <ProjectDetailContent :project-id="id" mode="page" />
    </div>

    <template #header>
      <AppHeader>
        <div class="flex items-center gap-2 text-[15px] font-semibold">
          <NuxtLink to="/projects" class="text-gray-500 transition-colors hover:text-gray-700">
            Projects
          </NuxtLink>
          <UIcon name="ph:caret-right" class="size-3.5 text-gray-400" />
          <span class="text-gray-900">{{ project?.name }}</span>
        </div>
      </AppHeader>
    </template>
  </NuxtLayout>
</template>
