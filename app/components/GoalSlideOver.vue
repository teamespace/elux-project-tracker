<script setup lang="ts">
import { useGoalSlideOver } from '~/composables/useGoalSlideOver'
import { goalById } from '~/shared/goals'

const { state, close } = useGoalSlideOver()

const view = ref<'side' | 'center'>('side')
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const layoutOptions = [
  { value: 'side', label: 'Side peek', icon: 'ph:sidebar' },
  { value: 'center', label: 'Center peek', icon: 'ph:rectangle' },
] as const

function setView(next: 'side' | 'center') {
  view.value = next
  menuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) close()
}

function onDocumentClick(event: MouseEvent) {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onDocumentClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onDocumentClick)
})

const goal = computed(() => state.value.draft ?? (state.value.goalId ? goalById(state.value.goalId) : undefined))
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="state.isOpen" class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" @click.self="close" />
    </Transition>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-[0.98]" enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-[0.98]">
      <div
        v-if="state.isOpen"
        :class="[
          view === 'center'
            ? 'left-1/2 top-1/2 h-[85vh] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2'
            : 'bottom-2 right-2 top-2 h-[calc(100vh-16px)] w-full max-w-[600px]',
        ]"
        class="fixed z-50 flex flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
          <div ref="menuRef" class="relative flex items-center gap-1">
            <UTooltip text="Open detail page">
              <UButton variant="ghost" color="neutral" size="xs" square icon="ph:arrow-square-out" @click="navigateTo(`/goals/${state.goalId}`); close()" />
            </UTooltip>
            <div class="h-4 w-px bg-gray-200" />
            <UTooltip text="Change view">
              <UButton variant="ghost" color="neutral" size="xs" square icon="ph:layout" @click="menuOpen = !menuOpen" />
            </UTooltip>
            <div v-if="menuOpen" class="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <button
                v-for="opt in layoutOptions" :key="opt.value"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                @click="setView(opt.value)"
              >
                <UIcon :name="opt.icon" class="size-4 shrink-0 text-gray-500" />
                <span>{{ opt.label }}</span>
                <UIcon v-if="view === opt.value" name="ph:check" class="ml-auto size-4 text-blue-600" />
              </button>
            </div>
          </div>
          <UTooltip text="Close">
            <UButton variant="ghost" color="neutral" size="xs" square icon="ph:x" @click="close" />
          </UTooltip>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-hidden">
          <GoalCreateContent v-if="state.mode === 'create'" @close="close" />
          <GoalCreateContent v-else :mode="'edit'" :initial-data="goal" @close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
