// styled: agent-2
<script setup lang="ts">
interface NavItem {
  label: string
  icon: string
  to: string
}

const route = useRoute()
const { isOpen } = useSidebar()

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

const workspaceNavItems: NavItem[] = [
  { label: 'Dashboard', icon: 'ph:squares-four', to: '/dashboard' },
  { label: 'Goals', icon: 'ph:target', to: '/goals' },
  { label: 'Projects', icon: 'ph:lightning', to: '/projects' },
  { label: 'Board', icon: 'ph:kanban', to: '/board' },
]

const personalNavItems: NavItem[] = [
  { label: 'My Work', icon: 'ph:check-square', to: '/my-work' },
  { label: 'Team', icon: 'ph:users', to: '/team' },
  { label: 'Docs', icon: 'ph:files', to: '/docs' },
]

const footerNavItems: NavItem[] = [
  { label: 'Settings', icon: 'ph:gear', to: '/settings' },
  { label: 'Get Help', icon: 'ph:question', to: '/help' },
]
</script>

<template>
  <aside
    class="flex h-screen shrink-0 flex-col bg-transparent transition-all duration-200"
    :class="isOpen ? 'w-[240px]' : 'w-16'"
  >
    <!-- Brand -->
    <div
      class="flex h-16 items-center"
      :class="isOpen ? 'justify-start px-3.5 gap-2.5' : 'justify-center'"
    >
      <div
        class="flex size-7 items-center justify-center rounded-md bg-blue-600 text-[13px] font-bold text-white"
        :title="isOpen ? undefined : 'Elux Space'"
      >
        E
      </div>
      <span v-if="isOpen" class="text-[14px] font-semibold text-gray-700">Elux Space</span>
    </div>

    <!-- Workspace section -->
    <div v-if="isOpen" class="px-3 pb-1 pt-1">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Workspace</p>
    </div>
    <nav class="flex flex-col gap-0.5" :class="isOpen ? 'items-start px-0' : 'items-center px-2'">
      <NuxtLink
        v-for="item in workspaceNavItems"
        :key="item.label"
        :to="item.to"
        :title="!isOpen ? item.label : undefined"
        class="group flex items-center text-gray-400 transition-colors hover:bg-black/[0.06] hover:text-gray-700"
        :class="[
          isOpen
            ? 'h-10 w-[calc(100%-16px)] mx-2 gap-2.5 px-2.5 text-[13px] text-gray-600 rounded-lg'
            : 'size-10 justify-center rounded-[10px]',
          isActive(item.to)
            ? 'bg-white text-blue-600 shadow-sm hover:text-blue-600'
            : '',
        ]"
      >
        <UIcon :name="item.icon" class="size-[18px] shrink-0" :class="isActive(item.to) ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'" />
        <span v-if="isOpen" class="whitespace-nowrap font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Personal section -->
    <div v-if="isOpen" class="px-3 pb-1 pt-4">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Personal</p>
    </div>
    <nav class="flex flex-col gap-0.5" :class="isOpen ? 'items-start px-0' : 'items-center px-2'">
      <NuxtLink
        v-for="item in personalNavItems"
        :key="item.label"
        :to="item.to"
        :title="!isOpen ? item.label : undefined"
        class="group flex items-center text-gray-400 transition-colors hover:bg-black/[0.06] hover:text-gray-700"
        :class="[
          isOpen
            ? 'h-10 w-[calc(100%-16px)] mx-2 gap-2.5 px-2.5 text-[13px] text-gray-600 rounded-lg'
            : 'size-10 justify-center rounded-[10px]',
          isActive(item.to)
            ? 'bg-white text-blue-600 shadow-sm hover:text-blue-600'
            : '',
        ]"
      >
        <UIcon :name="item.icon" class="size-[18px] shrink-0" :class="isActive(item.to) ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'" />
        <span v-if="isOpen" class="whitespace-nowrap font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Bottom nav -->
    <nav class="flex flex-col gap-0.5" :class="isOpen ? 'items-start px-0' : 'items-center px-2'">
      <NuxtLink
        v-for="item in footerNavItems"
        :key="item.label"
        :to="item.to"
        :title="!isOpen ? item.label : undefined"
        class="group flex items-center text-gray-400 transition-colors hover:bg-black/[0.06] hover:text-gray-700"
        :class="[
          isOpen
            ? 'h-10 w-[calc(100%-16px)] mx-2 gap-2.5 px-2.5 text-[13px] text-gray-600 rounded-lg'
            : 'size-10 justify-center rounded-[10px]',
          isActive(item.to)
            ? 'bg-white text-blue-600 shadow-sm hover:text-blue-600'
            : '',
        ]"
      >
        <UIcon :name="item.icon" class="size-[18px] shrink-0" :class="isActive(item.to) ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'" />
        <span v-if="isOpen" class="whitespace-nowrap font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User footer -->
    <div
      class="flex items-center border-t border-gray-100"
      :class="isOpen ? 'gap-2.5 px-3.5 pt-3 pb-4' : 'justify-center px-2 py-3'"
    >
      <UAvatar
        src="https://api.dicebear.com/9.x/micah/svg?seed=Rasya"
        text="R"
        size="sm"
        class="shrink-0"
        :title="isOpen ? undefined : 'Rasya Ardiansyah'"
      />
      <div v-if="isOpen" class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-[13px] font-semibold text-gray-800">Rasya Ardiansyah</span>
        <span class="truncate text-[11px] text-gray-400">Product Designer</span>
      </div>
    </div>
  </aside>
</template>
