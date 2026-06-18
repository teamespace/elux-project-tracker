<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'No tasks match the current filters',
  description: 'Try adjusting your filters to see more results.',
})
</script>

<template>
  <div class="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
    <div class="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100">
      <UIcon name="ph:magnifying-glass" class="size-6 text-gray-400" />
    </div>
    <p class="text-[14px] font-medium text-gray-900">
      {{ title }}
    </p>
    <p class="mt-1 text-[13px] text-gray-500">
      {{ description }}
    </p>
  </div>
</template>
