<script setup lang="ts">
const AUTH_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop'
</script>

<template>
  <div class="flex min-h-screen w-full bg-white">
    <!-- Left: image / visual side -->
    <aside class="relative hidden overflow-hidden lg:block lg:w-1/2 xl:w-[55%]">
      <img
        :src="AUTH_IMAGE"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      >
      <!-- Gradient overlay for legibility -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/55 via-black/25 to-black/45" />

      <!-- Top brand -->
      <div class="absolute left-10 top-10 z-10 flex items-center gap-2.5 text-white">
        <div class="grid size-9 place-items-center rounded-[10px] bg-white/15 backdrop-blur-md ring-1 ring-white/25">
          <UIcon name="ph:mountains-duotone" class="size-5" />
        </div>
        <div class="leading-tight">
          <div class="text-[15px] font-semibold tracking-tight">Elux Tracker</div>
          <div class="text-[11px] text-white/70">Project workspace</div>
        </div>
      </div>

      <!-- Bottom testimonial -->
      <div class="absolute inset-x-10 bottom-10 z-10 max-w-md text-white">
        <UIcon name="ph:quotes" class="size-7 text-white/60" />
        <p class="mt-3 text-[20px] font-medium leading-[1.4] tracking-tight">
          One workspace to plan, track, and ship every project with your team.
        </p>
        <div class="mt-5 flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-full bg-white/20 text-[12px] font-semibold backdrop-blur-md ring-1 ring-white/30">
            R
          </div>
          <div class="leading-tight">
            <div class="text-[13px] font-medium">Rasya Aulia</div>
            <div class="text-[11px] text-white/70">Product Designer · Elux</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Right: form side -->
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
  </div>
</template>