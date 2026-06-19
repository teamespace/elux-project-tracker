<script setup lang="ts">
interface ProfileForm {
  fullName: string
  email: string
  role: string
  avatarUrl: string
  bio: string
}

interface Props {
  form: ProfileForm
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:form': [value: ProfileForm]
}>()

function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">Profile</h2>

    <div class="flex items-center gap-4">
      <img :src="form.avatarUrl" :alt="form.fullName" class="size-16 rounded-full bg-gray-100 object-cover">
      <div class="flex-1">
        <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Avatar URL (DiceBear)</label>
        <UInput :model-value="form.avatarUrl" @update:model-value="updateField('avatarUrl', $event)" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Full Name</label>
        <UInput :model-value="form.fullName" @update:model-value="updateField('fullName', $event)" />
      </div>

      <div>
        <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Email</label>
        <UInput :model-value="form.email" disabled />
      </div>
    </div>

    <div>
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Role</label>
      <UInput :model-value="form.role" class="max-w-xs" @update:model-value="updateField('role', $event)" />
    </div>

    <div>
      <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">Bio</label>
      <UTextarea :model-value="form.bio" :rows="3" placeholder="Write a short bio..." @update:model-value="updateField('bio', $event)" />
    </div>

    <div class="flex justify-end pt-2">
      <UButton color="primary">Save Changes</UButton>
    </div>
  </div>
</template>
