<script setup lang="ts">
import { unreadCount } from '~/shared/notifications'

const { isOpen, toggle } = useSidebar()
const search = useSearchModal()

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
  <header class="flex h-14 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-5">
    <button
      class="mr-2 flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      @click="toggle"
    >
      <UIcon :name="isOpen ? 'ph:sidebar-simple' : 'ph:sidebar'" class="size-4" />
    </button>
    <h2 class="text-[15px] font-semibold text-gray-900">
      <slot />
    </h2>
    <div class="flex-1" />
    <button
      class="flex w-64 items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
      @click="search.open"
    >
      <UIcon name="ph:magnifying-glass" class="size-4" />
      <span class="flex-1 text-left">Search</span>
      <kbd class="rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-gray-400 shadow-sm">⌘K</kbd>
    </button>
    <NuxtLink to="/notifications" class="relative flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
      <UIcon name="ph:bell" class="size-4" />
      <span v-if="unreadCount() > 0" class="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
        {{ unreadCount() }}
      </span>
    </NuxtLink>
  </header>
</template>
