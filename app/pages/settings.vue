<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Settings',
})

const sections = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'ph:user',
    description: 'Update your name, avatar, role, and timezone.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'ph:bell',
    description: 'Choose when and how you receive email and in-app alerts.',
  },
  {
    id: 'workspace',
    title: 'Workspace',
    icon: 'ph:buildings',
    description: 'Manage workspace name, members, and integrations.',
  },
]
</script>

<template>
  <div>
    <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        v-for="section in sections"
        :key="section.id"
        class="rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
      >
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UIcon :name="section.icon" class="size-5" />
          </div>
          <h3 class="text-[15px] font-semibold text-gray-900">{{ section.title }}</h3>
        </div>
        <p class="mt-2 text-[13px] text-gray-500">{{ section.description }}</p>
        <button
          type="button"
          class="mt-4 text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Edit {{ section.title }}
        </button>
      </div>
    </div>

    <div class="mt-6 rounded-lg border border-gray-200 bg-white p-5">
      <h3 class="text-[15px] font-semibold text-gray-900">Danger Zone</h3>
      <p class="mt-1 text-[13px] text-gray-500">These actions are permanent and cannot be undone.</p>
      <div class="mt-4 flex gap-3">
        <button
          type="button"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Reset workspace
        </button>
        <button
          type="button"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Delete account
        </button>
      </div>
    </div>
  </div>
</template>
