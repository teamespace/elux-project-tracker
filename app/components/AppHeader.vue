// styled: agent-2
<script setup lang="ts">
import { unreadCount } from '~/shared/notifications'

const { toggle } = useSidebar()
const search = useSearchModal()
const taskSlideOver = useTaskSlideOver()
const projectSlideOver = useProjectSlideOver()
const goalSlideOver = useGoalSlideOver()

const newMenuOpen = ref(false)

function toggleNewMenu() {
  newMenuOpen.value = !newMenuOpen.value
}

function closeNewMenu() {
  newMenuOpen.value = false
}

function openNewTask() {
  closeNewMenu()
  taskSlideOver.openCreate()
}

function openNewProject() {
  closeNewMenu()
  projectSlideOver.openCreate()
}

function openNewGoal() {
  closeNewMenu()
  goalSlideOver.openCreate()
}

onMounted(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      search.open()
    }
  }
  window.addEventListener('keydown', onKeyDown)
  const onOutside = (e: MouseEvent) => {
    if (!(e.target as Element).closest('.new-btn-wrap')) closeNewMenu()
  }
  window.addEventListener('click', onOutside)
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('click', onOutside)
  })
})
</script>

<template>
  <header class="flex h-[52px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
    <div class="flex items-center">
      <button
        class="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        @click="toggle"
      >
        <UIcon name="ph:sidebar" class="size-4" />
      </button>
      <div class="mx-3 h-[18px] w-px bg-gray-200" />
      <div class="text-[13px] text-gray-900">
        <slot name="breadcrumb">
          <h2 class="text-[13.5px] font-semibold text-gray-900">
            <slot />
          </h2>
        </slot>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <button
        class="hidden md:flex w-[200px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-[13px] text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-200 hover:text-gray-600"
        @click="search.open"
      >
        <UIcon name="ph:magnifying-glass" class="size-3.5" />
        <span class="flex-1 text-left">Search</span>
        <kbd class="rounded bg-white border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">⌘K</kbd>
      </button>

      <NuxtLink to="/notifications" class="relative flex size-[34px] items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
        <UIcon name="ph:bell" class="size-4" />
        <span v-if="unreadCount() > 0" class="absolute right-[6px] top-[6px] size-[7px] rounded-full bg-blue-500 ring-1.5 ring-white" />
      </NuxtLink>

      <!-- + New dropdown -->
      <div class="new-btn-wrap relative">
        <button
          class="inline-flex h-[34px] items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
          @click.stop="toggleNewMenu"
        >
          <UIcon name="ph:plus" class="size-3.5" />
          New
          <UIcon name="ph:caret-down" class="size-3 opacity-70" />
        </button>

        <div
          v-if="newMenuOpen"
          class="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[186px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button class="new-dd-item" @click="openNewProject">
            <span class="new-dd-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            New project
          </button>
          <button class="new-dd-item" @click="openNewTask">
            <span class="new-dd-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            New task
          </button>
          <button class="new-dd-item" @click="openNewGoal">
            <span class="new-dd-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
            </span>
            New goal
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.new-dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: background .1s;
}
.new-dd-item:hover { background: #F9FAFB; }
.new-dd-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #4B5563;
}
</style>
