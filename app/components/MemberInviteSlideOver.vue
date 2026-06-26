<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const { state, close, notifyCreated } = useMemberInvite()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'admin' | 'manager' | 'member' | 'intern'>('member')
const showPw = ref(false)
const saving = ref(false)
const error = ref('')

const valid = computed(() =>
  name.value.trim().length >= 2
  && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  && password.value.length >= 6
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && state.value.isOpen) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function reset() {
  name.value = ''
  email.value = ''
  password.value = ''
  role.value = 'member'
  showPw.value = false
  error.value = ''
}

async function submit() {
  if (!valid.value) return
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/members', {
      method: 'POST',
      body: { name: name.value.trim(), email: email.value.trim(), password: password.value, role: role.value },
    })
    reset()
    close()
    notifyCreated()
  } catch (err: any) {
    error.value = err?.data?.message ?? err?.statusMessage ?? 'Failed to add member'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-4 scale-[0.98]"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-4 scale-[0.98]"
    >
      <div
        v-if="state.isOpen"
        class="fixed bottom-2 right-2 top-2 z-50 flex w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-black/[0.07] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-label="Add team member"
      >
        <!-- Topbar -->
        <div class="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 class="text-[15px] font-semibold text-gray-900">Add team member</h2>
          <button class="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700" @click="close">
            <UIcon name="ph:x" class="size-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div class="flex flex-col gap-3.5">
            <!-- Name -->
            <div class="flex flex-col gap-1">
              <label class="text-[12.5px] font-medium text-gray-700">Full name</label>
              <input
                v-model="name"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-900 outline-none transition-all focus:border-[var(--color-border-focus)] focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
                placeholder="e.g. John Doe"
                autofocus
              >
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <label class="text-[12.5px] font-medium text-gray-700">Email</label>
              <input
                v-model="email"
                type="email"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-900 outline-none transition-all focus:border-[var(--color-border-focus)] focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
                placeholder="e.g. john@company.com"
              >
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-1">
              <label class="text-[12.5px] font-medium text-gray-700">Role</label>
              <select
                v-model="role"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-900 outline-none transition-all focus:border-[var(--color-border-focus)] focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member" selected>Member</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1">
              <label class="text-[12.5px] font-medium text-gray-700">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPw ? 'text' : 'password'"
                  class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[13px] text-gray-900 outline-none transition-all focus:border-[var(--color-border-focus)] focus:ring-[3px] focus:ring-[var(--color-accent-subtle)]"
                  placeholder="Min 6 characters"
                >
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  @click="showPw = !showPw"
                  type="button"
                >
                  <UIcon :name="showPw ? 'ph:eye-slash' : 'ph:eye'" class="size-4" />
                </button>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
            >
              <UIcon name="ph:warning-circle" class="mt-0.5 size-4 shrink-0" />
              <span>{{ error }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3">
          <div class="text-[12px] text-gray-400">Member will use email to sign in</div>
          <div class="flex items-center gap-2">
            <button class="h-8 rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-50" @click="close">
              Cancel
            </button>
            <button
              :disabled="!valid || saving"
              class="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              @click="submit"
            >
              <UIcon v-if="saving" name="ph:spinner" class="size-4 animate-spin" />
              <span v-else>Add member</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
