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
    class="flex h-9 items-center rounded-lg text-[14px] font-medium transition-colors"
    :class="[
      active
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      collapsed ? 'justify-center px-2' : 'gap-2 px-3',
    ]"
  >
    <UIcon
      :name="icon"
      class="size-4 shrink-0"
      :class="active ? 'text-gray-900' : 'text-gray-500'"
    />
    <span v-if="!collapsed">{{ label }}</span>
  </NuxtLink>
</template>
