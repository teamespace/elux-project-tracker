<script setup lang="ts">
defineProps<{
  theme: string
  themeOptions: { label: string; value: string }[]
}>()

defineEmits<{
  'update:theme': [value: string]
}>()
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">Appearance</h2>
    <p class="text-[13px] text-gray-500">Customize how the app looks on your device.</p>

    <div>
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Theme</label>
      <USelect :model-value="theme" :items="themeOptions" value-key="value" label-key="label" class="max-w-xs" @update:model-value="$emit('update:theme', $event)" />
    </div>

    <div class="grid grid-cols-3 gap-3 pt-2">
      <button
        type="button"
        class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors"
        :class="theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <div class="flex size-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <UIcon name="ph:sun" class="size-6 text-amber-500" />
        </div>
        <span class="text-[12px] font-medium text-gray-700">Light</span>
      </button>

      <button
        type="button"
        class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors"
        :class="theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <div class="flex size-12 items-center justify-center rounded-lg bg-gray-900 shadow-sm">
          <UIcon name="ph:moon" class="size-6 text-blue-300" />
        </div>
        <span class="text-[12px] font-medium text-gray-700">Dark</span>
      </button>

      <button
        type="button"
        class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors"
        :class="theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
      >
        <div class="flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-white to-gray-900 shadow-sm ring-1 ring-gray-200">
          <UIcon name="ph:desktop" class="size-6 text-gray-500" />
        </div>
        <span class="text-[12px] font-medium text-gray-700">System</span>
      </button>
    </div>
  </div>
</template>
