// styled: agent-2
<script setup lang="ts">
import { unreadCount } from '~/shared/notifications'

const { toggle } = useSidebar()
const search = useSearchModal()
const taskSlideOver = useTaskSlideOver()

onMounted(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      search.open()
    }
  }
  window.addEventListener('keydown', onKeyDown)
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
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

      <button
        class="inline-flex h-[34px] items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
        @click="taskSlideOver.openCreate()"
      >
        <UIcon name="ph:plus" class="size-3.5" />
        New Task
      </button>
    </div>
  </header>
</template>
