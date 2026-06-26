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
    </aside>
  </div>
</template>