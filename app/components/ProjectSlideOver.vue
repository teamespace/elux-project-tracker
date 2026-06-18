<script setup lang="ts">
const { state, close } = useProjectSlideOver()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
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
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-[720px] flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div class="flex-1 overflow-y-auto px-5 py-5">
          <ProjectDetailContent
            :project-id="state.projectId"
            mode="slide-over"
            @close="close"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
