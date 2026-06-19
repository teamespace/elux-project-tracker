<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#fafafa]">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <slot name="header">
        <AppHeader>{{ route.meta.title ?? '' }}</AppHeader>
      </slot>
      <main class="flex-1 overflow-y-auto px-8 py-6">
        <slot />
      </main>
    </div>
    <SearchModal />
    <TaskSlideOver />
    <ProjectSlideOver />
    <GoalSlideOver />
    <AiAssistant />
  </div>
</template>
