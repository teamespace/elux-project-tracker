<script setup lang="ts">
interface GeneralForm {
  workspaceName: string
  language: string
  timezone: string
  dateFormat: string
}

interface Props {
  form: GeneralForm
  languageOptions: { label: string; value: string }[]
  timezoneOptions: { label: string; value: string }[]
  dateFormatOptions: { label: string; value: string }[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:form': [value: GeneralForm]
}>()

function updateField<K extends keyof GeneralForm>(key: K, value: GeneralForm[K]) {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">General Settings</h2>

    <div>
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Workspace Name</label>
      <UInput :model-value="form.workspaceName" @update:model-value="updateField('workspaceName', $event)" />
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Language</label>
        <USelect :model-value="form.language" :items="languageOptions" value-key="value" label-key="label" @update:model-value="updateField('language', $event)" />
      </div>

      <div>
        <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Date Format</label>
        <USelect :model-value="form.dateFormat" :items="dateFormatOptions" value-key="value" label-key="label" @update:model-value="updateField('dateFormat', $event)" />
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Timezone</label>
      <USelect :model-value="form.timezone" :items="timezoneOptions" value-key="value" label-key="label" @update:model-value="updateField('timezone', $event)" />
    </div>

    <div class="flex justify-end pt-2">
      <UButton color="primary">Save Changes</UButton>
    </div>
  </div>
</template>
