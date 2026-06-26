<script setup lang="ts">
import { unreadCount, markAllRead } from '~/shared/notifications'
import { getAvatar } from '~/shared/avatar'

const { data: notifData } = await useAsyncData('notifications', () =>
  $fetch('/api/notifications')
)
const notifications = computed(() => notifData.value ?? [])

definePageMeta({
  layout: 'default',
  title: 'Notifications',
  middleware: 'auth',
})

type Filter = 'all' | 'unread' | 'mentions'
const activeFilter = ref<Filter>('all')

const filtered = computed(() => {
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.read)
  if (activeFilter.value === 'mentions') return notifications.value.filter(n => n.type === 'mention')
  return notifications.value
})

</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">Notifications</h1>
      <UButton variant="ghost" color="neutral" size="sm" @click="markAllRead">
        Mark all read
      </UButton>
    </div>

    <!-- Filter tabs -->
    <div class="mb-4 flex gap-2 border-b border-gray-200">
      <button
        v-for="filter in ['all', 'unread', 'mentions']"
        :key="filter"
        class="px-3 py-2 text-[13px] font-medium transition-colors"
        :class="activeFilter === filter ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        @click="activeFilter = filter"
      >
        {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
        <span v-if="filter === 'unread'" class="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
          {{ unreadCount() }}
        </span>
      </button>
    </div>

    <!-- Notification list -->
    <div class="flex flex-col gap-2">
      <div
        v-for="notif in filtered"
        :key="notif.id"
        class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
        :class="{ 'bg-blue-50/30': !notif.read }"
      >
        <UAvatar
          :src="getAvatar(notif.actor.name)"
          :text="notif.actor.name.charAt(0)"
          size="sm"
        />
        <div class="min-w-0 flex-1">
          <p class="text-[13px] text-gray-900">
            <span class="font-medium">{{ notif.actor.name }}</span>
            {{ notif.text }}
          </p>
          <p class="mt-0.5 text-[11px] text-gray-500">{{ notif.time }}</p>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="py-12 text-center text-[13px] text-gray-500">
        No notifications
      </div>
    </div>
  </div>
</template>
