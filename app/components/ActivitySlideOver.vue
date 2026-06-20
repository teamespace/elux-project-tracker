// styled: agent-6
<script setup lang="ts">
import { ref } from 'vue'
import { activityItems, type ActivityType } from '~/shared/activity'

const { state, close, setView } = useActivitySlideOver()

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const layoutOptions = [
  { value: 'side', label: 'Side peek', icon: 'ph:sidebar' },
  { value: 'center', label: 'Center peek', icon: 'ph:rectangle' },
  { value: 'full', label: 'Full page', icon: 'ph:arrows-out' },
  { value: 'newtab', label: 'New tab', icon: 'ph:arrow-square-out' },
] as const

function setLayout(view: 'side' | 'center' | 'full' | 'newtab') {
  if (view === 'full') {
    close()
    navigateTo('/activity')
    return
  }
  if (view === 'newtab') {
    window.open('/activity', '_blank')
    close()
    return
  }
  setView(view)
  menuOpen.value = false
}

const search = ref('')

const actionOptions: ActivityType[] = ['moved', 'created', 'completed', 'commented', 'assigned']
const selectedActions = ref<ActivityType[]>([...actionOptions])

const people = computed(() => [...new Set(activityItems.map(i => i.person))])
const selectedPeople = ref<string[]>([...people.value])

const actionOpen = ref(false)
const personOpen = ref(false)
const actionRef = ref<HTMLElement | null>(null)
const personRef = ref<HTMLElement | null>(null)

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activityItems.filter((item) => {
    const text = `${item.actor.name} ${item.text} ${item.project} ${item.time}`.toLowerCase()
    const matchesSearch = !q || text.includes(q)
    const matchesAction = selectedActions.value.length === 0 || selectedActions.value.includes(item.type)
    const matchesPerson = selectedPeople.value.length === 0 || selectedPeople.value.includes(item.person)
    return matchesSearch && matchesAction && matchesPerson
  })
})

function actionLabel(action: ActivityType) {
  return action.charAt(0).toUpperCase() + action.slice(1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) {
    close()
  }
}

function onDocumentClick(event: MouseEvent) {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
  if (actionOpen.value && actionRef.value && !actionRef.value.contains(event.target as Node)) {
    actionOpen.value = false
  }
  if (personOpen.value && personRef.value && !personRef.value.contains(event.target as Node)) {
    personOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onDocumentClick)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-[0.98]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <div
        v-if="state.isOpen"
        :class="[
          state.view === 'center'
            ? 'left-1/2 top-1/2 h-[85vh] w-full max-w-[680px] -translate-x-1/2 -translate-y-1/2'
            : 'bottom-2 right-2 top-2 h-[calc(100vh-16px)] w-full max-w-[640px]',
        ]"
        class="fixed z-50 flex flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Recent Activity"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
          <div ref="menuRef" class="relative flex items-center gap-1">
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              square
              icon="ph:arrows-out"
              title="Open full page"
              @click="setLayout('full')"
            />
            <div class="h-4 w-px bg-gray-200" />
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              square
              icon="ph:layout"
              title="Change view"
              @click="menuOpen = !menuOpen"
            />

            <!-- Layout menu -->
            <div
              v-if="menuOpen"
              class="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <button
                v-for="opt in layoutOptions"
                :key="opt.value"
                class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                @click="setLayout(opt.value)"
              >
                <UIcon :name="opt.icon" class="size-4 shrink-0 text-gray-500" />
                <span>{{ opt.label }}</span>
                <UIcon
                  v-if="(opt.value === 'side' || opt.value === 'center') && state.view === opt.value"
                  name="ph:check"
                  class="ml-auto size-4 text-blue-600"
                />
              </button>
            </div>
          </div>

          <UButton
            variant="ghost"
            color="neutral"
            size="xs"
            square
            icon="ph:x"
            title="Close"
            @click="close"
          />
        </div>

        <!-- Head -->
        <div class="shrink-0 px-5 pt-5">
          <h2 class="mb-3 text-[17px] font-bold text-gray-900">Recent Activity</h2>

          <!-- Search -->
          <div class="mb-2.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <UIcon name="ph:magnifying-glass" class="size-3.5 shrink-0 text-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Search activity..."
              class="min-w-0 flex-1 bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
            >
          </div>

          <!-- Filter bar -->
          <div class="flex flex-wrap gap-1.5 border-b border-gray-100 pb-3">
            <div ref="actionRef" class="relative">
              <button
                :class="actionOpen ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                @click="actionOpen = !actionOpen"
              >
                Action
                <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="actionOpen ? 'rotate-180' : ''" />
              </button>
              <div
                v-if="actionOpen"
                class="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              >
                <label
                  v-for="a in actionOptions"
                  :key="a"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <input
                    v-model="selectedActions"
                    type="checkbox"
                    :value="a"
                    class="size-3.5 shrink-0 accent-blue-600"
                  >
                  <span>{{ actionLabel(a) }}</span>
                </label>
              </div>
            </div>

            <div ref="personRef" class="relative">
              <button
                :class="personOpen ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                @click="personOpen = !personOpen"
              >
                Person
                <UIcon name="ph:caret-down" class="size-3 transition-transform" :class="personOpen ? 'rotate-180' : ''" />
              </button>
              <div
                v-if="personOpen"
                class="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-[10px] border border-gray-200 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
              >
                <label
                  v-for="p in people"
                  :key="p"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <input
                    v-model="selectedPeople"
                    type="checkbox"
                    :value="p"
                    class="size-3.5 shrink-0 accent-blue-600"
                  >
                  <span>{{ p }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="flex cursor-pointer gap-3 border-b border-gray-100 px-5 py-3 transition-colors hover:bg-gray-50"
          >
            <UAvatar
              :src="item.actor.avatar"
              :text="item.actor.initials"
              size="md"
              class="shrink-0 text-[11.5px] font-semibold text-white"
              :style="{ backgroundColor: item.actor.color }"
            />
            <div class="min-w-0 flex-1">
              <p class="text-[13px] leading-relaxed text-gray-700">
                <strong class="font-semibold text-gray-900">{{ item.actor.name }}</strong>
                {{ item.text }}
              </p>
              <div class="mt-0.5 flex items-center gap-2">
                <span class="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600">{{ item.project }}</span>
                <span class="text-[11px] text-gray-400">{{ item.time }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredItems.length === 0" class="py-10 text-center text-[13px] text-gray-400">
            No activity matches your filters.
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
