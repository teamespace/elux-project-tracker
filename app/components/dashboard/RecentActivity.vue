<script setup lang="ts">
interface ActivityItem {
  id: string
  actor: { initials: string; name: string; avatar?: string }
  action: string
  target: string
  time: string
}

const props = defineProps<{
  activity: ActivityItem[]
}>()

const displayedItems = computed(() => props.activity.slice(0, 5))

const isSystem = (name: string) => name.toLowerCase() === 'system'
</script>

<template>
  <div class="flex flex-col rounded-xl border border-neutral-200 bg-white">
    <div class="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
      <h3 class="text-[15px] font-semibold tracking-tight text-neutral-900">Recent Activity</h3>
      <NuxtLink
        to="/my-work"
        class="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
      >
        View All
      </NuxtLink>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div
        v-if="displayedItems.length === 0"
        class="flex flex-1 items-center justify-center py-10"
      >
        <p class="text-[13px] text-neutral-500">No recent activity</p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="(item, index) in displayedItems"
          :key="item.id"
          class="group flex gap-3 pb-4 last:pb-0"
        >
          <div class="flex flex-col items-center">
            <UAvatar
              v-if="!isSystem(item.actor.name)"
              :src="item.actor.avatar"
              :text="item.actor.initials"
              size="xs"
              class="ring-2 ring-white"
            />
            <div
              v-else
              class="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100"
            >
              <UIcon name="ph:gear" class="size-3.5 text-neutral-500" />
            </div>
            <div
              v-if="index < displayedItems.length - 1"
              class="mt-2 w-px flex-1 bg-neutral-100"
            />
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-[13px] leading-snug text-neutral-900">
              <span class="font-medium">{{ item.actor.name }}</span>
              <span class="text-neutral-600">{{ item.action }}</span>
              <span class="font-medium text-neutral-900">{{ item.target }}</span>
            </p>
            <p class="mt-0.5 text-[11px] text-neutral-400">{{ item.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
