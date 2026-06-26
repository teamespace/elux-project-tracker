// styled: agent-6
<script setup lang="ts">
import { ref } from 'vue'

const { state, close } = useProjectSlideOver()

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
  if (event.key === 'Escape' && state.value.isOpen) {
    close()
  }
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
      enter-from-class="opacity-0 scale-[0.98]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <div
        v-if="state.isOpen"
        :class="[
          view === 'center'
            ? 'left-1/2 top-1/2 h-[85vh] w-full max-w-[680px] -translate-x-1/2 -translate-y-1/2'
            : 'bottom-2 right-2 top-2 h-[calc(100vh-16px)] w-full max-w-[640px]',
        ]"
        class="fixed z-50 flex flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
          <div ref="menuRef" class="relative flex items-center gap-1">
            <button
              class="so-icon-btn"
              data-tooltip="Open detail page"
              @click="navigateTo(`/projects/${state.projectId}`); close()"
            >
              <UIcon name="ph:arrow-square-out" class="size-4" />
            </button>
            <div class="h-4 w-px bg-gray-200" />
            <button
              class="so-icon-btn"
              data-tooltip="Change view"
              @click="menuOpen = !menuOpen"
            >
              <UIcon name="ph:layout" class="size-4" />
            </button>

            <!-- Layout menu -->
            <div
              v-if="menuOpen"
              class="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <button
                v-for="opt in layoutOptions"
                :key="opt.value"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                @click="setView(opt.value)"
              >
                <UIcon :name="opt.icon" class="size-4 shrink-0 text-gray-500" />
                <span>{{ opt.label }}</span>
                <UIcon
                  v-if="view === opt.value"
                  name="ph:check"
                  class="ml-auto size-4 text-blue-600"
                />
              </button>
            </div>
          </div>

          <button class="so-icon-btn" data-tooltip="Close" @click="close">
            <UIcon name="ph:x" class="size-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-hidden">
          <ProjectCreateContent
            v-if="state.mode === 'create' || state.mode === 'peek' || state.mode === 'edit'"
            :mode="state.mode === 'peek' ? 'view' : state.mode === 'edit' ? 'edit' : 'create'"
            :initial-data="state.draft"
            @close="close"
          />
          <ProjectDetailContent
            v-else
            :project-id="state.projectId"
            mode="slide-over"
            @close="close"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.so-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.so-icon-btn:hover {
  background: #F3F4F6;
  color: #111827;
}
.so-icon-btn[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1F2937;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
}
</style>
