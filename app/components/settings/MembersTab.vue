<script setup lang="ts">
interface Member {
  id: string
  name: string
  initials: string
  role: string
  color: string
}

defineProps<{
  members: Member[]
  roleBadge: Record<string, string>
}>()
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">Members</h2>
      <UButton color="primary" icon="ph:plus" size="sm">Invite Member</UButton>
    </div>

    <p class="text-[13px] text-gray-500">Manage who has access to this workspace.</p>

    <div class="divide-y divide-gray-100">
      <div
        v-for="member in members"
        :key="member.id"
        class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
      >
        <img
          :src="`https://api.dicebear.com/7.2/initials/svg?seed=${member.initials}&backgroundColor=${member.color}`"
          :alt="member.name"
          class="size-9 rounded-full bg-gray-100"
        >
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-medium text-gray-900">{{ member.name }}</p>
        </div>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-medium"
          :class="roleBadge[member.role] || 'bg-gray-100 text-gray-500'"
        >
          {{ member.role }}
        </span>
      </div>
    </div>
  </div>
</template>
