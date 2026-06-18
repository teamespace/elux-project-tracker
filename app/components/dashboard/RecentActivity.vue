<script setup lang="ts">
interface ActivityItem {
  id: string
  actor: { initials: string; name: string }
  action: string
  target: string
  time: string
}

const props = defineProps<{
  activity: ActivityItem[]
}>()

const displayedItems = computed(() => props.activity.slice(0, 4))

const isSystem = (name: string) => name.toLowerCase() === 'system'
</script>

<template>
  <div class="flex flex-col rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
      <h3 class="text-[16px] font-semibold text-gray-900">Recent Activity</h3>
      <NuxtLink
        to="/my-work"
        class="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        View All
      </NuxtLink>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <div
        v-if="displayedItems.length === 0"
        class="flex flex-1 items-center justify-center"
      >
        <p class="text-[13px] text-gray-500">No recent activity</p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="(item, index) in displayedItems"
          :key="item.id"
          class="flex gap-3 pb-4 last:pb-0"
        >
          <div class="flex flex-col items-center">
            <div
              v-if="isSystem(item.actor.name)"
              class="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-500"
            >
              <UIcon name="ph:gear" class="size-3.5 text-white" />
            </div>
            <div
              v-else
              class="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
            >
              {{ item.actor.initials }}
            </div>
            <div
              v-if="index < displayedItems.length - 1"
              class="mt-1.5 w-px flex-1 bg-gray-200"
            />
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-medium leading-snug text-gray-900">
              {{ item.actor.name }}
              <span class="font-normal text-gray-600">{{ item.action }}</span>
              {{ item.target }}
            </p>
            <p class="mt-0.5 text-[11px] text-gray-500">{{ item.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
