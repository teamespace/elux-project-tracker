// styled: agent-2
<script setup lang="ts">
const route = useRoute()
const showAI = ref(false)

function openAI() {
  showAI.value = !showAI.value
}
</script>

<template>
  <div>
    <div class="flex h-screen overflow-hidden bg-[#fafafa]">
      <AppSidebar />
      <div class="flex flex-1 flex-col overflow-hidden m-2 ml-0 rounded-xl border border-black/[0.09] bg-white">
        <slot name="header">
          <AppHeader>{{ route.meta.title ?? '' }}</AppHeader>
        </slot>
        <main class="flex-1 overflow-y-auto px-6 py-5">
          <slot />
        </main>
      </div>
    </div>
    <SearchModal />
    <TaskSlideOver />
    <ProjectSlideOver />
    <GoalSlideOver />
    <CriticalIssuesSlideOver />
    <ActivitySlideOver />
    <!-- AI Floating Button -->
    <button
      class="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-xl hover:scale-105"
      @click="openAI"
    >
      <UIcon name="ph:sparkle" class="size-5" />
    </button>
    <!-- AI Panel -->
    <div
      v-if="showAI"
      class="fixed bottom-20 right-6 z-40 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-[14px] font-semibold text-gray-900">AI Assistant</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="showAI = false">
          <UIcon name="ph:x" class="size-4" />
        </button>
      </div>
      <p class="mb-3 text-[12px] text-gray-500">Ask me anything about your projects, tasks, or goals.</p>
      <div class="flex gap-2">
        <UInput placeholder="Type your question..." class="flex-1" />
        <UButton icon="ph:paper-plane-right" color="primary" size="sm" />
      </div>
    </div>
  </div>
</template>
