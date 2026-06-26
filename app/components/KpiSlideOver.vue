<script setup lang="ts">
const { state, close } = useKpiSlideOver()

defineEmits<{ submit: [payload: import('./KpiCreateContent.vue').KpiPayload] }>()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
      <div v-if="state.isOpen" class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" @click.self="close" />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="state.isOpen"
        class="fixed bottom-2 right-2 top-2 z-50 flex h-[calc(100vh-16px)] w-full max-w-[480px] flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Add KPI"
      >
        <div class="flex shrink-0 items-center justify-end gap-2 border-b border-gray-100 px-4 py-2.5">
          <UButton variant="ghost" color="neutral" size="xs" square icon="ph:x" title="Close" @click="close" />
        </div>
        <div class="flex-1 overflow-hidden">
          <KpiCreateContent @submit="$emit('submit', $event); close()" @close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
