<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <div class="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <AppSidebar />
      <div class="flex-1 overflow-hidden p-3">
        <div class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.03)]">
          <slot name="header">
            <AppHeader>{{ route.meta.title ?? '' }}</AppHeader>
          </slot>
          <main class="flex-1 overflow-y-auto px-5 py-4">
            <slot />
          </main>
        </div>
      </div>
    </div>
    <SearchModal />
    <TaskSlideOver />
    <ProjectSlideOver />
    <GoalSlideOver />
  </div>
</template>
