<script setup lang="ts">
interface NavItem {
  label: string
  icon: string
  to: string
}

const route = useRoute()
const { isOpen } = useSidebar()

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
    class="flex h-full shrink-0 flex-col bg-[#F5F5F5] pt-4 transition-all duration-200"
    :class="isOpen ? 'w-[240px]' : 'w-[72px]'"
  >
    <!-- Workspace header -->
    <div
      class="flex h-[48px] items-center px-4"
      :class="isOpen ? 'gap-2' : 'justify-center px-3'"
    >
      <div
        class="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-[11px] font-bold text-white"
        :title="isOpen ? undefined : 'Elux Space'"
      >
        E
      </div>
      <span v-if="isOpen" class="text-[15px] font-semibold text-gray-900">Elux Space</span>
    </div>

    <!-- Workspace section -->
    <div v-if="isOpen" class="px-4 pb-1 pt-1">
      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Workspace</p>
    </div>
    <nav class="flex flex-col gap-0.5 px-3" :class="{ 'px-2': !isOpen }">
      <SidebarNavItem
        v-for="item in workspaceNavItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :active="route.path === item.to || route.path.startsWith(item.to + '/')"
        :collapsed="!isOpen"
      />
    </nav>

    <!-- Personal section -->
    <div v-if="isOpen" class="px-4 pb-1 pt-4">
      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Personal</p>
    </div>
    <nav class="flex flex-col gap-0.5 px-3" :class="{ 'px-2': !isOpen }">
      <SidebarNavItem
        v-for="item in personalNavItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :active="route.path === item.to || route.path.startsWith(item.to + '/')"
        :collapsed="!isOpen"
      />
    </nav>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Bottom nav section -->
    <nav class="flex flex-col gap-0.5 px-3 pb-2" :class="{ 'px-2': !isOpen }">
      <NuxtLink
        v-for="item in footerNavItems"
        :key="item.label"
        :to="item.to"
        :title="!isOpen ? item.label : undefined"
        class="flex h-9 items-center rounded-lg text-[14px] font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        :class="isOpen ? 'gap-2 px-3' : 'justify-center px-2'"
      >
        <UIcon :name="item.icon" class="size-4 shrink-0 text-gray-500" />
        <span v-if="isOpen">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User footer / profile card -->
    <div
      class="flex items-center border-t border-gray-200 px-3 py-3"
      :class="isOpen ? 'gap-3' : 'justify-center'"
    >
      <UAvatar
        src="https://api.dicebear.com/9.x/micah/svg?seed=Rasya"
        text="R"
        size="sm"
        class="shrink-0"
        :title="isOpen ? undefined : 'Rasya Ardiansyah'"
      />
      <div v-if="isOpen" class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-[13px] font-medium text-gray-900">Rasya Ardiansyah</span>
        <span class="truncate text-[11px] text-gray-500">Product Designer</span>
      </div>
      <button
        v-if="isOpen"
        type="button"
        class="flex size-7 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <UIcon name="ph:dots-three-vertical" class="size-4" />
      </button>
    </div>
  </aside>
</template>
