<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err?.data?.message ?? err?.statusMessage ?? 'Invalid email or password.'
  }

  loading.value = false
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <div>
      <label class="mb-1 block text-[13px] font-medium text-[var(--color-text-secondary)]">Email</label>
      <input
        v-model="email"
        type="email"
        class="h-8 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
        placeholder="rasya@queebo.chat"
      >
    </div>
    <div>
      <label class="mb-1 block text-[13px] font-medium text-[var(--color-text-secondary)]">Password</label>
      <input
        v-model="password"
        type="password"
        class="h-8 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-base)] px-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
        placeholder="Enter password"
      >
    </div>

    <!-- Error -->
    <div v-if="error" class="rounded-md bg-[var(--color-status-delayed-bg)] px-3 py-2 text-[13px] text-[var(--color-status-delayed)]">
      {{ error }}
    </div>

    <div class="rounded-md bg-blue-50 px-3 py-2 text-[13px] text-blue-700">
      <strong>Demo:</strong> rasya@queebo.chat / rasya123
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="mt-2 flex h-8 items-center justify-center rounded-md bg-[var(--color-accent)] px-3 text-sm font-medium text-white transition-colors duration-100 hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <UIcon v-if="loading" name="ph:spinner" class="size-4 animate-spin" />
      <span v-else>Sign in</span>
    </button>
  </form>
</template>
