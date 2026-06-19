<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Settings',
})

const activeTab = ref<'general' | 'profile' | 'appearance' | 'members' | 'notifications' | 'billing' | 'danger'>('general')

const tabs = [
  { id: 'general' as const, label: 'General', icon: 'ph:gear' },
  { id: 'profile' as const, label: 'Profile', icon: 'ph:user' },
  { id: 'appearance' as const, label: 'Appearance', icon: 'ph:paint-brush' },
  { id: 'members' as const, label: 'Members', icon: 'ph:users' },
  { id: 'notifications' as const, label: 'Notifications', icon: 'ph:bell' },
  { id: 'billing' as const, label: 'Billing', icon: 'ph:credit-card' },
  { id: 'danger' as const, label: 'Danger Zone', icon: 'ph:warning' },
]

const generalForm = reactive({
  workspaceName: 'Elux Workspace',
  language: 'en',
  timezone: 'asia-jakarta',
  dateFormat: 'dd-mm-yyyy',
})

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Indonesia', value: 'id' },
]

const timezoneOptions = [
  { label: 'Asia/Jakarta (WIB)', value: 'asia-jakarta' },
  { label: 'Asia/Makassar (WITA)', value: 'asia-makassar' },
  { label: 'Asia/Jayapura (WIT)', value: 'asia-jayapura' },
  { label: 'UTC', value: 'utc' },
]

const dateFormatOptions = [
  { label: 'DD/MM/YYYY', value: 'dd-mm-yyyy' },
  { label: 'MM/DD/YYYY', value: 'mm-dd-yyyy' },
  { label: 'YYYY-MM-DD', value: 'yyyy-mm-dd' },
]

const profileForm = reactive({
  fullName: 'Rasya Elux',
  email: 'rasya@elux.dev',
  role: 'Admin',
  avatarUrl: 'https://api.dicebear.com/7.2/initials/svg?seed=RE&backgroundColor=b6e3f4',
  bio: '',
})

const appearanceTheme = ref('light')
const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

const members = reactive([
  { id: '1', name: 'Rasya Elux', initials: 'RE', role: 'Admin', color: 'b6e3f4' },
  { id: '2', name: 'Maya Putri', initials: 'MP', role: 'Editor', color: 'c0aede' },
  { id: '3', name: 'Dito Prasetyo', initials: 'DP', role: 'Viewer', color: 'd1d4f9' },
  { id: '4', name: 'Rara Wulandari', initials: 'RW', role: 'Editor', color: 'ffd5dc' },
])

const memberRoleBadge: Record<string, string> = {
  Admin: 'bg-blue-50 text-blue-600',
  Editor: 'bg-green-50 text-green-600',
  Viewer: 'bg-gray-100 text-gray-500',
}

const notifPrefs = reactive({
  projectUpdates: true,
  taskAssignments: true,
  mentions: true,
  comments: false,
  weeklyDigest: true,
  frequency: 'realtime',
})

const frequencyOptions = [
  { label: 'Real-time', value: 'realtime' },
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
]

const billingUsage = {
  plan: 'Free',
  members: '4 / 5',
  projects: '3 / 5',
  storage: '120 MB / 1 GB',
}
</script>

<template>
  <div class="flex gap-6">
    <nav class="w-48 shrink-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors"
        :class="activeTab === tab.id ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
        @click="activeTab = tab.id"
      >
        <UIcon :name="tab.icon" class="size-4 shrink-0" />
        {{ tab.label }}
      </button>
    </nav>

    <div class="min-w-0 flex-1">
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <SettingsGeneralTab
          v-if="activeTab === 'general'"
          v-model:form="generalForm"
          :language-options="languageOptions"
          :timezone-options="timezoneOptions"
          :date-format-options="dateFormatOptions"
        />
        <SettingsProfileTab
          v-else-if="activeTab === 'profile'"
          v-model:form="profileForm"
        />
        <SettingsAppearanceTab
          v-else-if="activeTab === 'appearance'"
          v-model:theme="appearanceTheme"
          :theme-options="themeOptions"
        />
        <SettingsMembersTab
          v-else-if="activeTab === 'members'"
          :members="members"
          :role-badge="memberRoleBadge"
        />
        <SettingsNotificationsTab
          v-else-if="activeTab === 'notifications'"
          v-model:prefs="notifPrefs"
          :frequency-options="frequencyOptions"
        />
        <SettingsBillingTab
          v-else-if="activeTab === 'billing'"
          :usage="billingUsage"
        />
        <SettingsDangerTab v-else-if="activeTab === 'danger'" />
      </div>
    </div>
  </div>
</template>
