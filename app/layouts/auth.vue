<script setup lang="ts">
const AUTH_IMAGE = '/images/auth-hero.webp'
</script>

<template>
  <div class="flex min-h-screen w-full bg-white">
    <!-- Left: form side -->
    <main class="flex w-full flex-col lg:w-1/2 xl:w-[45%]">
      <div class="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div class="w-full max-w-[380px]">
          <slot />
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 pb-6 sm:px-10">
        <div class="flex items-center justify-between text-[12px] text-gray-500">
          <span>© {{ new Date().getFullYear() }} Elux Tracker</span>
          <div class="flex items-center gap-4">
            <a href="#" class="transition-colors hover:text-gray-900">Privacy</a>
            <a href="#" class="transition-colors hover:text-gray-900">Terms</a>
            <a href="#" class="transition-colors hover:text-gray-900">Help</a>
          </div>
        </div>
      </div>
    </main>

    <!-- Right: image / visual side -->
    <aside class="relative hidden overflow-hidden lg:block lg:w-1/2 xl:w-[55%]">
      <img
        :src="AUTH_IMAGE"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      >
      <!-- Soft overlay so brand mark stays legible -->
      <div class="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-black/15" />

      <!-- Top brand mark on image -->
      <div class="absolute left-10 top-10 z-10 flex items-center gap-2.5">
        <div class="grid size-9 place-items-center rounded-[10px] bg-white/85 backdrop-blur-md ring-1 ring-white/40 shadow-sm">
          <UIcon name="ph:mountains-duotone" class="size-5 text-[var(--color-accent)]" />
        </div>
        <div class="leading-tight">
          <div class="text-[15px] font-semibold tracking-tight text-gray-900">Elux Tracker</div>
          <div class="text-[11px] text-gray-600">Project workspace</div>
        </div>
      </div>
    </aside>
  </div>
</template>