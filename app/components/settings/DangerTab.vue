<script setup lang="ts">
const showResetConfirm = ref(false)
const showDeleteConfirm = ref(false)

function confirmReset() {
  showResetConfirm.value = false
}

function confirmDelete() {
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-base font-semibold text-gray-900">Danger Zone</h2>
    <p class="text-[13px] text-gray-500">These actions are destructive and cannot be undone.</p>

    <div class="space-y-4">
      <div class="rounded-lg border border-red-200 p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[13px] font-semibold text-gray-900">Reset Workspace</p>
            <p class="mt-0.5 text-[12px] text-gray-500">Remove all projects, tasks, and data. Members will remain.</p>
          </div>
          <UButton
            v-if="!showResetConfirm"
            color="error"
            variant="outline"
            size="sm"
            @click="showResetConfirm = true"
          >
            Reset workspace
          </UButton>
          <div v-else class="flex gap-2">
            <UButton color="error" size="sm" @click="confirmReset">Confirm</UButton>
            <UButton color="neutral" variant="outline" size="sm" @click="showResetConfirm = false">Cancel</UButton>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-red-200 p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[13px] font-semibold text-gray-900">Delete Account</p>
            <p class="mt-0.5 text-[12px] text-gray-500">Permanently delete your account and all associated data.</p>
          </div>
          <UButton
            v-if="!showDeleteConfirm"
            color="error"
            variant="outline"
            size="sm"
            @click="showDeleteConfirm = true"
          >
            Delete account
          </UButton>
          <div v-else class="flex gap-2">
            <UButton color="error" size="sm" @click="confirmDelete">Confirm</UButton>
            <UButton color="neutral" variant="outline" size="sm" @click="showDeleteConfirm = false">Cancel</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
