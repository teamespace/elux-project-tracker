<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const remember = ref(true)
const loading = ref(false)
const googleLoading = ref(false)
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

async function handleGoogle() {
  googleLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 700))
    await navigateTo('/dashboard')
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Heading -->
    <div class="mb-8">
      <h1 class="text-[26px] font-semibold leading-tight tracking-tight text-gray-900">
        Welcome back
      </h1>
      <p class="mt-1.5 text-[14px] text-gray-500">
        Sign in to continue to your workspace.
      </p>
    </div>

    <!-- Google button -->
    <button
      type="button"
      :disabled="googleLoading"
      class="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white text-[14px] font-medium text-gray-700 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      @click="handleGoogle"
    >
      <UIcon v-if="googleLoading" name="ph:spinner" class="size-4 animate-spin" />
      <svg v-else class="size-[18px]" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.47 1.18 4.93l3.66-2.83z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
      <span>{{ googleLoading ? 'Signing in…' : 'Continue with Google' }}</span>
    </button>

    <!-- Divider -->
    <div class="my-5 flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200" />
      <span class="text-[11px] font-medium uppercase tracking-wider text-gray-400">or</span>
      <div class="h-px flex-1 bg-gray-200" />
    </div>

    <form class="flex flex-col gap-3.5" @submit.prevent="handleSubmit">
      <!-- Email -->
      <div>
        <label for="login-email" class="mb-1.5 block text-[13px] font-medium text-gray-700">Email</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          autocomplete="email"
          class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 transition-all duration-150 focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
          placeholder="you@example.com"
        >
      </div>

      <!-- Password -->
      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <label for="login-password" class="block text-[13px] font-medium text-gray-700">Password</label>
          <a href="#" class="text-[12px] font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]">Forgot?</a>
        </div>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 transition-all duration-150 focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
          placeholder="Enter your password"
        >
      </div>

      <!-- Remember -->
      <label class="flex cursor-pointer items-center gap-2 select-none">
        <input v-model="remember" type="checkbox" class="size-4 cursor-pointer rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent-subtle)]">
        <span class="text-[13px] text-gray-600">Keep me signed in for 30 days</span>
      </label>

      <!-- Error -->
      <div v-if="error" class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
        <UIcon name="ph:warning-circle" class="mt-0.5 size-4 shrink-0" />
        <span>{{ error }}</span>
      </div>

      <!-- Demo notice -->
      <div class="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-[12.5px] text-blue-700">
        <UIcon name="ph:info" class="mt-0.5 size-4 shrink-0" />
        <div>
          <span class="font-medium">Demo:</span>
          rasya@queebo.chat / rasya123
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="mt-1 flex h-10 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[14px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--color-accent-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UIcon v-if="loading" name="ph:spinner" class="size-4 animate-spin" />
        <span v-else>Sign in</span>
      </button>
    </form>

    <!-- Bottom switch -->
    <div class="mt-7 text-center text-[13px] text-gray-500">
      Don't have an account?
      <a href="#" class="font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]">Create one</a>
    </div>
  </div>
</template>