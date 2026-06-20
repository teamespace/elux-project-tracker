// styled: agent-7
<script setup lang="ts">
import { activityActionOptions, activityItems, activityPeopleOptions, type ActivityType } from '~/shared/activity'

interface FilterState {
  open: boolean
  selected: string[]
}

definePageMeta({
  layout: 'default',
  title: 'Recent Activity',
})

const search = ref('')
const actionFilter = reactive<FilterState>({ open: false, selected: activityActionOptions.map((o: { value: ActivityType; label: string }) => o.value) })
const personFilter = reactive<FilterState>({ open: false, selected: [...activityPeopleOptions] })

const filteredActivity = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activityItems.filter((item) => {
    const text = `${item.actor.name} ${item.text} ${item.project}`.toLowerCase()
    const matchesSearch = !q || text.includes(q)
    const matchesAction = actionFilter.selected.includes(item.type)
    const matchesPerson = personFilter.selected.includes(item.person)
    return matchesSearch && matchesAction && matchesPerson
  })
})

function toggleFilterItem(filter: FilterState, value: string) {
  if (filter.selected.includes(value)) {
    filter.selected = filter.selected.filter(v => v !== value)
  }
  else {
    filter.selected = [...filter.selected, value]
  }
}

function filterLabel(filter: FilterState, fallback: string) {
  if (filter.selected.length === 0) return `${fallback}: None`
  if (filter.selected.length === 1) {
    const option = activityActionOptions.find((o: { value: ActivityType; label: string }) => o.value === filter.selected[0])
    return `${fallback}: ${option?.label ?? filter.selected[0]}`
  }
  return `${fallback}: ${filter.selected.length} selected`
}

function closeFilters() {
  actionFilter.open = false
  personFilter.open = false
}

function onWindowClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeFilters()
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-5">
      <div class="mb-1.5 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <h1 class="text-[22px] font-bold text-gray-900">
            Recent Activity
          </h1>
          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[14px] font-medium text-gray-400">
            {{ activityItems.length }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-3 text-[13px] text-gray-400">
        <span>Workspace · All members</span>
        <span>·</span>
        <span>Last 7 days</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <div class="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 max-w-xs">
        <UIcon name="ph:magnifying-glass" class="size-3.5 shrink-0 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search activity..."
          class="w-full bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
        >
      </div>

      <div class="relative">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50"
          :class="{ 'border-blue-500 bg-blue-50 text-blue-600': actionFilter.open }"
          @click="actionFilter.open = !actionFilter.open; personFilter.open = false"
        >
          {{ filterLabel(actionFilter, 'Action') }}
          <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="{ 'rotate-180': actionFilter.open }" />
        </button>
        <div
          v-if="actionFilter.open"
          class="absolute top-full left-0 z-20 mt-1.5 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <label
            v-for="option in activityActionOptions"
            :key="option.value"
            class="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              class="size-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="actionFilter.selected.includes(option.value)"
              @change="toggleFilterItem(actionFilter, option.value)"
            >
            {{ option.label }}
          </label>
        </div>
      </div>

      <div class="relative">
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50"
          :class="{ 'border-blue-500 bg-blue-50 text-blue-600': personFilter.open }"
          @click="personFilter.open = !personFilter.open; actionFilter.open = false"
        >
          {{ filterLabel(personFilter, 'Person') }}
          <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="{ 'rotate-180': personFilter.open }" />
        </button>
        <div
          v-if="personFilter.open"
          class="absolute top-full left-0 z-20 mt-1.5 min-w-[160px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <label
            v-for="person in activityPeopleOptions"
            :key="person"
            class="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              class="size-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="personFilter.selected.includes(person)"
              @change="toggleFilterItem(personFilter, person)"
            >
            {{ person }}
          </label>
        </div>
      </div>
    </div>

    <!-- Activity list card -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white" @click="closeFilters">
      <div class="flex flex-col">
        <div
          v-for="(item, index) in filteredActivity"
          :key="item.id"
          class="flex gap-3 px-5 py-3 transition-colors hover:bg-gray-50"
          :class="index !== filteredActivity.length - 1 ? 'border-b border-gray-100' : ''"
        >
          <UAvatar
            :src="item.actor.avatar"
            :text="item.actor.initials"
            size="md"
            class="shrink-0 text-[11.5px] font-semibold text-white"
            :style="{ backgroundColor: item.actor.color }"
          />
          <div class="min-w-0 flex-1 pt-0.5">
            <p class="text-[13px] leading-relaxed text-gray-700">
              <span class="font-semibold text-gray-900">{{ item.actor.name }}</span>
              {{ item.text }}
            </p>
            <div class="mt-1 flex items-center gap-2">
              <span class="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600">
                {{ item.project }}
              </span>
              <span class="text-[11px] text-gray-400">{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="filteredActivity.length === 0" class="px-5 py-8 text-center text-[13px] text-gray-500">
          No activity matches the selected filters.
        </div>
      </div>
    </div>
  </div>
</template>
