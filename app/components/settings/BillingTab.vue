<script setup lang="ts">
defineProps<{
  usage: {
    plan: string
    members: string
    projects: string
    storage: string
  }
}>()

const stats = [
  { label: 'Members', key: 'members' as const, icon: 'ph:users' },
  { label: 'Projects', key: 'projects' as const, icon: 'ph:kanban' },
  { label: 'Storage', key: 'storage' as const, icon: 'ph:hard-drives' },
]
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">Billing</h2>

    <div class="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wide text-gray-500">Current Plan</p>
          <p class="mt-1 text-xl font-bold text-gray-900">{{ usage.plan }}</p>
          <p class="mt-0.5 text-[12px] text-gray-500">Basic features for small teams</p>
        </div>
        <div class="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
          $0 / month
        </div>
      </div>
    </div>

    <div>
      <p class="mb-3 text-[11px] font-medium uppercase tracking-wide text-gray-500">Usage</p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="stat in stats"
          :key="stat.key"
          class="rounded-lg border border-gray-200 p-4"
        >
          <div class="flex items-center gap-2 text-gray-400">
            <UIcon :name="stat.icon" class="size-4" />
            <span class="text-[11px] font-medium uppercase tracking-wide">{{ stat.label }}</span>
          </div>
          <p class="mt-2 text-[15px] font-semibold text-gray-900">{{ usage[stat.key] }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-2">
      <UButton color="primary">Upgrade to Pro</UButton>
    </div>
  </div>
</template>
