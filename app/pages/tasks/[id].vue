<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: false,
  title: 'Task',
})

const route = useRoute()
const id = computed(() => route.params.id as string)

const taskKey = computed(() => {
  const num = Number.parseInt(id.value.split('-').pop() || '', 10)
  if (Number.isNaN(num)) return id.value.toUpperCase()
  return `ELX-${String(num).padStart(3, '0')}`
})
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
            <span class="font-medium text-gray-900">{{ taskKey }}</span>
          </div>
        </AppHeader>
      </template>

      <TaskDetail :task-id="id" mode="edit" variant="page" />
    </NuxtLayout>
  </div>
</template>
