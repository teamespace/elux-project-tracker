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
    class="flex h-full shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-200"
    :class="isOpen ? 'w-[240px]' : 'w-[72px]'"

  >
    <!-- Workspace header -->
    <div
      class="flex h-[60px] items-center border-b border-neutral-100"
      :class="isOpen ? 'gap-2 px-5' : 'justify-center px-3'"
    >
      <div
        class="flex size-7 items-center justify-center rounded-md bg-neutral-900 text-[12px] font-bold text-white"
        :title="isOpen ? undefined : 'Elux Space'"
      >
        E
      </div>
      <span v-if="isOpen" class="text-[15px] font-semibold tracking-tight text-neutral-900">Elux Space</span>
    </div>

    <!-- Workspace section -->
    <div class="flex flex-col gap-1 px-3 pt-5" :class="{ 'px-2': !isOpen }">
      <div v-if="isOpen" class="px-3 pb-1">
        <p class="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Workspace</p>
      </div>
      <SidebarNavItem
        v-for="item in workspaceNavItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :active="route.path === item.to || route.path.startsWith(item.to + '/')"
        :collapsed="!isOpen"
      />
    </div>

    <!-- Personal section -->
    <div class="flex flex-col gap-1 px-3 pt-5" :class="{ 'px-2': !isOpen }">
      <div v-if="isOpen" class="px-3 pb-1">
        <p class="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Personal</p>
      </div>
      <SidebarNavItem
        v-for="item in personalNavItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :active="route.path === item.to || route.path.startsWith(item.to + '/')"
        :collapsed="!isOpen"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Bottom nav section -->
    <div class="flex flex-col gap-1 px-3 pb-3" :class="{ 'px-2': !isOpen }">
      <SidebarNavItem
        v-for="item in footerNavItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :active="route.path === item.to || route.path.startsWith(item.to + '/')"
        :collapsed="!isOpen"
      />
    </div>

    <!-- User footer / profile card -->
    <div
      class="flex items-center border-t border-neutral-100 px-3 py-3"
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
        <span class="truncate text-[13px] font-medium text-neutral-900">Rasya Ardiansyah</span>
        <span class="truncate text-[11px] text-neutral-500">Product Designer</span>
      </div>
      <button
        v-if="isOpen"
        type="button"
        class="flex size-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <UIcon name="ph:dots-three-vertical" class="size-4" />
      </button>
    </div>
  </aside>
</template>
