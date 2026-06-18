<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  error.value = ''

  // Simulate async login
  await new Promise(resolve => setTimeout(resolve, 1200))

  // Mock credential check
  if (email.value === 'demo@example.com' && password.value === 'password') {
    // Success — navigate to dashboard
    await router.push('/dashboard')
  } else {
    error.value = 'Invalid email or password. Try demo@example.com / password'
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
        placeholder="demo@example.com"
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
