// styled: agent-4
<script setup lang="ts">
interface ActivityItem {
  id: string
  actor: { initials: string; name: string; avatar?: string }
  action: string
  target: string
  project?: string
  time: string
}

const props = defineProps<{
  activity: ActivityItem[]
}>()

const displayedItems = computed(() => props.activity.slice(0, 6))
const activitySlideOver = useActivitySlideOver()

const isSystem = (name: string) => name.toLowerCase() === 'system'
</script>

<template>
  <div class="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h3 class="text-[13px] font-semibold text-gray-900">Recent Activity</h3>
      <button class="text-[12px] text-gray-400 transition-colors hover:text-gray-700" @click="activitySlideOver.open()">
        View All
      </button>
    </div>

    <div class="flex flex-col p-4">
      <div
        v-if="displayedItems.length === 0"
        class="flex flex-1 items-center justify-center py-6"
      >
        <p class="text-[13px] text-gray-500">No recent activity</p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="(item, index) in displayedItems"
          :key="item.id"
          class="flex gap-3 pb-4 last:pb-0"
        >
          <div class="relative flex flex-col items-center">
            <UAvatar
              v-if="!isSystem(item.actor.name)"
              :src="item.actor.avatar"
              :text="item.actor.initials"
              size="xs"
              class="ring-2 ring-white"
            />
            <div v-else class="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-500 ring-2 ring-white">
              <UIcon name="ph:gear" class="size-3.5 text-white" />
            </div>
            <div
              v-if="index < displayedItems.length - 1"
              class="absolute top-[26px] bottom-0 w-px bg-gray-200"
            />
          </div>

          <div class="min-w-0 flex-1 pt-0.5">
            <p class="text-[12px] leading-relaxed text-gray-700">
              <span class="font-semibold text-gray-900">{{ item.actor.name }}</span>
              {{ item.action }}
              <span class="font-medium text-blue-600">{{ item.target }}</span>
            </p>
            <div
              v-if="item.project"
              class="mt-1 inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10.5px] font-medium text-gray-600"
            >
              {{ item.project }}
            </div>
            <p class="mt-1 text-[10.5px] text-gray-400">{{ item.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
