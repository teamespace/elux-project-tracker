<script setup lang="ts">
interface NotifPrefs {
  projectUpdates: boolean
  taskAssignments: boolean
  mentions: boolean
  comments: boolean
  weeklyDigest: boolean
  frequency: string
}

interface Props {
  prefs: NotifPrefs
  frequencyOptions: { label: string; value: string }[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:prefs': [value: NotifPrefs]
}>()

function toggle(key: 'projectUpdates' | 'taskAssignments' | 'mentions' | 'comments' | 'weeklyDigest') {
  emit('update:prefs', { ...props.prefs, [key]: !props.prefs[key] })
}

function setFrequency(value: string) {
  emit('update:prefs', { ...props.prefs, frequency: value })
}

const toggles: { key: 'projectUpdates' | 'taskAssignments' | 'mentions' | 'comments' | 'weeklyDigest'; label: string; description: string }[] = [
  { key: 'projectUpdates', label: 'Project updates', description: 'Status changes, milestones, and completions' },
  { key: 'taskAssignments', label: 'Task assignments', description: 'When a task is assigned to you' },
  { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in a comment' },
  { key: 'comments', label: 'Comments', description: 'New comments on tasks you follow' },
  { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of activity each Monday' },
]
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">Notifications</h2>
    <p class="text-[13px] text-gray-500">Choose what you want to be notified about.</p>

    <div class="divide-y divide-gray-100">
      <div
        v-for="item in toggles"
        :key="item.key"
        class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
      >
        <div>
          <p class="text-[13px] font-medium text-gray-900">{{ item.label }}</p>
          <p class="text-[12px] text-gray-500">{{ item.description }}</p>
        </div>
        <UToggle
          :model-value="prefs[item.key]"
          @update:model-value="toggle(item.key)"
        />
      </div>
    </div>

    <div class="border-t border-gray-100 pt-5">
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Notification Frequency</label>
      <USelect
        :model-value="prefs.frequency"
        :items="frequencyOptions"
        value-key="value"
        label-key="label"
        class="max-w-xs"
        @update:model-value="setFrequency($event)"
      />
    </div>

    <div class="flex justify-end pt-2">
      <UButton color="primary">Save Preferences</UButton>
    </div>
  </div>
</template>
