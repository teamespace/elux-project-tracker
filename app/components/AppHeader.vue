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
  <header class="flex h-16 shrink-0 items-center gap-4 border-b border-neutral-100 bg-white px-8">
    <button
      type="button"
      class="mr-1 inline-flex size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      @click="toggle"
    >
      <UIcon :name="isOpen ? 'ph:sidebar-simple' : 'ph:sidebar'" class="size-[18px]" />
    </button>

    <h1 class="text-[22px] font-semibold tracking-tight text-neutral-900">
      <slot />
    </h1>

    <div class="flex-1" />

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-[13px] text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
        @click="search.open"
      >
        <UIcon name="ph:magnifying-glass" class="size-4 text-neutral-400" />
        <span class="hidden lg:block">Search</span>
        <kbd class="hidden rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-500 lg:block">⌘K</kbd>
      </button>

      <AiAssistant />

      <NuxtLink
        to="/notifications"
        class="relative inline-flex size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <UIcon name="ph:bell" class="size-[18px]" />
        <span
          v-if="unreadCount() > 0"
          class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white"
        >
          {{ unreadCount() }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>
