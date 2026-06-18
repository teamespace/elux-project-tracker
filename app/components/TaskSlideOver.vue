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
        class="fixed inset-0 z-50 bg-black/40"
        @click.self="close"
      />
    </Transition>

    <Transition
      enter-active-class="transform transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="state.isOpen"
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-[760px] flex-col overflow-y-auto bg-white shadow-2xl"
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
