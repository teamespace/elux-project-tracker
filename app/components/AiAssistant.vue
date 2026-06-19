<script setup lang="ts">
const showAI = ref(false)
const input = ref('')

function toggle() {
  showAI.value = !showAI.value
}

function close() {
  showAI.value = false
}
</script>

<template>
  <div>
    <button
      type="button"
      class="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
      @click="toggle"
    >
      <UIcon name="ph:sparkle" class="size-4" />
      <span>Ask AI</span>
    </button>

    <div
      v-if="showAI"
      class="fixed bottom-5 right-5 z-50 w-80 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
    >
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex size-6 items-center justify-center rounded-md bg-neutral-900 text-white">
            <UIcon name="ph:sparkle" class="size-3.5" />
          </div>
          <h3 class="text-[14px] font-semibold text-neutral-900">AI Assistant</h3>
        </div>
        <button
          type="button"
          class="inline-flex size-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          @click="close"
        >
          <UIcon name="ph:x" class="size-4" />
        </button>
      </div>
      <p class="mb-3 text-[12px] leading-relaxed text-neutral-500">
        Ask me anything about your projects, tasks, or goals.
      </p>
      <div class="flex gap-2">
        <UInput
          v-model="input"
          placeholder="Type your question..."
          class="flex-1"
          size="sm"
        />
        <UButton icon="ph:paper-plane-right" color="neutral" size="sm" />
      </div>
    </div>
  </div>
</template>
