<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  to: string
  active: boolean
  collapsed?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :title="collapsed ? label : undefined"
    class="group flex h-9 items-center rounded-md text-[13px] font-medium transition-colors"
    :class="[
      active
        ? 'bg-neutral-100 text-neutral-900'
        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
      collapsed ? 'justify-center px-2' : 'gap-2.5 px-3',
    ]"
  >
    <UIcon
      :name="icon"
      class="size-[18px] shrink-0 transition-colors"
      :class="active ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'"
    />
    <span v-if="!collapsed">{{ label }}</span>
  </NuxtLink>
</template>
