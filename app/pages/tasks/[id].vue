<script setup lang="ts">
import { computed } from 'vue'
import { tasks } from '~/shared/board'

definePageMeta({
  layout: false,
  title: 'Task',
})

const route = useRoute()
const id = computed(() => route.params.id as string)
const task = computed(() => tasks.find(t => t.id === id.value))
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #header>
        <AppHeader>
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink to="/board" class="text-gray-500 transition-colors hover:text-gray-700">
              Tasks
            </NuxtLink>
            <UIcon name="ph:caret-right" class="size-3.5 text-gray-400" />
            <span class="font-medium text-gray-900">{{ task?.title || id }}</span>
          </div>
        </AppHeader>
      </template>

      <TaskDetail :task-id="id" mode="edit" variant="page" />
    </NuxtLayout>
  </div>
</template>
