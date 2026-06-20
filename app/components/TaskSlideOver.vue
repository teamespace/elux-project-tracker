// styled: agent-6
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useTaskSlideOver } from '~/composables/useTaskSlideOver'

const { state, close } = useTaskSlideOver()

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed bottom-2 right-2 top-2 z-50 flex h-[calc(100vh-16px)] w-full max-w-[640px] flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
      >
        <TaskDetail
          :task-id="state.taskId"
          :mode="state.mode"
          :draft="state.draft"
          variant="slide-over"
          @close="close"
        />
      </div>
    </Transition>
  </Teleport>
</template>
